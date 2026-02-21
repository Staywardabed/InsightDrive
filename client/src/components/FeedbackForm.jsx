import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import { useFeedback } from "../context/FeedbackContext.jsx";
import StarRating from "./StarRating";
import TagChips from "./TagChips";

const sectionsMap = {
  driverFeedback: { key: "driver", title: "Driver Experience", help: "Driving behavior, courtesy, safety" },
  tripFeedback: { key: "trip", title: "Trip Quality", help: "Route comfort and punctuality" },
  appFeedback: { key: "app", title: "App Experience", help: "Booking and app usability" },
  marshalFeedback: { key: "marshal", title: "Marshal Support", help: "Pickup point support quality" }
};

const tagOptions = ["Late", "Unsafe", "Clean", "Polite", "Helpful", "Navigation", "Supportive"];

const FeedbackForm = ({ ride, onSubmitted }) => {
  const { flags, user } = useFeedback();
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(false);

  const enabledSections = useMemo(() => {
    return Object.entries(flags)
      .filter(([, isEnabled]) => isEnabled)
      .map(([flagKey]) => sectionsMap[flagKey])
      .filter(Boolean);
  }, [flags]);

  useEffect(() => {
    setSections({});
  }, [ride?._id]);

  const updateSection = (entity, value) => {
    setSections((prev) => ({
      ...prev,
      [entity]: {
        rating: value.rating ?? prev[entity]?.rating ?? 3,
        tags: value.tags ?? prev[entity]?.tags ?? [],
        comment: value.comment ?? prev[entity]?.comment ?? ""
      }
    }));
  };

  const onToggleTag = (entity, tag) => {
    const currentTags = sections[entity]?.tags || [];
    const nextTags = currentTags.includes(tag)
      ? currentTags.filter((item) => item !== tag)
      : [...currentTags, tag];

    updateSection(entity, { tags: nextTags });
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!ride?._id) {
      toast.error("Please generate a sample ride first");
      return;
    }

    const payloadSections = enabledSections.map((item) => ({
      entity: item.key,
      rating: sections[item.key]?.rating || 3,
      tags: sections[item.key]?.tags || [],
      comment: sections[item.key]?.comment || ""
    }));

    setLoading(true);
    try {
      await api.post("/feedback", {
        rideId: ride._id,
        sections: payloadSections,
        tags: payloadSections.flatMap((item) => item.tags)
      });

      setSections({});
      toast.success("Feedback submitted successfully");
      if (typeof onSubmitted === "function") {
        onSubmitted();
      }
    } catch (_error) {
      toast.error("Feedback submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <section className="border border-sky-100 bg-white/80 p-6 shadow-soft">
        <h2 className="text-xl font-bold text-slate-800">Feedback Form</h2>
        <p className="mt-2 text-sm text-slate-600">Please login to submit feedback.</p>
      </section>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 border border-sky-100 bg-white p-6 shadow-soft md:p-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Ride Feedback Form</h2>
        <p className="mt-1 text-sm text-slate-600">Rate your currently generated ride and assigned driver.</p>
      </div>

      <div className="border border-slate-200 bg-slate-50 p-3 text-sm">
        {ride ? (
          <p className="text-slate-700">
            Active ride <span className="font-semibold">{ride.rideCode}</span> with <span className="font-semibold">{ride.driver?.name}</span>
          </p>
        ) : (
          <p className="text-slate-600">No active ride yet. Click Generate Sample Ride first.</p>
        )}
      </div>

      <div className="grid gap-4">
        {enabledSections.map((section) => {
          const current = sections[section.key] || { rating: 3, tags: [], comment: "" };

          return (
            <article key={section.key} className="border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-base font-bold text-slate-800">{section.title}</h3>
              <p className="mb-3 text-xs text-slate-600">{section.help}</p>
              <StarRating value={current.rating} onChange={(rating) => updateSection(section.key, { rating })} />
              <div className="mt-3">
                <TagChips
                  selected={current.tags}
                  options={tagOptions}
                  onToggle={(tag) => onToggleTag(section.key, tag)}
                />
              </div>
              <div className="mt-3">
                <label className="mb-1 block text-xs font-semibold text-slate-700">Comment</label>
                <textarea
                  value={current.comment}
                  onChange={(event) => updateSection(section.key, { comment: event.target.value })}
                  rows={3}
                  placeholder="Write your feedback..."
                  className="w-full border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>
            </article>
          );
        })}
      </div>

      <button
        type="submit"
        disabled={loading || !ride}
        className="bg-sky-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-800 disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
};

export default FeedbackForm;
