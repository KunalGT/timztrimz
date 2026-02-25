import ReviewStars from "./ReviewStars";

type ReviewCardProps = {
  clientName: string;
  rating: number;
  comment: string | null;
  createdAt: Date | string;
};

export default function ReviewCard({
  clientName,
  rating,
  comment,
  createdAt,
}: ReviewCardProps) {
  const initial = clientName.charAt(0).toUpperCase();
  const date = new Date(createdAt);
  const formatted = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-white font-semibold text-sm">
          {initial}
        </div>
        <div>
          <p className="font-semibold text-black">{clientName}</p>
          <p className="text-xs text-warm-grey">{formatted}</p>
        </div>
      </div>
      <ReviewStars rating={rating} />
      {comment && (
        <p className="mt-3 text-sm text-warm-grey leading-relaxed">
          {comment}
        </p>
      )}
    </div>
  );
}
