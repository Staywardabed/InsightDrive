import { Link } from "react-router-dom";

const GITHUB_URL = "https://github.com/Utkarshsingh4147/InsightDrive/";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <section className="relative overflow-hidden bg-white py-16 md:py-28">
        <div className="container mx-auto px-6 text-center">
          <h1 className="mx-auto max-w-4xl text-5xl font-black tracking-tight text-slate-900 md:text-7xl">
            Feedback that drives <span className="text-sky-600">performance.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-600">
            A specialized platform for transportation logistics. Collect granular ride data, 
            monitor driver sentiment, and optimize your fleet operations with real-time analytics.
          </p>
          
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/login" className="w-full rounded-lg bg-sky-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-sky-200 hover:bg-sky-700 sm:w-auto transition-transform hover:-translate-y-1">
              Launch Platform
            </Link>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-4 font-semibold text-slate-700 hover:text-sky-600">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              GitHub Code
            </a>
          </div>
        </div>
      </section>

      {/* --- Platform Workflow Section --- */}
      <section id="roles" className="border-y border-slate-200 bg-slate-50 py-20">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">One Platform, Two Perspectives</h2>
            <div className="mx-auto mt-4 h-1.5 w-20 rounded-full bg-sky-600"></div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* User Experience Card */}
            <div className="group rounded-3xl bg-white p-10 shadow-sm border border-slate-200 hover:border-sky-300 transition-colors">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Commuter Module</h3>
              <p className="mt-4 text-slate-600">Submit structured ratings for every trip. Our intuitive UI ensures feedback takes less than 10 seconds.</p>
              <ul className="mt-6 space-y-3">
                {['Submit star ratings & tags', 'Add specific driver comments', 'Review personal ride history'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500"></span> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Admin Experience Card */}
            <div className="group rounded-3xl bg-white p-10 shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Admin Dashboard</h3>
              <p className="mt-4 text-slate-600">High-level oversight for operations teams. Manage drivers and respond to low-score alerts immediately.</p>
              <ul className="mt-6 space-y-3">
                {['Live sentiment analytics', 'Driver leaderboard rankings', 'Paginated feedback logs'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;