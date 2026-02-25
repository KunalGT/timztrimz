import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const slots = await prisma.blockedSlot.findMany({
    orderBy: [{ date: "desc" }, { startTime: "asc" }],
  });
  return NextResponse.json(slots);
}

export async function POST(request: NextRequest) {
  const { date, startTime, endTime, reason } = await request.json();

  const slot = await prisma.blockedSlot.create({
    data: {
      date: new Date(date),
      startTime,
      endTime,
      reason,
    },
  });

  return NextResponse.json(slot, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  await prisma.blockedSlot.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
