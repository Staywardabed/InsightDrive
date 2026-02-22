import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import { useFeedback } from "../context/FeedbackContext.jsx";
import StarRating from "./StarRating";
import TagChips from "./TagChips";

const rideSectionDefs = [
  { key: "driver", title: "Driver Experience", help: "Driving behavior, courtesy, safety" },
  { key: "trip", title: "Trip Quality", help: "Route comfort and punctuality" }
];

const tagOptions = ["Late", "Unsafe", "good", "Bad", "Polite", "Helpful", "Navigation", "Supportive", "Scam"];

const FeedbackForm = ({ ride, onSubmitted }) => {
  const { user } = useFeedback();
  const [rideSections, setRideSections] = useState({});
  const [rideLoading, setRideLoading] = useState(false);
  const rideEnabledSections = rideSectionDefs;

  useEffect(() => {
    setRideSections({});
  }, [ride?._id]);

  const updateRideSection = (entity, value) => {
    setRideSections((prev) => ({
      ...prev,
      [entity]: {
        rating: value.rating ?? prev[entity]?.rating ?? 3,
        tags: value.tags ?? prev[entity]?.tags ?? [],
        comment: value.comment ?? prev[entity]?.comment ?? ""
      }
    }));
  };

  const onToggleRideTag = (entity, tag) => {
    const currentTags = rideSections[entity]?.tags || [];
    const nextTags = currentTags.includes(tag)
      ? currentTags.filter((item) => item !== tag)
      : [...currentTags, tag];

    updateRideSection(entity, { tags: nextTags });
  };

  const onSubmitRideFeedback = async (event) => {
    event.preventDefault();

    if (!ride?._id) {
      toast.error("Please generate a sample ride first");
      return;
    }

    const payloadSections = rideEnabledSections.map((item) => ({
      entity: item.key,
      rating: rideSections[item.key]?.rating || 3,
      tags: rideSections[item.key]?.tags || [],
      comment: rideSections[item.key]?.comment || ""
    }));

    setRideLoading(true);
    try {
      await api.post("/feedback", {
        rideId: ride._id,
        sections: payloadSections,
        tags: payloadSections.flatMap((item) => item.tags)
      });

      setRideSections({});
      toast.success("Feedback submitted successfully");
      if (typeof onSubmitted === "function") {
        onSubmitted();
      }
    } catch (_error) {
      toast.error("Feedback submission failed");
    } finally {
      setRideLoading(false);
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
    <form onSubmit={onSubmitRideFeedback} className="space-y-6 border border-sky-100 bg-white p-6 shadow-soft md:p-8">
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
        {rideEnabledSections.map((section) => {
          const current = rideSections[section.key] || { rating: 3, tags: [], comment: "" };

          return (
            <article key={section.key} className="border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-base font-bold text-slate-800">{section.title}</h3>
              <p className="mb-3 text-xs text-slate-600">{section.help}</p>
              <StarRating value={current.rating} onChange={(rating) => updateRideSection(section.key, { rating })} />
              <div className="mt-3">
                <TagChips
                  selected={current.tags}
                  options={tagOptions}
                  onToggle={(tag) => onToggleRideTag(section.key, tag)}
                />
              </div>
              <div className="mt-3">
                <label className="mb-1 block text-xs font-semibold text-slate-700">Comment</label>
                <textarea
                  value={current.comment}
                  onChange={(event) => updateRideSection(section.key, { comment: event.target.value })}
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
        disabled={rideLoading || !ride}
        className="bg-sky-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-800 disabled:opacity-60"
      >
        {rideLoading ? "Submitting..." : "Submit Ride Feedback"}
      </button>
    </form>
  );
};

export default FeedbackForm;
