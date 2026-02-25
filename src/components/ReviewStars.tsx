"use client";

import { Star } from "lucide-react";

export default function ReviewStars({
  rating,
  size = 16,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < rating
              ? "fill-gold text-gold"
              : "fill-none text-warm-grey/40"
          }
        />
      ))}
    </div>
  );
}
