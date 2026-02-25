import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(images);
}

export async function POST(request: NextRequest) {
  const { url, caption, category, featured } = await request.json();

  const image = await prisma.galleryImage.create({
    data: {
      url,
      caption: caption || null,
      category: category || null,
      featured: featured || false,
    },
  });

  return NextResponse.json(image, { status: 201 });
}
