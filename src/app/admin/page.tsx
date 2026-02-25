import { prisma } from "@/lib/db";
import {
  CalendarDays,
  DollarSign,
  TrendingUp,
  Star,
  Clock,
} from "lucide-react";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [todayBookings, weekBookings, monthBookings, reviews, nextBooking] =
    await Promise.all([
      prisma.booking.findMany({
        where: { date: { gte: todayStart, lte: todayEnd } },
        include: { service: true },
        orderBy: { startTime: "asc" },
      }),
      prisma.booking.findMany({
        where: {
          date: { gte: weekStart, lte: weekEnd },
          status: "completed",
        },
        include: { service: true },
      }),
      prisma.booking.findMany({
        where: { date: { gte: monthStart, lte: monthEnd } },
      }),
      prisma.review.findMany({ select: { rating: true } }),
      prisma.booking.findFirst({
        where: {
          date: { gte: todayStart },
          status: "confirmed",
        },
        include: { service: true },
        orderBy: [{ date: "asc" }, { startTime: "asc" }],
      }),
    ]);

  const weekRevenue = weekBookings.reduce((sum, b) => sum + b.service.price, 0);
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "N/A";

  const stats = [
    {
      label: "Today's Bookings",
      value: todayBookings.length,
      icon: CalendarDays,
      color: "text-gold",
    },
    {
      label: "This Week's Revenue",
      value: `£${weekRevenue.toFixed(0)}`,
      icon: DollarSign,
      color: "text-success",
    },
    {
      label: "Monthly Bookings",
      value: monthBookings.length,
      icon: TrendingUp,
      color: "text-blue-500",
    },
    {
      label: "Average Rating",
      value: avgRating,
      icon: Star,
      color: "text-gold",
    },
  ];

  const statusColors: Record<string, string> = {
    confirmed: "bg-success/10 text-success",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-danger/10 text-danger",
    "no-show": "bg-warm-grey/20 text-warm-grey",
  };

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl text-black">Dashboard</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-5 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-warm-grey">{stat.label}</span>
                <Icon size={18} className={stat.color} />
              </div>
              <p className="text-2xl font-semibold text-black">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Next Booking */}
      {nextBooking && (
        <div className="bg-gold/5 border border-gold/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-gold" />
            <span className="text-sm font-medium text-gold">Next Booking</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-black">
                {nextBooking.clientName}
              </p>
              <p className="text-sm text-warm-grey">
                {nextBooking.service.name} &middot;{" "}
                {format(nextBooking.date, "EEE d MMM")} at{" "}
                {nextBooking.startTime}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[nextBooking.status] || ""}`}
            >
              {nextBooking.status}
            </span>
          </div>
        </div>
      )}

      {/* Today's Timeline */}
      <div>
        <h2 className="font-display text-lg text-black mb-4">
          Today&apos;s Bookings
        </h2>
        {todayBookings.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-gray-100 text-center text-warm-grey">
            No bookings today
          </div>
        ) : (
          <div className="space-y-1">
            {todayBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4"
              >
                <div className="w-16 text-right">
                  <span className="text-sm font-mono font-medium text-black">
                    {booking.startTime}
                  </span>
                </div>
                <div className="w-0.5 h-10 bg-gold/30 rounded" />
                <div className="flex-1">
                  <p className="font-medium text-black">
                    {booking.clientName}
                  </p>
                  <p className="text-sm text-warm-grey">
                    {booking.service.name}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status] || ""}`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
