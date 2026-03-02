import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const period = searchParams.get("period") || "month"; // week, month, year

  const now = new Date();
  let startDate: Date;

  if (period === "week") {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 7);
  } else if (period === "year") {
    startDate = new Date(now);
    startDate.setFullYear(startDate.getFullYear() - 1);
  } else {
    startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - 1);
  }

  // Get all bookings in range
  const bookings = await prisma.booking.findMany({
    where: { createdAt: { gte: startDate } },
    include: { service: true },
  });

  const completed = bookings.filter((b) => b.status === "completed");
  const noShows = bookings.filter((b) => b.status === "no-show");
  const cancelled = bookings.filter((b) => b.status === "cancelled");

  // Revenue
  const revenue = completed.reduce((sum, b) => sum + b.service.price, 0);
  const depositRevenue = bookings
    .filter((b) => b.depositPaid && b.deposit)
    .reduce((sum, b) => sum + (b.deposit || 0), 0);

  // Popular services
  const serviceCount: Record<string, { name: string; count: number; revenue: number }> = {};
  for (const b of completed) {
    if (!serviceCount[b.serviceId]) {
      serviceCount[b.serviceId] = { name: b.service.name, count: 0, revenue: 0 };
    }
    serviceCount[b.serviceId].count++;
    serviceCount[b.serviceId].revenue += b.service.price;
  }
  const popularServices = Object.values(serviceCount)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Peak hours
  const hourCount: Record<string, number> = {};
  for (const b of completed) {
    const hour = b.startTime.split(":")[0];
    hourCount[hour] = (hourCount[hour] || 0) + 1;
  }
  const peakHours = Object.entries(hourCount)
    .map(([hour, count]) => ({ hour: `${hour}:00`, count }))
    .sort((a, b) => b.count - a.count);

  // Daily revenue chart
  const dailyRevenue: Record<string, number> = {};
  for (const b of completed) {
    const day = new Date(b.date).toISOString().split("T")[0];
    dailyRevenue[day] = (dailyRevenue[day] || 0) + b.service.price;
  }
  const revenueChart = Object.entries(dailyRevenue)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Day-of-week distribution
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayDistribution = dayNames.map((name, i) => ({
    day: name,
    count: completed.filter((b) => new Date(b.date).getDay() === i).length,
  }));

  // Reviews
  const reviews = await prisma.review.findMany({
    where: { createdAt: { gte: startDate } },
  });
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return NextResponse.json({
    summary: {
      totalBookings: bookings.length,
      completed: completed.length,
      noShows: noShows.length,
      cancelled: cancelled.length,
      revenue,
      depositRevenue,
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    },
    popularServices,
    peakHours,
    revenueChart,
    dayDistribution,
  });
}
