import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import StarRating from "./StarRating";
import TagChips from "./TagChips";

const tagOptions = ["Easy to use", "Complex", "Good", "Bad", "Needs improvement", "Helpful", "Fine", "User friendly"];

const AppRatingForm = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);
  const [form, setForm] = useState({
    rating: 3,
    tags: [],
    comment: ""
  });

  const loadMyAppRating = async () => {
    setLoading(true);
    try {
      const response = await api.get("/app-feedback/mine");
      const data = response.data?.data;
      if (data) {
        setForm({
          rating: Number(data.rating) || 3,
          tags: data.tags || [],
          comment: data.comment || ""
        });
        setHasExisting(true);
      } else {
        setHasExisting(false);
      }
    } catch (_error) {
      toast.error("Failed to load app rating");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyAppRating();
  }, []);

  const onToggleTag = (tag) => {
    setForm((prev) => {
      const nextTags = prev.tags.includes(tag)
        ? prev.tags.filter((item) => item !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: nextTags };
    });
  };

  const onSubmit = async () => {
    setSaving(true);
    try {
      await api.post("/app-feedback", {
        rating: form.rating || 3,
        tags: form.tags || [],
        comment: form.comment || ""
      });
      toast.success(hasExisting ? "App rating updated" : "App rating submitted");
      setHasExisting(true);
    } catch (_error) {
      toast.error("Failed to save app rating");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-black text-slate-800">Rate App</h3>
        <p className="text-sm font-medium text-slate-500">You can submit once and update your rating anytime.</p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">Loading your app rating...</div>
      ) : (
        <div className="space-y-4">
          <article className="border border-slate-200 bg-slate-50 p-4">
            <h4 className="text-base font-bold text-slate-800">App Experience</h4>
            <p className="mb-3 text-xs text-slate-600">Booking and app usability</p>
            <StarRating value={form.rating} onChange={(rating) => setForm((prev) => ({ ...prev, rating }))} />
            <div className="mt-3">
              <TagChips selected={form.tags} options={tagOptions} onToggle={onToggleTag} />
            </div>
            <div className="mt-3">
              <label className="mb-1 block text-xs font-semibold text-slate-700">Comment</label>
              <textarea
                value={form.comment}
                onChange={(event) => setForm((prev) => ({ ...prev, comment: event.target.value }))}
                rows={3}
                placeholder="Write your app feedback..."
                className="w-full border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
          </article>

          <button
            type="button"
            onClick={onSubmit}
            disabled={saving}
            className="bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"
          >
            {saving ? "Saving..." : hasExisting ? "Update App Rating" : "Submit App Rating"}
          </button>
        </div>
      )}
    </section>
  );
};

export default AppRatingForm;
