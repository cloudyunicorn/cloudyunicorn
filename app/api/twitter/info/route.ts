import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/actions/user.action";

export async function GET() {
  try {
    const userId = await getUserId();
    const account = await prisma.socialAccount.findUnique({
      where: { userId_platform: { userId, platform: "twitter" } },
    });
    return NextResponse.json({ linked: !!account, account });
  } catch (error: any) {
    console.error("Error fetching Twitter info:", error);
    return NextResponse.json({ linked: false, error: error.message }, { status: 500 });
  }
}
