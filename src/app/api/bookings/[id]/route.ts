import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = await request.json();

  if (status !== "cancelled") {
    return NextResponse.json({ error: "Only cancellation is allowed" }, { status: 400 });
  }

  const existing = await prisma.booking.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  if (existing.status !== "confirmed") {
    return NextResponse.json({ error: "Only confirmed bookings can be cancelled" }, { status: 400 });
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: { status: "cancelled" },
    include: { service: true },
  });

  return NextResponse.json(booking);
}
