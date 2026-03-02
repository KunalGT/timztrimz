import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyPin, generateAdminToken } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { pin } = await request.json();

  if (!verifyPin(pin)) {
    return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("timztrimz_admin", generateAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return NextResponse.json({ success: true });
}
