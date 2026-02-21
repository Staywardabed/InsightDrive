const AuthCard = ({ title, subtitle, children, className = "" }) => {
  return (
    <section className={`bg-white p-6 md:p-8 ${className}`}>
      <h2 className="text-2xl font-extrabold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
};

export default AuthCard;
