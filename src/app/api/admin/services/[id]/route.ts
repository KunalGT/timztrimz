import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await request.json();

  const service = await prisma.service.update({
    where: { id },
    data: {
      name: data.name,
      category: data.category,
      price: data.price,
      duration: data.duration,
      description: data.description || null,
      image: data.image || null,
    },
  });

  return NextResponse.json(service);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.service.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
