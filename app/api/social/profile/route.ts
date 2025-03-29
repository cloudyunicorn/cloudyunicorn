import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  // Here, for simplicity, we get user id from a request header; in practice, use proper authentication
  const userId = request.headers.get("user-id");
  if (!userId) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  const socialAccount = await prisma.socialAccount.findUnique({
    where: { userId_platform: { userId, platform: "twitter" } },
  });

  if (!socialAccount) {
    return NextResponse.json({ error: "No Twitter account found" }, { status: 404 });
  }

  const response = await fetch("https://api.twitter.com/2/users/me", {
    headers: { Authorization: `Bearer ${socialAccount.accessToken}` },
  });

  const profileData = await response.json();
  return NextResponse.json(profileData);
}
