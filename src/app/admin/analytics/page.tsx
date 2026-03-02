"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Star,
  AlertTriangle,
  XCircle,
} from "lucide-react";

interface AnalyticsData {
  summary: {
    totalBookings: number;
    completed: number;
    noShows: number;
    cancelled: number;
    revenue: number;
    depositRevenue: number;
    avgRating: number;
    reviewCount: number;
  };
  popularServices: { name: string; count: number; revenue: number }[];
  peakHours: { hour: string; count: number }[];
  revenueChart: { date: string; amount: number }[];
  dayDistribution: { day: string; count: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState("month");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/analytics?period=${period}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, [period]);

  if (loading || !data) {
    return (
      <div className="text-center py-12 text-warm-grey">Loading analytics...</div>
    );
  }

  const { summary } = data;
  const maxBarHeight = 120;
  const maxRevenue = Math.max(...data.revenueChart.map((d) => d.amount), 1);
  const maxDayCount = Math.max(...data.dayDistribution.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display text-2xl text-black">Analytics</h1>
        <div className="flex gap-2">
          {["week", "month", "year"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                period === p
                  ? "bg-gold text-black"
                  : "bg-gray-100 text-warm-grey hover:bg-gray-200"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Revenue" value={`£${summary.revenue.toFixed(0)}`} color="text-success" />
        <StatCard icon={Calendar} label="Bookings" value={String(summary.totalBookings)} color="text-gold" />
        <StatCard icon={Star} label="Avg Rating" value={`${summary.avgRating}/5`} color="text-yellow-500" />
        <StatCard icon={AlertTriangle} label="No-Shows" value={String(summary.noShows)} color="text-danger" />
      </div>

      {/* Completion Stats */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-medium text-black mb-4">Booking Outcomes</h2>
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-warm-grey">Completed</span>
              <span className="font-medium text-success">{summary.completed}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-success rounded-full"
                style={{ width: `${summary.totalBookings ? (summary.completed / summary.totalBookings) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-warm-grey">No-Shows</span>
              <span className="font-medium text-danger">{summary.noShows}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-danger rounded-full"
                style={{ width: `${summary.totalBookings ? (summary.noShows / summary.totalBookings) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-warm-grey">Cancelled</span>
              <span className="font-medium text-warm-grey">{summary.cancelled}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-warm-grey rounded-full"
                style={{ width: `${summary.totalBookings ? (summary.cancelled / summary.totalBookings) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Services */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-medium text-black mb-4">Popular Services</h2>
          {data.popularServices.length === 0 ? (
            <p className="text-sm text-warm-grey">No data yet</p>
          ) : (
            <div className="space-y-3">
              {data.popularServices.map((s, i) => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="w-6 text-sm text-warm-grey text-right">{i + 1}.</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-black">{s.name}</span>
                      <span className="text-xs text-warm-grey">{s.count} bookings</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold rounded-full"
                        style={{ width: `${(s.count / (data.popularServices[0]?.count || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-black">£{s.revenue.toFixed(0)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Peak Hours */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-medium text-black mb-4">Peak Hours</h2>
          {data.peakHours.length === 0 ? (
            <p className="text-sm text-warm-grey">No data yet</p>
          ) : (
            <div className="flex items-end gap-2 h-[140px]">
              {data.peakHours.slice(0, 10).map((h) => (
                <div key={h.hour} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-warm-grey">{h.count}</span>
                  <div
                    className="w-full bg-gold/30 rounded-t"
                    style={{ height: `${(h.count / (data.peakHours[0]?.count || 1)) * maxBarHeight}px` }}
                  />
                  <span className="text-[10px] text-warm-grey">{h.hour}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-medium text-black mb-4">Daily Revenue</h2>
          {data.revenueChart.length === 0 ? (
            <p className="text-sm text-warm-grey">No data yet</p>
          ) : (
            <div className="flex items-end gap-1 h-[140px] overflow-x-auto">
              {data.revenueChart.map((d) => (
                <div key={d.date} className="flex-shrink-0 flex flex-col items-center gap-1" style={{ width: 20 }}>
                  <div
                    className="w-full bg-success/40 rounded-t"
                    style={{ height: `${(d.amount / maxRevenue) * maxBarHeight}px` }}
                  />
                  <span className="text-[8px] text-warm-grey rotate-45 origin-left">{d.date.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Day Distribution */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-medium text-black mb-4">Busiest Days</h2>
          <div className="flex items-end gap-3 h-[140px]">
            {data.dayDistribution.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-warm-grey">{d.count}</span>
                <div
                  className="w-full bg-gold rounded-t"
                  style={{ height: `${maxDayCount ? (d.count / maxDayCount) * maxBarHeight : 0}px`, minHeight: d.count > 0 ? 4 : 0 }}
                />
                <span className="text-xs font-medium text-black">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className={color} />
        <span className="text-xs text-warm-grey">{label}</span>
      </div>
      <p className="text-2xl font-bold text-black">{value}</p>
    </div>
  );
}
