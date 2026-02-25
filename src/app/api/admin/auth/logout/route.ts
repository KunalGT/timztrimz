import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("timztrimz_admin");
  return NextResponse.json({ success: true });
}
