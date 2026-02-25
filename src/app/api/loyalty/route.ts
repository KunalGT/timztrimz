import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get("phone");
  if (!phone) {
    return NextResponse.json({ error: "Phone required" }, { status: 400 });
  }

  const normalizedPhone = phone.replace(/[\s\-()]/g, "");
  const visits = await prisma.loyaltyVisit.findMany({
    where: { clientPhone: normalizedPhone },
    orderBy: { visitDate: "desc" },
  });

  const totalVisits = visits.length;
  const unredeemedVisits = visits.filter(v => !v.redeemed).length;
  const stampsTowardsFree = unredeemedVisits % 10;
  const freeVisitsEarned = Math.floor(totalVisits / 10);

  return NextResponse.json({ totalVisits, unredeemedVisits, stampsTowardsFree, freeVisitsEarned });
}
