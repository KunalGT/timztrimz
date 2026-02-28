import BookingFlow from "@/components/BookingFlow";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Book Now | Timz Trimz",
  description:
    "Book your next appointment with Tim. Skin fades, tapers, SMP, beard trims and more.",
};

export default function BookPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-5 py-4">
          <Link
            href="/"
            className="rounded-lg p-1.5 text-warm-grey transition-colors hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-display text-lg font-bold text-black">
              Timz Trimz
            </h1>
            <p className="text-xs text-warm-grey">Book your appointment</p>
          </div>
        </div>
      </div>

      {/* Booking flow */}
      <div className="px-5 py-8">
        <BookingFlow />
      </div>
    </main>
  );
}
