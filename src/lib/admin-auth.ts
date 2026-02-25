import { cookies } from "next/headers";

const ADMIN_COOKIE = "timztrimz_admin";

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const pin = process.env.ADMIN_PIN || "1234";
  return token === Buffer.from(pin).toString("base64");
}

export function getAdminToken(): string {
  const pin = process.env.ADMIN_PIN || "1234";
  return Buffer.from(pin).toString("base64");
}
