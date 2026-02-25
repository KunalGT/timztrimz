import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const limitStr = request.nextUrl.searchParams.get("limit");
  const limit = limitStr ? parseInt(limitStr, 10) : undefined;

  const reviews = await prisma.review.findMany({
    include: {
      booking: {
        include: { service: true },
      },
    },
    orderBy: { createdAt: "desc" },
    ...(limit ? { take: limit } : {}),
  });

  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rating, comment, phone } = body;

    if (!phone || !rating) {
      return NextResponse.json(
        { error: "Phone number and rating are required." },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5." },
        { status: 400 }
      );
    }

    // Normalize phone: strip spaces and dashes
    const normalizedPhone = phone.replace(/[\s\-()]/g, "");

    // Find a completed booking matching this phone that doesn't have a review yet
    const booking = await prisma.booking.findFirst({
      where: {
        clientPhone: normalizedPhone,
        status: "completed",
        review: null,
      },
      orderBy: { date: "desc" },
    });

    if (!booking) {
      return NextResponse.json(
        {
          error:
            "No completed booking found for this phone number, or you've already reviewed all your visits.",
        },
        { status: 404 }
      );
    }

    const review = await prisma.review.create({
      data: {
        bookingId: booking.id,
        rating,
        comment: comment || null,
      },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
