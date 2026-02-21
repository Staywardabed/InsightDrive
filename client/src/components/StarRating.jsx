const StarRating = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= value;
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`h-9 w-9 rounded-full border text-sm font-bold transition ${
              active
                ? "border-amber-300 bg-amber-300 text-slate-900"
                : "border-slate-300 bg-white text-slate-500 hover:border-amber-200"
            }`}
          >
            {star}
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
