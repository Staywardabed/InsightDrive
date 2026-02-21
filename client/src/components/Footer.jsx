const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t border-sky-100 bg-white/90 px-4 py-4 text-sm text-slate-600 md:px-8">
      <div className="flex w-full flex-wrap items-center gap-2">
        <p className="mr-auto">&copy; {year} InsightDrive Feedback Platform</p>
        <p>Built for ride and driver feedback management.</p>
      </div>
    </footer>
  );
};

export default Footer;

