"use client";

import { Clock } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  duration: number;
  image: string | null;
}

interface ServiceCardProps {
  service: Service;
  selected: boolean;
  onSelect: (service: Service) => void;
}

export default function ServiceCard({
  service,
  selected,
  onSelect,
}: ServiceCardProps) {
  return (
    <button
      onClick={() => onSelect(service)}
      className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
        selected
          ? "border-gold bg-gold/5 shadow-md"
          : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-black">{service.name}</h3>
          {service.description && (
            <p className="mt-1 text-sm leading-relaxed text-warm-grey line-clamp-2">
              {service.description}
            </p>
          )}
          <div className="mt-3 flex items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-warm-grey">
              <Clock className="h-3 w-3" />
              {service.duration} min
            </span>
            <span className="text-lg font-bold text-black">
              &pound;{service.price}
            </span>
          </div>
        </div>
        <div
          className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            selected
              ? "border-gold bg-gold"
              : "border-gray-300"
          }`}
        >
          {selected && (
            <svg
              className="h-3.5 w-3.5 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}
