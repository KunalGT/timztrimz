import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get("phone");

  if (!phone) {
    return NextResponse.json({ error: "Phone required" }, { status: 400 });
  }

  const visits = await prisma.loyaltyVisit.findMany({
    where: { clientPhone: phone },
    orderBy: { visitDate: "desc" },
  });

  return NextResponse.json(visits);
}

export async function POST(request: NextRequest) {
  const { clientPhone } = await request.json();

  const visit = await prisma.loyaltyVisit.create({
    data: { clientPhone },
  });

  return NextResponse.json(visit, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const { id } = await request.json();

  const visit = await prisma.loyaltyVisit.update({
    where: { id },
    data: { redeemed: true },
  });

  return NextResponse.json(visit);
}
