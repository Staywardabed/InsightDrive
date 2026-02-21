import { Navigate } from "react-router-dom";
import { useFeedback } from "../context/FeedbackContext.jsx";

const ProtectedRoute = ({ children, roles }) => {
  const { user, authLoading } = useFeedback();

  if (authLoading) {
    return (
      <main className="mx-auto max-w-6xl p-4 md:p-8">
        <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-soft">
          <p className="text-sm text-slate-600">Loading session...</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (Array.isArray(roles) && roles.length > 0 && !roles.includes(user.role)) {
    const fallbackPath = user.role === "admin" ? "/admin" : "/dashboard";
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
