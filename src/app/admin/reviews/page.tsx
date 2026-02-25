"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Star, Trash2 } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  booking: {
    clientName: string;
    service: { name: string };
  };
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    const res = await fetch("/api/admin/reviews");
    const data = await res.json();
    setReviews(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    fetchReviews();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-black">Reviews</h1>

      {loading ? (
        <div className="text-center py-12 text-warm-grey">Loading...</div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-xl p-8 border border-gray-100 text-center text-warm-grey">
          No reviews yet
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl border border-gray-100 p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-black">
                      {review.booking.clientName}
                    </span>
                    <span className="text-xs text-warm-grey">
                      {review.booking.service.name}
                    </span>
                    <span className="text-xs text-warm-grey">
                      {format(new Date(review.createdAt), "d MMM yyyy")}
                    </span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < review.rating
                            ? "text-gold fill-gold"
                            : "text-gray-200"
                        }
                      />
                    ))}
                  </div>
                  {review.comment && (
                    <p className="text-sm text-warm-grey">{review.comment}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-2 rounded-lg hover:bg-danger/10 text-danger"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
