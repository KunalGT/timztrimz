import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { status } = await request.json();

  const validStatuses = ["confirmed", "completed", "cancelled", "no-show", "pending_payment"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  // If marking no-show, increment the client's no-show count
  const updateData: Record<string, unknown> = { status };
  if (status === "no-show") {
    const current = await prisma.booking.findUnique({ where: { id } });
    if (current) {
      updateData.noShowCount = (current.noShowCount || 0) + 1;
    }
  }

  // If completing, record a loyalty visit
  if (status === "completed") {
    const current = await prisma.booking.findUnique({ where: { id } });
    if (current) {
      await prisma.loyaltyVisit.create({
        data: { clientPhone: current.clientPhone },
      });
    }
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(booking);
}
