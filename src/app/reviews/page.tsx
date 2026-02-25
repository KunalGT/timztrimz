import { prisma } from "@/lib/db";
import ReviewStars from "@/components/ReviewStars";
import ReviewsClient from "./ReviewsClient";

export const metadata = {
  title: "Reviews | Timz Trimz",
  description:
    "See what our clients say about Timz Trimz. Real reviews from real people.",
};

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: { booking: { select: { clientName: true } } },
    orderBy: { createdAt: "desc" },
  });

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  const serialized = reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt.toISOString(),
    clientName: r.booking.clientName,
  }));

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold text-black mb-8">
          Reviews
        </h1>

        {/* Aggregate Rating */}
        <div className="flex items-center gap-4 mb-10 rounded-xl bg-off-white p-6">
          <span className="text-5xl font-bold text-black">
            {avgRating.toFixed(1)}
          </span>
          <div>
            <ReviewStars rating={Math.round(avgRating)} size={24} />
            <p className="text-sm text-warm-grey mt-1">
              {totalReviews} review{totalReviews !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <ReviewsClient reviews={serialized} />
      </div>
    </main>
  );
}
