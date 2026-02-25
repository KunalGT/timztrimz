import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAdminToken } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { pin } = await request.json();
  const expectedPin = process.env.ADMIN_PIN || "1234";

  if (pin !== expectedPin) {
    return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("timztrimz_admin", getAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return NextResponse.json({ success: true });
}
