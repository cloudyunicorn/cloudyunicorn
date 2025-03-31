"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RiTwitterXFill } from "react-icons/ri";

export default function UnlinkTwitterButton({ onUnlink }: { onUnlink: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleUnlinkTwitter = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/twitter/unlink", { method: "POST" });
      const data = await res.json();
      if (data.error) {
        console.error("Error unlinking Twitter:", data.error);
      } else {
        onUnlink();
      }
    } catch (error) {
      console.error("Error unlinking Twitter:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleUnlinkTwitter}
      disabled={loading}
      variant="destructive"
      className="w-full gap-2"
    >
      <RiTwitterXFill />
      {loading ? "Unlinking..." : "Unlink Twitter"}
    </Button>
  );
}
