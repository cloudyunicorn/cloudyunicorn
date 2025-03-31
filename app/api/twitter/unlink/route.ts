import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/actions/user.action";

export async function POST(req: Request) {
  try {
    // Retrieve the current user's ID via a secure server action.
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Delete the Twitter account record for this user.
    const result = await prisma.socialAccount.delete({
      where: { userId_platform: { userId, platform: "twitter" } },
    });
    return NextResponse.json({ message: "Twitter account unlinked successfully" }, { status: 200 });
  } catch (err: any) {
    console.error("Error unlinking Twitter account:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
