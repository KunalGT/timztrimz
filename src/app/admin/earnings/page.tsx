import { prisma } from "@/lib/db";
import {
  DollarSign,
  TrendingUp,
  Calendar,
} from "lucide-react";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  format,
} from "date-fns";

export const dynamic = "force-dynamic";

export default async function EarningsPage() {
  const now = new Date();

  const periods = [
    {
      label: "Today",
      start: startOfDay(now),
      end: endOfDay(now),
      icon: DollarSign,
    },
    {
      label: "This Week",
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: endOfWeek(now, { weekStartsOn: 1 }),
      icon: TrendingUp,
    },
    {
      label: "This Month",
      start: startOfMonth(now),
      end: endOfMonth(now),
      icon: Calendar,
    },
  ];

  const results = await Promise.all(
    periods.map(async (period) => {
      const bookings = await prisma.booking.findMany({
        where: {
          date: { gte: period.start, lte: period.end },
          status: "completed",
        },
        include: { service: true },
      });
      const revenue = bookings.reduce((sum, b) => sum + b.service.price, 0);
      const count = bookings.length;
      return { ...period, revenue, count };
    })
  );

  // Last 7 days breakdown
  const last7 = await Promise.all(
    Array.from({ length: 7 }).map(async (_, i) => {
      const day = subDays(now, 6 - i);
      const bookings = await prisma.booking.findMany({
        where: {
          date: { gte: startOfDay(day), lte: endOfDay(day) },
          status: "completed",
        },
        include: { service: true },
      });
      const revenue = bookings.reduce((sum, b) => sum + b.service.price, 0);
      return {
        day: format(day, "EEE"),
        date: format(day, "d MMM"),
        revenue,
        count: bookings.length,
      };
    })
  );

  const maxRevenue = Math.max(...last7.map((d) => d.revenue), 1);

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl text-black">Earnings</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {results.map((period) => {
          const Icon = period.icon;
          return (
            <div
              key={period.label}
              className="bg-white rounded-xl p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-warm-grey">{period.label}</span>
                <Icon size={18} className="text-gold" />
              </div>
              <p className="text-3xl font-semibold text-black">
                £{period.revenue.toFixed(0)}
              </p>
              <p className="text-sm text-warm-grey mt-1">
                {period.count} completed booking{period.count !== 1 ? "s" : ""}
              </p>
            </div>
          );
        })}
      </div>

      {/* Last 7 days chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-medium text-black mb-6">Last 7 Days</h2>
        <div className="flex items-end gap-3 h-48">
          {last7.map((day) => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-black">
                £{day.revenue.toFixed(0)}
              </span>
              <div className="w-full relative" style={{ height: "140px" }}>
                <div
                  className="absolute bottom-0 w-full bg-gold/20 rounded-t-lg transition-all"
                  style={{
                    height: `${(day.revenue / maxRevenue) * 100}%`,
                    minHeight: day.revenue > 0 ? "8px" : "2px",
                  }}
                >
                  <div
                    className="absolute bottom-0 w-full bg-gold rounded-t-lg"
                    style={{ height: "60%" }}
                  />
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-black">{day.day}</div>
                <div className="text-xs text-warm-grey">{day.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
