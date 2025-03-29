import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import prisma from "@/lib/prisma";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function GET() {
  // Initiate Twitter OAuth
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: "twitter" });
  if (error || !data?.url) {
    return NextResponse.json({ error: error?.message || "Error initiating OAuth" }, { status: 400 });
  }
  return NextResponse.redirect(data.url);
}

export async function POST() {
  // After OAuth callback, get the session and extract Twitter tokens
  const { data, error } = await supabase.auth.getSession();
  if (error || !data?.session) {
    return NextResponse.json({ error: "Session not found" }, { status: 401 });
  }
  
  const user = data.session.user;
  const accessToken = data.session.provider_token;
  const refreshToken = data.session.provider_refresh_token;

  if (!user || !accessToken) {
    return NextResponse.json({ error: "Twitter login failed" }, { status: 401 });
  }

  try {
    // Save or update the social account info in the database
    await prisma.socialAccount.upsert({
      where: { userId_platform: { userId: user.id, platform: "twitter" } },
      update: { accessToken, refreshToken },
      create: {
        userId: user.id,
        platform: "twitter",
        accessToken,
        refreshToken,
      },
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Twitter account connected successfully" }, { status: 200 });
}
