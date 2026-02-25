import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function slotsOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number
): boolean {
  return aStart < bEnd && aEnd > bStart;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const dateStr = searchParams.get("date");
  const durationStr = searchParams.get("duration");

  if (!dateStr || !durationStr) {
    return NextResponse.json(
      { error: "date and duration are required" },
      { status: 400 }
    );
  }

  const duration = parseInt(durationStr, 10);
  if (isNaN(duration) || duration <= 0) {
    return NextResponse.json(
      { error: "duration must be a positive number" },
      { status: 400 }
    );
  }

  const settings = await prisma.settings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    return NextResponse.json(
      { error: "Shop settings not found" },
      { status: 500 }
    );
  }

  // Check if the requested date is a day off
  const requestedDate = new Date(dateStr + "T00:00:00");
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = dayNames[requestedDate.getDay()];
  const daysOff = settings.daysOff.split(",").map((d) => d.trim());

  if (daysOff.includes(dayOfWeek)) {
    return NextResponse.json({ slots: [], dayOff: true });
  }

  const openMinutes = timeToMinutes(settings.openTime);
  const closeMinutes = timeToMinutes(settings.closeTime);
  const interval = settings.slotInterval;

  // Generate all possible slots
  const allSlots: { time: string; startMin: number; endMin: number }[] = [];
  for (let t = openMinutes; t + duration <= closeMinutes; t += interval) {
    allSlots.push({
      time: minutesToTime(t),
      startMin: t,
      endMin: t + duration,
    });
  }

  // Get start and end of the requested date for DB query
  const dayStart = new Date(dateStr + "T00:00:00");
  const dayEnd = new Date(dateStr + "T23:59:59");

  // Fetch existing confirmed bookings for that date
  const bookings = await prisma.booking.findMany({
    where: {
      date: { gte: dayStart, lte: dayEnd },
      status: "confirmed",
    },
  });

  // Fetch blocked slots for that date
  const blockedSlots = await prisma.blockedSlot.findMany({
    where: {
      date: { gte: dayStart, lte: dayEnd },
    },
  });

  // Build list of occupied ranges in minutes
  const occupied: { start: number; end: number }[] = [];

  for (const b of bookings) {
    occupied.push({
      start: timeToMinutes(b.startTime),
      end: timeToMinutes(b.endTime),
    });
  }

  for (const bs of blockedSlots) {
    occupied.push({
      start: timeToMinutes(bs.startTime),
      end: timeToMinutes(bs.endTime),
    });
  }

  // Filter out past slots if the date is today
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const isToday = dateStr === today;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Determine available slots
  const slots = allSlots.map((slot) => {
    const isPast = isToday && slot.startMin <= currentMinutes;
    const hasConflict = occupied.some((occ) =>
      slotsOverlap(slot.startMin, slot.endMin, occ.start, occ.end)
    );
    return {
      time: slot.time,
      available: !isPast && !hasConflict,
    };
  });

  return NextResponse.json({ slots, dayOff: false });
}
