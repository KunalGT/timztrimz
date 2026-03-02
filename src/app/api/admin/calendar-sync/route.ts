import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Generate ICS calendar feed for Google Calendar subscription
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const token = searchParams.get("token");

  // Simple token auth for calendar feed
  const expectedToken = process.env.CALENDAR_SYNC_TOKEN || process.env.ADMIN_PIN;
  if (token !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get upcoming confirmed bookings (next 60 days)
  const now = new Date();
  const future = new Date(now);
  future.setDate(future.getDate() + 60);

  const bookings = await prisma.booking.findMany({
    where: {
      date: { gte: now, lte: future },
      status: { in: ["confirmed", "pending_payment"] },
    },
    include: { service: true, barber: true },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  // Build ICS file
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Timz Trimz//Booking Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Timz Trimz Bookings",
    "X-WR-TIMEZONE:Europe/London",
  ];

  for (const booking of bookings) {
    const dateStr = new Date(booking.date).toISOString().split("T")[0].replace(/-/g, "");
    const [startH, startM] = booking.startTime.split(":");
    const [endH, endM] = booking.endTime.split(":");

    const dtStart = `${dateStr}T${startH}${startM}00`;
    const dtEnd = `${dateStr}T${endH}${endM}00`;

    const barberName = booking.barber?.name || "Tim";
    const summary = `${booking.service.name} - ${booking.clientName}`;
    const description = [
      `Client: ${booking.clientName}`,
      `Phone: ${booking.clientPhone}`,
      `Service: ${booking.service.name} (£${booking.service.price})`,
      `Barber: ${barberName}`,
      booking.notes ? `Notes: ${booking.notes}` : "",
      booking.deposit ? `Deposit: £${booking.deposit} (${booking.depositPaid ? "Paid" : "Pending"})` : "",
    ]
      .filter(Boolean)
      .join("\\n");

    lines.push(
      "BEGIN:VEVENT",
      `UID:${booking.id}@timztrimz`,
      `DTSTART;TZID=Europe/London:${dtStart}`,
      `DTEND;TZID=Europe/London:${dtEnd}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `STATUS:${booking.status === "confirmed" ? "CONFIRMED" : "TENTATIVE"}`,
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");

  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="timztrimz-bookings.ics"',
    },
  });
}
