"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface TwitterProfile {
  id: string;
  name: string;
  screen_name: string;
  email?: string;
  profile_image_url_https: string;
}

export default function TwitterProfileCard() {
  const [profile, setProfile] = useState<TwitterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        // Check for cached profile data
        const cachedProfile = localStorage.getItem("twitterProfile");
        const cachedTimestamp = localStorage.getItem("twitterProfileFetchedAt");
        const now = Date.now();

        if (cachedProfile && cachedTimestamp) {
          const ts = parseInt(cachedTimestamp, 10);
          if (now - ts < 15 * 60 * 1000) { // 15 minutes in milliseconds
            setProfile(JSON.parse(cachedProfile));
            setLoading(false);
            return;
          }
        }

        // Fetch fresh data from API
        const res = await fetch("/api/twitter/profile", { method: "GET" });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch profile info");
        }
        setProfile(data);
        // Cache data and current timestamp
        localStorage.setItem("twitterProfile", JSON.stringify(data));
        localStorage.setItem("twitterProfileFetchedAt", now.toString());
      } catch (err: any) {
        console.error("Error fetching Twitter profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // While loading, you can choose to display nothing or a loader.
  if (loading) return <p>Loading Twitter profile...</p>;

  // If error indicates account not connected, return null.
  if (error && error.toLowerCase().includes("twitter account not connected"))
    return null;

  // Optionally display other errors.
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!profile) return null;

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="flex items-center gap-4">
        <img
          src={profile.profile_image_url_https}
          alt={profile.name}
          className="h-16 w-16 rounded-full"
        />
        <div>
          <CardTitle>{profile.name}</CardTitle>
          <p className="text-sm text-muted-foreground">@{profile.screen_name}</p>
        </div>
      </CardHeader>
      <CardContent>
        {profile.email && <p className="text-sm">Email: {profile.email}</p>}
      </CardContent>
    </Card>
  );
}
