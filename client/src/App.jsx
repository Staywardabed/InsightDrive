import { Link, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminPage from "./pages/AdminPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import { useFeedback } from "./context/FeedbackContext.jsx";
import api from "./api/axios";

const App = () => {
  const { user, setUser } = useFeedback();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
    } catch (_error) {
    }
  };

  const isDashboardRoute = location.pathname === "/admin" || location.pathname === "/dashboard";
  const openSidebarMenu = () => {
    window.dispatchEvent(new CustomEvent("open-sidebar-menu"));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          {/* --- Logo Area --- */}
          <Link to="/" className="flex items-center gap-2 transition-transform active:scale-95">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-sky-800 text-white shadow-lg shadow-sky-200">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="hidden text-xl font-bold tracking-tight text-slate-800 sm:block">
              Insight<span className="text-sky-600">Drive</span>
            </span>
          </Link>

          {/* --- Desktop Navigation --- */}
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 md:flex mr-4 border-r border-slate-200 pr-4">
              <Link to="/" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-sky-600 transition-colors">
                Home
              </Link>

              {user?.role === "user" && (
                <Link to="/dashboard" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-sky-50 hover:text-sky-700 transition-colors">
                  My Dashboard
                </Link>
              )}

              {user?.role === "admin" && (
                <Link to="/admin" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                  Admin Panel
                </Link>
              )}
            </div>

            {/* --- Action Buttons --- */}
            <div className="flex items-center gap-3">
              {!user ? (
                <>
                  <Link to="/login" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-sky-600 transition-colors">
                    Login
                  </Link>
                  <Link to="/signup" className="rounded-full bg-sky-600 px-5 py-2 text-sm font-bold text-white shadow-md shadow-sky-100 hover:bg-sky-700 hover:shadow-sky-200 transition-all active:scale-95">
                    Get Started
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  {/* Mobile Menu Trigger */}
                  {isDashboardRoute && (
                    <button
                      onClick={openSidebarMenu}
                      className="flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-600 md:hidden hover:bg-slate-50"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                    </button>
                  )}

                  {/* User Profile Badge (Static Placeholder) */}
                  <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 sm:flex">
                    {user.name?.[0] || 'U'}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <span>Logout</span>
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
      <main className="grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["user"]}>
                <UserDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;
