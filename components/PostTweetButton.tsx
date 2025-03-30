"use client";

import { useState } from "react";

export default function PostTweetForm() {
  const [tweet, setTweet] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleTweetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tweet.trim()) return;

    setLoading(true);
    setResponseMessage("");

    try {
      const res = await fetch("/api/twitter/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tweet }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResponseMessage(`Error: ${data.error}`);
      } else {
        setResponseMessage("Tweet posted successfully!");
        setTweet(""); // Clear tweet text after success
      }
    } catch (error: any) {
      console.error("Error posting tweet:", error);
      setResponseMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 border rounded shadow">
      <form onSubmit={handleTweetSubmit}>
        <textarea
          className="w-full border p-2 rounded"
          placeholder="What's happening?"
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
          rows={4}
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={loading || !tweet.trim()}
        >
          {loading ? "Posting..." : "Tweet"}
        </button>
      </form>
      {responseMessage && <p className="mt-2 text-sm">{responseMessage}</p>}
    </div>
  );
}
