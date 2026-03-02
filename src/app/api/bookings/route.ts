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

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const dateStr = searchParams.get("date");
  const status = searchParams.get("status");
  const phone = searchParams.get("phone");

  const where: Record<string, unknown> = {};

  if (phone) {
    const normalizedPhone = phone.replace(/[\s\-()]/g, "");
    where.clientPhone = normalizedPhone;
  }

  if (dateStr) {
    const dayStart = new Date(dateStr + "T00:00:00");
    const dayEnd = new Date(dateStr + "T23:59:59");
    where.date = { gte: dayStart, lte: dayEnd };
  }

  if (status) {
    where.status = status;
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: { service: true, review: true },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  return NextResponse.json(bookings);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, clientEmail, clientPhone, serviceId, date, startTime, notes, barberId } = body;

    // Validate required fields
    if (!clientName || !clientEmail || !clientPhone || !serviceId || !date || !startTime) {
      return NextResponse.json(
        { error: "Missing required fields: clientName, clientEmail, clientPhone, serviceId, date, startTime" },
        { status: 400 }
      );
    }

    // Get service to determine duration
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Calculate end time
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = startMinutes + service.duration;
    const endTime = minutesToTime(endMinutes);

    // Check for conflicts with existing confirmed bookings
    const dayStart = new Date(date + "T00:00:00");
    const dayEnd = new Date(date + "T23:59:59");

    const bookingWhere: Record<string, unknown> = {
      date: { gte: dayStart, lte: dayEnd },
      status: { in: ["confirmed", "pending_payment"] },
    };
    if (barberId) bookingWhere.barberId = barberId;

    const existingBookings = await prisma.booking.findMany({
      where: bookingWhere,
    });

    const hasConflict = existingBookings.some((b) => {
      const bStart = timeToMinutes(b.startTime);
      const bEnd = timeToMinutes(b.endTime);
      return startMinutes < bEnd && endMinutes > bStart;
    });

    if (hasConflict) {
      return NextResponse.json(
        { error: "This time slot is no longer available. Please choose another." },
        { status: 409 }
      );
    }

    // Check for conflicts with blocked slots
    const blockedSlots = await prisma.blockedSlot.findMany({
      where: {
        date: { gte: dayStart, lte: dayEnd },
      },
    });

    const blockedConflict = blockedSlots.some((bs) => {
      const bsStart = timeToMinutes(bs.startTime);
      const bsEnd = timeToMinutes(bs.endTime);
      return startMinutes < bsEnd && endMinutes > bsStart;
    });

    if (blockedConflict) {
      return NextResponse.json(
        { error: "This time slot is blocked. Please choose another." },
        { status: 409 }
      );
    }

    // Check if deposit is required
    const settings = await prisma.settings.findUnique({ where: { id: "default" } });
    const depositRequired = (settings?.depositRequired || 0) > 0;

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        clientName,
        clientEmail,
        clientPhone,
        serviceId,
        barberId: barberId || null,
        date: dayStart,
        startTime,
        endTime,
        notes: notes || null,
        status: depositRequired ? "pending_payment" : "confirmed",
      },
      include: { service: true },
    });

    return NextResponse.json(
      { ...booking, depositRequired, depositAmount: settings?.depositRequired || 0 },
      { status: 201 },
    );
  } catch (error) {
    console.error("Booking creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
