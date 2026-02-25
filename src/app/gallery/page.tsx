import { prisma } from "@/lib/db";
import GalleryGrid from "@/components/GalleryGrid";
import { Instagram } from "lucide-react";

export const metadata = {
  title: "Our Work | Timz Trimz",
  description:
    "Check out our latest cuts, fades, beards and lineups. See why Timz Trimz is Whinchmore Hill's go-to barber.",
};

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold text-black mb-2">
          Our Work
        </h1>
        <p className="text-warm-grey mb-8">
          Fresh cuts, sharp fades and clean lineups from the chair.
        </p>

        <GalleryGrid images={images} />

        {/* Instagram CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-gold/30 bg-gold/5 px-8 py-4">
            <Instagram size={24} className="text-gold" />
            <div>
              <p className="font-semibold text-black">Follow us on Instagram</p>
              <p className="text-sm text-warm-grey">@timztrimz</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
