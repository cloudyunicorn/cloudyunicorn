"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
interface ScheduledPost {
  id: string;
  content: string;
  scheduledAt: string;
  platform: string;
  status: string;
  postedAt?: string;
}

interface DataContextType {
  scheduledPosts: ScheduledPost[];
  twitterStatus: boolean | null;
  twitterProfile: any;
  refreshData: () => Promise<void>;
  forceRefresh: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [twitterStatus, setTwitterStatus] = useState<boolean | null>(null);
  const [twitterProfile, setTwitterProfile] = useState<any>(null);

  const fetchAllData = async () => {
    try {
      // Fetch scheduled posts
      const postsRes = await fetch('/api/posts/scheduled');
      const posts = await postsRes.json();
      setScheduledPosts(posts);

      // Fetch Twitter status
      const twitterRes = await fetch('/api/twitter/info');
      const twitterData = await twitterRes.json();
      setTwitterStatus(twitterData.linked);

      // Fetch Twitter profile if connected
      if (twitterData.linked) {
        const profileRes = await fetch('/api/twitter/profile');
        const profile = await profileRes.json();
        setTwitterProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const forceRefresh = async () => {
    setTwitterStatus(null); // Reset status to trigger loading
    await fetchAllData();
  };

  return (
    <DataContext.Provider value={{ 
      scheduledPosts, 
      twitterStatus, 
      twitterProfile,
      refreshData: fetchAllData,
      forceRefresh
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
