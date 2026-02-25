import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const services = await prisma.service.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(services);
}

export async function POST(request: NextRequest) {
  const { name, category, price, duration, description, image } =
    await request.json();

  const service = await prisma.service.create({
    data: {
      name,
      category,
      price,
      duration,
      description: description || null,
      image: image || null,
    },
  });

  return NextResponse.json(service, { status: 201 });
}
