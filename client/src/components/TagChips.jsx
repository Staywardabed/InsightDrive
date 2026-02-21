const TagChips = ({ selected, options, onToggle }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((tag) => {
        const active = selected.includes(tag);

        return (
          <button
            key={tag}
            type="button"
            onClick={() => onToggle(tag)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              active
                ? "border-sky-600 bg-sky-600 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-sky-300"
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
};

export default TagChips;
