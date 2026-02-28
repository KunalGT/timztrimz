"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

type GalleryImage = {
  id: string;
  url: string;
  caption: string | null;
  category: string | null;
};

const TABS = ["All", "Fades", "Beards", "Lineups", "Kids", "SMP"] as const;

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  const filtered =
    activeTab === "All"
      ? images
      : images.filter(
          (img) =>
            img.category?.toLowerCase() === activeTab.toLowerCase()
        );

  return (
    <>
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-gold text-white"
                : "bg-gray-100 text-warm-grey hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {filtered.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setLightbox(img)}
            className="block w-full break-inside-avoid overflow-hidden rounded-xl group cursor-pointer"
          >
            <div className="relative">
              <Image
                src={img.url}
                alt={img.caption || "Gallery image"}
                width={400}
                height={i % 3 === 0 ? 500 : i % 3 === 1 ? 350 : 400}
                className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                {img.caption && (
                  <p className="p-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {img.caption}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-12 right-0 text-white hover:text-gold transition-colors"
            >
              <X size={28} />
            </button>
            <Image
              src={lightbox.url.replace("w=600", "w=1200")}
              alt={lightbox.caption || "Gallery image"}
              width={1200}
              height={800}
              className="w-full rounded-xl object-cover"
              unoptimized
            />
            {lightbox.caption && (
              <p className="mt-3 text-center text-white text-lg">
                {lightbox.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
