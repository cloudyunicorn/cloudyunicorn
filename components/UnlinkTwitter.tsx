"use client";

import { useState } from "react";
import { useSupabase } from "@/providers/supabase-provider";

export default function UnlinkTwitterButton() {
  const supabase = useSupabase();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUnlink = async () => {
    setLoading(true);
    setMessage("");
    try {
      // Retrieve all identities linked to the user
      const {
        data: { identities },
        error: getIdError,
      } = await supabase.auth.getUserIdentities();
      if (getIdError) throw getIdError;

      const twitterIdentity = identities.find(
        (identity: any) => identity.provider === "twitter"
      );

      if (!twitterIdentity) {
        setMessage("No twitter identity is linked to your account.");
        setLoading(false);
        return;
      }

      const { data, error: unlinkError } =
        await supabase.auth.unlinkIdentity(twitterIdentity);
      if (unlinkError) throw unlinkError;

      setMessage("twitter account has been unlinked successfully!");
    } catch (err: any) {
      console.error("Error unlinking identity:", err);
      setMessage("Error unlinking twitter account: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleUnlink}
        disabled={loading}
        className="bg-red-500 text-white px-4 py-2 rounded-md"
      >
        {loading ? "Unlinking..." : "Unlink twitter Account"}
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
