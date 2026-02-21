import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import AuthCard from "../components/AuthCard";
import TextInput from "../components/TextInput";

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/register", form);
      toast.success("Account created. Please login.");
      navigate("/login");
    } catch (_error) {
      toast.error("Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-70px)] w-full items-center justify-center bg-slate-50 px-4 py-12">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-emerald-100 ring-1 ring-slate-200">
        
        {/* --- Left Form Panel --- */}
        <div className="w-full p-8 md:w-1/2 md:p-16">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
            <p className="mt-2 text-slate-500">Join the InsightDrive network today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <TextInput
              label="Full Name"
              value={form.name}
              placeholder="John Doe"
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="rounded-xl border-slate-200 focus:ring-emerald-500"
            />
            
            <TextInput
              label="Work Email"
              value={form.email}
              placeholder="name@company.com"
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="rounded-xl border-slate-200 focus:ring-emerald-500"
            />
            
            <TextInput
              label="Password"
              type="password"
              value={form.password}
              placeholder="Minimum 6 characters"
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="rounded-xl border-slate-200 focus:ring-emerald-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="relative mt-2 w-full overflow-hidden rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-70"
            >
              <span className={loading ? "opacity-0" : "opacity-100"}>Create My Account</span>
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

          <div className="mt-8 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700 underline-offset-4 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* --- Right Branding Panel --- */}
        <section className="relative hidden w-1/2 flex-col justify-between bg-emerald-700 p-12 text-white md:flex">
          {/* Decorative SVG Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="white"/></pattern></defs><rect width="100%" height="100%" fill="url(#dots)" /></svg>
          </div>

          <div className="relative z-10">
            <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-4xl font-black leading-tight">
              Start Monitoring <br />Your Fleet Today.
            </h1>
            <p className="mt-6 max-w-md text-lg text-emerald-100/80">
              Join thousands of operations managers who use InsightDrive to close the feedback loop.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            {[
              { title: "Real-time Alerts", desc: "Instantly spot low-score trends." },
              { title: "Smart Leaderboards", desc: "Recognize top-performing drivers." },
              { title: "Global Analytics", desc: "One dashboard for all ride data." }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl bg-emerald-800/40 p-4 border border-white/5 backdrop-blur-sm">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/30 text-emerald-200">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold">{feature.title}</p>
                  <p className="text-xs text-emerald-200/70">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default SignupPage;
