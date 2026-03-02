import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
    });
  }
  return _stripe;
}

export async function createDepositPaymentIntent(
  amount: number,
  bookingId: string,
  customerEmail: string,
) {
  return getStripe().paymentIntents.create({
    amount: Math.round(amount * 100), // Convert pounds to pence
    currency: "gbp",
    automatic_payment_methods: { enabled: true },
    metadata: { bookingId },
    receipt_email: customerEmail,
    description: `Deposit for booking ${bookingId}`,
  });
}
