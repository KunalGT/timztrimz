"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";

export default function ReviewModal({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setErrorMsg("Please select a star rating.");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-warm-grey hover:text-black transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="font-display text-2xl font-bold text-black mb-1">
          Leave a Review
        </h2>
        <p className="text-sm text-warm-grey mb-6">
          Enter the phone number you used when booking to verify your visit.
        </p>

        {status === "success" ? (
          <div className="text-center py-8">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
              <Star size={24} className="fill-success" />
            </div>
            <p className="font-semibold text-black">Thank you!</p>
            <p className="text-sm text-warm-grey mt-1">
              Your review has been submitted.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating Selector */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Rating
              </label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => {
                  const starVal = i + 1;
                  return (
                    <button
                      key={i}
                      type="button"
                      onMouseEnter={() => setHoveredStar(starVal)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setRating(starVal)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        className={
                          starVal <= (hoveredStar || rating)
                            ? "fill-gold text-gold"
                            : "fill-none text-warm-grey/40"
                        }
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="review-phone"
                className="block text-sm font-medium text-black mb-1"
              >
                Phone Number
              </label>
              <input
                id="review-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07700 900 001"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none"
              />
            </div>

            {/* Comment */}
            <div>
              <label
                htmlFor="review-comment"
                className="block text-sm font-medium text-black mb-1"
              >
                Comment
              </label>
              <textarea
                id="review-comment"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your experience..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none resize-none"
              />
            </div>

            {status === "error" && errorMsg && (
              <p className="text-sm text-danger">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full rounded-lg bg-gold py-2.5 text-sm font-semibold text-white hover:bg-gold-dark transition-colors disabled:opacity-50"
            >
              {status === "submitting" ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
