import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  let settings = await prisma.settings.findFirst({
    where: { id: "default" },
  });

  if (!settings) {
    settings = await prisma.settings.create({
      data: { id: "default" },
    });
  }

  return NextResponse.json(settings);
}

export async function PATCH(request: NextRequest) {
  const { shopName, openTime, closeTime, slotInterval, daysOff, depositRequired } =
    await request.json();

  const settings = await prisma.settings.upsert({
    where: { id: "default" },
    update: {
      shopName,
      openTime,
      closeTime,
      slotInterval,
      daysOff,
      depositRequired,
    },
    create: {
      id: "default",
      shopName,
      openTime,
      closeTime,
      slotInterval,
      daysOff,
      depositRequired,
    },
  });

  return NextResponse.json(settings);
}
