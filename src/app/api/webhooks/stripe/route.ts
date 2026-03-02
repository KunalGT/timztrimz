import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { sendSms, buildConfirmationMessage } from "@/lib/twilio";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const bookingId = paymentIntent.metadata?.bookingId;

    if (bookingId) {
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          depositPaid: true,
          status: "confirmed",
        },
        include: { service: true },
      });

      // Send SMS confirmation
      if (booking.clientPhone && process.env.TWILIO_ACCOUNT_SID) {
        const dateStr = new Date(booking.date).toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
        });
        try {
          const message = buildConfirmationMessage(
            booking.clientName,
            booking.service.name,
            dateStr,
            booking.startTime,
          );
          await sendSms(booking.clientPhone, message);
          await prisma.smsLog.create({
            data: {
              phone: booking.clientPhone,
              message,
              type: "confirmation",
              bookingId: booking.id,
            },
          });
        } catch (err) {
          console.error("Failed to send SMS confirmation:", err);
        }
      }
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;
    const bookingId = paymentIntent.metadata?.bookingId;

    if (bookingId) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "cancelled" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
