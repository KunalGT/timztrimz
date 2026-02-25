import { Check } from "lucide-react";

type LoyaltyCardProps = {
  visits: number;
  total?: number;
};

export default function LoyaltyCard({ visits, total = 10 }: LoyaltyCardProps) {
  const filled = visits % total;

  return (
    <div className="rounded-xl border border-gold/20 bg-gradient-to-br from-black to-gray-900 p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-gold">
          Loyalty Card
        </h3>
        <span className="text-xs text-warm-grey">
          {filled}/{total} stamps
        </span>
      </div>
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors ${
              i < filled
                ? "border-gold bg-gold text-black"
                : "border-warm-grey/40 bg-transparent"
            }`}
          >
            {i < filled && <Check size={16} strokeWidth={3} />}
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-gold font-medium">
        Every 10th Cut Free!
      </p>
    </div>
  );
}
