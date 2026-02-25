"use client";

import { useState } from "react";
import ReviewCard from "@/components/ReviewCard";
import ReviewModal from "./ReviewModal";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  clientName: string;
};

type SortOption = "newest" | "highest";

export default function ReviewsClient({ reviews }: { reviews: Review[] }) {
  const [sort, setSort] = useState<SortOption>("newest");
  const [modalOpen, setModalOpen] = useState(false);

  const sorted = [...reviews].sort((a, b) => {
    if (sort === "highest") return b.rating - a.rating;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <>
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setSort("newest")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              sort === "newest"
                ? "bg-gold text-white"
                : "bg-gray-100 text-warm-grey hover:bg-gray-200"
            }`}
          >
            Newest
          </button>
          <button
            onClick={() => setSort("highest")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              sort === "highest"
                ? "bg-gold text-white"
                : "bg-gray-100 text-warm-grey hover:bg-gray-200"
            }`}
          >
            Highest Rated
          </button>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-white hover:bg-gold-dark transition-colors"
        >
          Leave a Review
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid gap-4">
        {sorted.map((review) => (
          <ReviewCard
            key={review.id}
            clientName={review.clientName}
            rating={review.rating}
            comment={review.comment}
            createdAt={review.createdAt}
          />
        ))}
      </div>

      {/* Review Modal */}
      {modalOpen && <ReviewModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
