'use client';

import { useData } from '@/context/DataContext';
import UnlinkTwitterButton from './unlinkTwitterButton';
import ConnectTwitterButton from './connect-twitter';
import TwitterProfileCard from '../TwitterProfileCard';
import { Spinner } from '@/components/ui/spinner';

export default function TwitterAccountStatus() {
  const { twitterStatus, twitterProfile } = useData();
  const linked = twitterStatus === true;
  const isLoading = twitterStatus === null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 p-4">
        <Spinner size="sm" />
        <span>Loading Twitter status...</span>
      </div>
    );
  }

  return (
    <div>
      {linked ? (
        <div className="flex flex-col gap-4">
          <UnlinkTwitterButton />
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
