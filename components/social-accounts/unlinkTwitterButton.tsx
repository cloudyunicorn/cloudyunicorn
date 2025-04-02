"use client";

import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { RiTwitterXFill } from "react-icons/ri";
import { Spinner } from "@/components/ui/spinner";

interface UnlinkTwitterButtonProps {
  onUnlink?: () => void;
}

export default function UnlinkTwitterButton({ onUnlink }: UnlinkTwitterButtonProps) {
  const [loading, setLoading] = useState(false);

  const { refreshData } = useData();

  const handleUnlinkTwitter = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/twitter/unlink", { method: "POST" });
      const data = await res.json();
      if (data.error) {
        console.error("Error unlinking Twitter:", data.error);
      } else {
        onUnlink?.();
        await refreshData();
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
      {loading ? (
        <div className="flex items-center gap-2">
          <Spinner size="sm" />
          Unlinking...
        </div>
      ) : (
        <>
          <RiTwitterXFill />
          Unlink Twitter
        </>
      )}
    </Button>
  );
}
