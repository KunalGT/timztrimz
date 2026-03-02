import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  const barber = await prisma.barber.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(barber);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await prisma.barber.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
