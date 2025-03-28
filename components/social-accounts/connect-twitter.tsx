'use client';
import { useSupabase } from "@/providers/supabase-provider";
import React from 'react';

export default function ConnectTwitter() {
  const supabase = useSupabase();

  const connectTwitter = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'twitter' });
    if (error) {
      console.error('Error connecting to Twitter:', error.message);
    }
  };

  return (
    <button
      onClick={connectTwitter}
      className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
    >
      Connect Twitter
    </button>
  );
}