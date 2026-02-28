"use client";

const CATEGORIES = ["Cuts", "Beard", "Kids", "Specials", "Add-ons", "SMP"];

interface ServiceTabsProps {
  active: string;
  onChange: (category: string) => void;
}

export default function ServiceTabs({ active, onChange }: ServiceTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all ${
            active === cat
              ? "bg-gold text-black shadow-sm"
              : "bg-gray-100 text-warm-grey hover:bg-gray-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
