"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

type Service = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  duration: number;
  image: string | null;
};

const CATEGORIES = ["All", "Cuts", "Beard", "Kids", "Specials", "Add-ons", "SMP"] as const;

export default function ServicesList({ services }: { services: Service[] }) {
  const [activeTab, setActiveTab] = useState<string>("All");

  const filtered =
    activeTab === "All"
      ? services
      : services.filter((s) => s.category === activeTab);

  return (
    <>
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              activeTab === cat
                ? "bg-gold text-white"
                : "bg-gray-100 text-warm-grey hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((service) => (
          <div
            key={service.id}
            className="group rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            {service.image && (
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              </div>
            )}
            <div className="p-5">
              <h3 className="font-semibold text-lg text-black mb-1">
                {service.name}
              </h3>
              {service.description && (
                <p className="text-sm text-warm-grey mb-3 line-clamp-2">
                  {service.description}
                </p>
              )}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 text-warm-grey text-sm">
                  <Clock size={14} />
                  <span>{service.duration} min</span>
                </div>
                <span className="text-lg font-bold text-black">
                  &pound;{service.price.toFixed(0)}
                </span>
              </div>
              <Link
                href={`/book?service=${service.id}`}
                className="block w-full rounded-lg bg-gold py-2.5 text-center text-sm font-semibold text-white hover:bg-gold-dark transition-colors"
              >
                Book This
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
