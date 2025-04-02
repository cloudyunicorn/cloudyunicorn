'use client';

import { useEffect, useState } from 'react';
import UnlinkTwitterButton from './unlinkTwitterButton';
import ConnectTwitterButton from './connect-twitter';
import TwitterProfileCard from '../TwitterProfileCard';
import { Spinner } from '@/components/ui/spinner';

export default function TwitterAccountStatus() {
  const [linked, setLinked] = useState<boolean | null>(null);

  const fetchTwitterStatus = async () => {
    try {
      const res = await fetch('/api/twitter/info', { method: 'GET' });
      const data = await res.json();
      setLinked(data.linked);
    } catch (error) {
      console.error('Error fetching Twitter status:', error);
      setLinked(false);
    }
  };

  useEffect(() => {
    fetchTwitterStatus();
  }, []);

  if (linked === null) return (
    <div className="flex items-center justify-center gap-2 p-4">
      <Spinner size="sm" />
      <span>Loading Twitter status...</span>
    </div>
  );

  return (
    <div>
      {linked ? (
        <div className="flex flex-col gap-4">
          <UnlinkTwitterButton onUnlink={() => setLinked(false)} />
          <div>
          <TwitterProfileCard />

          </div>
        </div>
      ) : (
        <ConnectTwitterButton />
      )}
    </div>
  );
}
