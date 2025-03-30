"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TwitterCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function processCallback() {
      // Call the API route that handles the callback and token exchange.
      await fetch("/api/twitter/callback", { method: "GET" });
      // Redirect to dashboard after processing.
      router.push("/dashboard");
    }
    processCallback();
  }, [router]);

  return (
    <div className="p-4">
      <p>Processing Twitter connection... please wait.</p>
    </div>
  );
}
