import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import { useFeedback } from "../context/FeedbackContext.jsx";
import AuthCard from "../components/AuthCard";
import TextInput from "../components/TextInput";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useFeedback();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", form);
      const loggedInUser = response.data.user;
      setUser(loggedInUser);
      toast.success("Welcome back");
      navigate(loggedInUser?.role === "admin" ? "/admin" : "/dashboard");
    } catch (_error) {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-70px)] w-full items-center justify-center bg-slate-50 px-4 py-12">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-sky-100 ring-1 ring-slate-200">
        
        {/* --- Left Branding Panel --- */}
        <section className="relative hidden w-1/2 flex-col justify-between bg-sky-700 p-12 text-white md:flex">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>
          </div>

          <div className="relative z-10">
            <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7l-3 3m0 0l-3-3m3 3V3m0 18a9 9 0 110-18 9 9 0 010 18z" />
              </svg>
            </div>
            <h1 className="text-4xl font-black leading-tight">
              Driving Change <br />Through Feedback.
            </h1>
            <p className="mt-6 max-w-md text-lg text-sky-100/80">
              Access the most comprehensive ride-feedback ecosystem for modern transportation logistics.
            </p>
          </div>

          {/* Social Proof / Quote */}
          <div className="relative z-10 rounded-2xl bg-sky-800/50 p-6 backdrop-blur-sm border border-white/10">
            <p className="text-sm italic text-sky-50">
              "This platform has improved our driver sentiment scores by 40% in the last quarter."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-sky-400"></div>
              <div>
                <p className="text-xs font-bold">Operations Director</p>
                <p className="text-[10px] text-sky-200">InsightDrive Transit</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Right Form Panel --- */}
        <div className="w-full p-8 md:w-1/2 md:p-16">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
            <p className="mt-2 text-slate-500">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <TextInput
                label="Work Email"
                value={form.email}
                placeholder="name@company.com"
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="rounded-xl border-slate-200 focus:ring-sky-500"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Password</label>
              </div>
              <TextInput
                type="password"
                value={form.password}
                placeholder="••••••••"
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                className="rounded-xl border-slate-200 focus:ring-sky-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full overflow-hidden rounded-xl bg-sky-600 px-4 py-3.5 text-sm font-bold text-white transition-all hover:bg-sky-700 active:scale-[0.98] disabled:opacity-70"
            >
              <span className={loading ? "opacity-0" : "opacity-100"}>Sign In to Dashboard</span>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <Link to="/signup" className="font-bold text-sky-600 hover:text-sky-700 underline-offset-4 hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
