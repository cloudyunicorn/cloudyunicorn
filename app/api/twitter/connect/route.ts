import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, accessToken, refreshToken } = body;

    if (!userId || !accessToken) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upsert the Twitter connection info
    const result = await prisma.socialAccount.upsert({
      where: { userId_platform: { userId, platform: "twitter" } },
      update: { accessToken, refreshToken },
      create: {
        userId,
        platform: "twitter",
        accessToken,
        refreshToken,
      },
    });
    console.log("Upsert result:", result);
    return NextResponse.json({ message: "Twitter account connected successfully" });
  } catch (err: any) {
    console.error("Error saving Twitter connection:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
