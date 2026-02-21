import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FeedbackForm from "../components/FeedbackForm";
import api from "../api/axios";

const sectionAverages = (sections = []) => {
  if (!sections.length) return "-";
  const total = sections.reduce((sum, item) => sum + (Number(item.rating) || 0), 0);
  return (total / sections.length).toFixed(2);
};

const UserDashboardPage = () => {
  const [currentRide, setCurrentRide] = useState(null);
  const [history, setHistory] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const loadCurrentRide = async () => {
    try {
      const response = await api.get("/rides/current");
      setCurrentRide(response.data.data || null);
    } catch (_error) {
      setCurrentRide(null);
    }
  };

  const loadMyFeedback = async () => {
    try {
      const response = await api.get("/feedback/mine");
      setHistory(response.data.data || []);
    } catch (_error) {
      toast.error("Failed to load your feedback history");
    }
  };

  useEffect(() => {
    loadCurrentRide();
    loadMyFeedback();
  }, []);

  const handleGenerateRide = async () => {
    setGenerating(true);
    try {
      const response = await api.post("/rides/generate");
      setCurrentRide(response.data.data || null);
      toast.success("Sample ride generated");
    } catch (_error) {
      toast.error(_error?.response?.data?.message || "Could not generate sample ride");
    } finally {
      setGenerating(false);
    }
  };

  const handleFeedbackSubmitted = async () => {
    await loadCurrentRide();
    await loadMyFeedback();
  };

  const handleSelectSection = (key) => {
    setActiveSection(key);
    setMobileSidebarOpen(false);
  };

  useEffect(() => {
    const openFromNavbar = () => setMobileSidebarOpen(true);
    window.addEventListener("open-sidebar-menu", openFromNavbar);
    return () => window.removeEventListener("open-sidebar-menu", openFromNavbar);
  }, []);

  return (
    <main className="min-h-[calc(100vh-70px)] bg-slate-50/50 px-4 py-6 md:px-8">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm md:hidden" onClick={() => setMobileSidebarOpen(false)}>
          <aside className="h-full w-72 bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">User Menu</p>
              <button onClick={() => setMobileSidebarOpen(false)} className="text-sm font-bold text-slate-400">✕</button>
            </div>
            <nav className="space-y-2">
              <button
                onClick={() => handleSelectSection("dashboard")}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition-all ${
                  activeSection === "dashboard" ? "bg-sky-700 text-white shadow-lg shadow-sky-100" : "text-slate-600 hover:bg-sky-50"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleSelectSection("my-ratings")}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition-all ${
                  activeSection === "my-ratings" ? "bg-sky-700 text-white shadow-lg shadow-sky-100" : "text-slate-600 hover:bg-sky-50"
                }`}
              >
                My Ratings
              </button>
            </nav>
          </aside>
        </div>
      )}

      <div className="mx-auto max-w-7xl grid gap-6 md:grid-cols-[260px_minmax(0,1fr)]">
        {/* Desktop Sidebar */}
        <aside className="hidden self-stretch rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:flex md:flex-col">
          <p className="mb-4 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Commuter Tools</p>
          <nav className="space-y-1.5">
            <button
              onClick={() => handleSelectSection("dashboard")}
              className={`w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition-all ${
                activeSection === "dashboard" ? "bg-sky-700 text-white shadow-md shadow-sky-100" : "text-slate-600 hover:bg-sky-50"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleSelectSection("my-ratings")}
              className={`w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition-all ${
                activeSection === "my-ratings" ? "bg-sky-700 text-white shadow-md shadow-sky-100" : "text-slate-600 hover:bg-sky-50"
              }`}
            >
              My Ratings
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <section className="space-y-6">
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              {/* Header Card */}
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-800">Ride Portal</h2>
                    <p className="text-sm font-medium text-slate-500">Manage your active commutes and feedback.</p>
                  </div>
                  <button
                    onClick={handleGenerateRide}
                    disabled={generating}
                    className="rounded-xl bg-sky-700 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-sky-800 active:scale-95 disabled:opacity-60"
                  >
                    {generating ? "Generating..." : "New Sample Ride"}
                  </button>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-sky-100 bg-sky-50/50 p-4">
                  {currentRide ? (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Active Code:</span>
                        <span className="rounded-md bg-white px-2 py-1 text-sm font-black text-sky-800 shadow-sm">{currentRide.rideCode}</span>
                      </div>
                      <div className="hidden h-4 w-[1px] bg-sky-200 sm:block mx-2"></div>
                      <p className="text-sm text-slate-700">
                        Driver: <span className="font-bold">{currentRide.driver?.name}</span> 
                        <span className="ml-2 text-xs text-slate-500">({currentRide.driver?.vehicleNumber})</span>
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-sm font-medium text-slate-500 italic">No active ride. Click the button above to start.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Feedback Form Container */}
              <div className="rounded-3xl border border-slate-200 bg-white p-2 shadow-sm overflow-hidden">
                <FeedbackForm ride={currentRide} onSubmitted={handleFeedbackSubmitted} />
              </div>
            </div>
          )}

          {activeSection === "my-ratings" && (
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl font-black text-slate-800">History</h3>
                <p className="text-sm font-medium text-slate-500">Review your past feedback and ride details.</p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Ride Code</th>
                      <th className="px-6 py-4">Driver</th>
                      <th className="px-6 py-4">Rating</th>
                      <th className="px-6 py-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.length === 0 ? (
                      <tr>
                        <td className="px-6 py-8 text-center text-slate-400 italic" colSpan={4}>No entries yet.</td>
                      </tr>
                    ) : (
                      history.map((item) => (
                        <tr key={item._id} className="transition-colors hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-black text-sky-700">{item.ride?.rideCode || "-"}</td>
                          <td className="px-6 py-4 text-slate-700">{item.driver?.name || "-"}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-100">
                              ★ {sectionAverages(item.sections)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-xs font-medium text-slate-500">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </section>
      </div>
    </main>
  );
};

export default UserDashboardPage;