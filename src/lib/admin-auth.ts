import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const ADMIN_COOKIE = "timztrimz_admin";

function getAdminPin(): string {
  const pin = process.env.ADMIN_PIN;
  if (!pin) {
    throw new Error("ADMIN_PIN environment variable is not set");
  }
  return pin;
}

function getAdminSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SECRET environment variable is not set");
  }
  return secret;
}

export function generateAdminToken(): string {
  const pin = getAdminPin();
  const secret = getAdminSecret();
  return createHmac("sha256", secret).update(pin).digest("hex");
}

export function verifyAdminToken(token: string): boolean {
  try {
    const expected = generateAdminToken();
    const tokenBuf = Buffer.from(token, "utf8");
    const expectedBuf = Buffer.from(expected, "utf8");
    if (tokenBuf.length !== expectedBuf.length) return false;
    return timingSafeEqual(tokenBuf, expectedBuf);
  } catch {
    return false;
  }
}

export function verifyPin(pin: string): boolean {
  const expectedPin = getAdminPin();
  const pinBuf = Buffer.from(pin, "utf8");
  const expectedBuf = Buffer.from(expectedPin, "utf8");
  if (pinBuf.length !== expectedBuf.length) return false;
  return timingSafeEqual(pinBuf, expectedBuf);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}
