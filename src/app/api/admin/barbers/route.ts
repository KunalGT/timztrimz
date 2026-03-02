import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const barbers = await prisma.barber.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(barbers);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, bio, image } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const barber = await prisma.barber.create({
    data: { name, bio: bio || null, image: image || null },
  });

  return NextResponse.json(barber, { status: 201 });
}
