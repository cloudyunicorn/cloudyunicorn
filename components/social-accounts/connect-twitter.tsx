'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { RiTwitterXFill } from "react-icons/ri";
import { Spinner } from '../ui/spinner';

export default function ConnectTwitterButton() {
  const [loading, setLoading] = useState(false);

  const handleConnectTwitter = async () => {
    setLoading(true);
    try {
      // Call the API route to get the Twitter auth URL and request token
      const res = await fetch('/api/twitter/request', { method: 'GET' });
      const data = await res.json();
      if (data.error) {
        console.error('Error getting Twitter auth link:', data.error);
        setLoading(false);
        return;
      }
      // Redirect the user to Twitter for authentication
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('Error connecting Twitter:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleConnectTwitter}
      disabled={loading}
      variant="outline"
      className="w-full gap-2"
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <Spinner size="sm" />
          Connecting...
        </div>
      ) : (
        <>
          <RiTwitterXFill />
          Connect Account
        </>
      )}
    </Button>
  );
}
