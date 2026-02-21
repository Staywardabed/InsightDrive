import { Fragment, useEffect, useMemo, useState } from "react";
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "react-toastify";
import api from "../api/axios";

const palette = {
  positive: "#16a34a",
  neutral: "#f59e0b",
  negative: "#dc2626"
};

const rowColor = (score) => {
  if (score >= 4) return "bg-green-50";
  if (score >= 2.5) return "bg-amber-50";
  return "bg-red-50";
};

const avgFromSections = (sections = []) => {
  if (!sections.length) return "-";
  const total = sections.reduce((sum, section) => sum + (Number(section.rating) || 0), 0);
  return (total / sections.length).toFixed(2);
};

const AdminDashboard = ({ activeSection = "dashboard" }) => {
  const [sentiment, setSentiment] = useState([]);
  const [trend, setTrend] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [feedbackSortOrder, setFeedbackSortOrder] = useState("desc");
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [feedbackTotalPages, setFeedbackTotalPages] = useState(1);
  const [expandedFeedbackId, setExpandedFeedbackId] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadAnalytics = async () => {
    try {
      const response = await api.get("/feedback/analytics");
      setSentiment(response.data.sentiment || []);
      setTrend(response.data.trend || []);
    } catch (_error) {
      toast.error("Failed to load analytics");
    }
  };

  const loadDrivers = async (targetPage = page) => {
    try {
      const response = await api.get(`/drivers?page=${targetPage}&limit=8`);
      setDrivers(response.data.data || []);
      setPage(response.data.currentPage || 1);
      setTotalPages(response.data.totalPages || 1);
    } catch (_error) {
      toast.error("Failed to load drivers");
    }
  };

  const loadAllFeedback = async (targetPage = feedbackPage, sortOrder = feedbackSortOrder) => {
    try {
      const query = new URLSearchParams({
        page: String(targetPage),
        limit: "8",
        sortOrder
      });

      const response = await api.get(`/feedback/all?${query.toString()}`);
      setRecentFeedback(response.data.data || []);
      setFeedbackPage(response.data.currentPage || 1);
      setFeedbackTotalPages(response.data.totalPages || 1);
    } catch (_error) {
      toast.error("Failed to load feedback list");
    }
  };

  useEffect(() => {
    loadAnalytics();
    loadDrivers(1);
    loadAllFeedback(1, feedbackSortOrder);
  }, []);

  useEffect(() => {
    setExpandedFeedbackId("");
    loadAllFeedback(1, feedbackSortOrder);
  }, [feedbackSortOrder]);

  const donutData = useMemo(
    () => sentiment.map((item) => ({ name: item._id, value: item.value })),
    [sentiment]
  );

  return (
    <div className="space-y-6">
      {activeSection === "dashboard" && (
        <section className="grid gap-5 lg:grid-cols-2">
          <article className="border border-sky-100 bg-white p-5 shadow-soft">
            <h3 className="text-lg font-bold text-slate-900">Sentiment Donut</h3>
            <p className="mb-4 text-sm text-slate-600">Positive, neutral and negative mix.</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={92}>
                    {donutData.map((entry) => (
                      <Cell key={entry.name} fill={palette[entry.name] || "#334155"} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="border border-sky-100 bg-white p-5 shadow-soft">
            <h3 className="text-lg font-bold text-slate-900">30 Day Average Rating</h3>
            <p className="mb-4 text-sm text-slate-600">Daily trend from submitted sections.</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <XAxis dataKey="date" hide />
                  <YAxis domain={[1, 5]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#0284c7" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>
      )}

      {activeSection === "leaderboard" && (
        <section className="border border-sky-100 bg-white p-5 shadow-soft">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h3 className="mr-auto text-lg font-bold text-slate-900">Driver Leaderboard</h3>
            <button onClick={() => loadDrivers(page)} className="border border-slate-300 px-3 py-1.5 text-sm">
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-2">Driver</th>
                  <th className="px-3 py-2">Vehicle</th>
                  <th className="px-3 py-2">Avg Rating</th>
                  <th className="px-3 py-2">Feedback Count</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => (
                  <tr key={driver._id} className={rowColor(driver.avgRating)}>
                    <td className="px-3 py-2 font-semibold">{driver.name}</td>
                    <td className="px-3 py-2">{driver.vehicleNumber}</td>
                    <td className="px-3 py-2">{Number(driver.avgRating || 0).toFixed(2)}</td>
                    <td className="px-3 py-2">{driver.feedbackCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: totalPages }).map((_, index) => {
              const buttonPage = index + 1;
              const active = buttonPage === page;
              return (
                <button
                  key={buttonPage}
                  onClick={() => loadDrivers(buttonPage)}
                  className={`px-3 py-1.5 text-sm ${
                    active ? "bg-sky-700 text-white" : "border border-slate-300 bg-white"
                  }`}
                >
                  {buttonPage}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {activeSection === "ride-feedback" && (
        <section className="border border-sky-100 bg-white p-5 shadow-soft">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h3 className="mr-auto text-lg font-bold text-slate-900">All Ride Feedback</h3>
          <select
            value={feedbackSortOrder}
            onChange={(event) => setFeedbackSortOrder(event.target.value)}
            className="border border-slate-300 bg-white px-3 py-1.5 text-sm"
          >
            <option value="desc">Rating: High to Low</option>
            <option value="asc">Rating: Low to High</option>
          </select>
          <button onClick={() => loadAllFeedback(feedbackPage, feedbackSortOrder)} className="border border-slate-300 px-3 py-1.5 text-sm">
            Refresh
          </button>
        </div>
        <p className="mb-3 text-sm text-slate-600">Admin view of ride and driver feedback entries sorted by rating.</p>
        <div className="space-y-3 md:hidden">
          {recentFeedback.length === 0 && (
            <div className="border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">No feedback found.</div>
          )}
          {recentFeedback.map((item) => (
            <article key={`mobile-${item._id}`} className="border border-slate-200 bg-white p-3">
              <div className="grid gap-1 text-sm">
                <p><span className="font-semibold">Ride:</span> {item.ride?.rideCode || "-"}</p>
                <p><span className="font-semibold">Driver:</span> {item.driver?.name || "-"}</p>
                <p><span className="font-semibold">User:</span> {item.submittedBy?.email || "-"}</p>
                <p><span className="font-semibold">Avg Rating:</span> {avgFromSections(item.sections)}</p>
                <p><span className="font-semibold">Time:</span> {new Date(item.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setExpandedFeedbackId((prev) => (prev === item._id ? "" : item._id))}
                className="mt-3 border border-slate-300 px-2 py-1 text-xs"
              >
                {expandedFeedbackId === item._id ? "Hide" : "View"}
              </button>
              {expandedFeedbackId === item._id && (
                <div className="mt-3 space-y-2 border-t border-slate-200 pt-3">
                  {item.sections?.map((section, index) => (
                    <div key={`mobile-${item._id}-section-${index}`} className="border border-slate-200 bg-slate-50 p-2 text-xs">
                      <p><span className="font-semibold">Entity:</span> {section.entity}</p>
                      <p><span className="font-semibold">Rating:</span> {section.rating}</p>
                      <p><span className="font-semibold">Tags:</span> {(section.tags || []).join(", ") || "-"}</p>
                      <p><span className="font-semibold">Comment:</span> {section.comment || "-"}</p>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-3 py-2">Ride</th>
                <th className="px-3 py-2">Driver</th>
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Avg Rating</th>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentFeedback.length === 0 && (
                <tr>
                  <td className="px-3 py-2 text-slate-500" colSpan={6}>No feedback found.</td>
                </tr>
              )}
              {recentFeedback.map((item) => (
                <Fragment key={item._id}>
                  <tr className="border-t border-slate-100">
                    <td className="px-3 py-2">{item.ride?.rideCode || "-"}</td>
                    <td className="px-3 py-2">{item.driver?.name || "-"}</td>
                    <td className="px-3 py-2">{item.submittedBy?.email || "-"}</td>
                    <td className="px-3 py-2">{avgFromSections(item.sections)}</td>
                    <td className="px-3 py-2">{new Date(item.createdAt).toLocaleString()}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => setExpandedFeedbackId((prev) => (prev === item._id ? "" : item._id))}
                        className="border border-slate-300 px-2 py-1 text-xs"
                      >
                        {expandedFeedbackId === item._id ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>
                  {expandedFeedbackId === item._id && (
                    <tr className="border-t border-slate-100 bg-slate-50">
                      <td className="px-3 py-2 text-xs text-slate-700" colSpan={6}>
                        <div className="space-y-2">
                          {item.sections?.map((section, index) => (
                            <div key={`${item._id}-section-${index}`} className="border border-slate-200 bg-white p-2">
                              <p><span className="font-semibold">Entity:</span> {section.entity}</p>
                              <p><span className="font-semibold">Rating:</span> {section.rating}</p>
                              <p><span className="font-semibold">Tags:</span> {(section.tags || []).join(", ") || "-"}</p>
                              <p><span className="font-semibold">Comment:</span> {section.comment || "-"}</p>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: feedbackTotalPages }).map((_, index) => {
            const buttonPage = index + 1;
            const active = buttonPage === feedbackPage;
            return (
              <button
                key={`feedback-page-${buttonPage}`}
                onClick={() => loadAllFeedback(buttonPage, feedbackSortOrder)}
                className={`px-3 py-1.5 text-sm ${
                  active ? "bg-sky-700 text-white" : "border border-slate-300 bg-white"
                }`}
              >
                {buttonPage}
              </button>
            );
          })}
        </div>
        </section>
      )}
    </div>
  );
};

export default AdminDashboard;
