"use client";

import { useState } from "react";

export default function ConnectTwitterButton() {
  const [loading, setLoading] = useState(false);

  const handleConnectTwitter = () => {
    setLoading(true);
    // Redirect to the API route for Twitter connection
    window.location.href = "/api/social/connect";
  };

  return (
    <button
      onClick={handleConnectTwitter}
      disabled={loading}
      className="bg-blue-500 text-white px-4 py-2 rounded-md"
    >
      {loading ? "Connecting..." : "Connect Twitter"}
    </button>
  );
}
