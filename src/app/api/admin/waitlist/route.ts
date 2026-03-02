import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const entries = await prisma.waitlistEntry.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(entries);
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 });
  }

  const entry = await prisma.waitlistEntry.update({
    where: { id },
    data: {
      status,
      ...(status === "notified" ? { notifiedAt: new Date() } : {}),
    },
  });

  return NextResponse.json(entry);
}
