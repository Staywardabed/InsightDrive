import { useState, useEffect } from "react";
import { useFeedback } from "../context/FeedbackContext.jsx";
import AdminDashboard from "../components/AdminDashboard";

const AdminPage = () => {
  const { alerts } = useFeedback();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const links = [
    { key: "dashboard", label: "Dashboard" },
    { key: "leaderboard", label: "Driver Leaderboard" },
    { key: "ride-feedback", label: "Ride Feedback" }
  ];

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
    <main className="w-full bg-slate-50/50 px-4 py-6 md:px-8">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm md:hidden" onClick={() => setMobileSidebarOpen(false)}>
          <aside
            className="h-full w-72 bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Admin Menu</p>
              <button onClick={() => setMobileSidebarOpen(false)} className="text-sm font-bold text-slate-400">✕</button>
            </div>
            <nav className="space-y-2">
              {links.map((link) => {
                const isActive = activeSection === link.key;
                return (
                  <button
                    key={link.key}
                    onClick={() => handleSelectSection(link.key)}
                    className={`w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition-all ${
                      isActive ? "bg-sky-700 text-white shadow-lg shadow-sky-100" : "text-slate-600 hover:bg-sky-50"
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      <div className="mx-auto max-w-7xl grid gap-6 md:min-h-[calc(100vh-120px)] md:grid-cols-[260px_minmax(0,1fr)]">
        {/* Desktop Sidebar */}
        <aside className="hidden self-stretch rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:flex md:flex-col">
          <p className="mb-4 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Management</p>
          <nav className="space-y-1.5">
            {links.map((link) => {
              const isActive = activeSection === link.key;
              return (
                <button
                  key={link.key}
                  onClick={() => handleSelectSection(link.key)}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition-all ${
                    isActive ? "bg-sky-700 text-white shadow-md shadow-sky-100" : "text-slate-600 hover:bg-sky-50"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <section className="space-y-6">
          {activeSection === "dashboard" && (
            <section className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-black text-slate-800">Live Alerts</h2>
                <p className="text-xs font-medium text-slate-500">Real-time incident stream</p>
              </div>
              
              <div className="mt-4 max-h-48 space-y-3 overflow-auto pr-2">
                {alerts.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-200 py-6 text-center">
                    <p className="text-sm font-medium text-slate-400">No active alerts at this time.</p>
                  </div>
                )}
                {alerts.map((alert, index) => (
                  <div key={`${alert.driverId}-${index}`} className="flex items-center justify-between rounded-2xl border border-red-100 bg-red-50/50 px-4 py-3 transition-colors hover:bg-red-50">
                    <span className="text-sm font-bold text-slate-700">
                      {alert.driverName} {alert.entity ? `(${alert.entity})` : ""}
                    </span>
                    <span className="rounded-lg bg-red-600 px-2 py-1 text-xs font-black text-white">
                      {Number(alert.avgRating || 0).toFixed(2)} Rating
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
            <AdminDashboard activeSection={activeSection} />
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminPage;
