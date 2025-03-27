'use client';

import { AppSidebar, data } from '@/components/sidebar/AppSidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import React, { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ActiveComponent, setActiveComponent] = useState<React.ComponentType<any> | null>(null);

  return (
    <SidebarProvider>
      <AppSidebar items={data.navMain} onSelectComponent={setActiveComponent} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {ActiveComponent ? React.createElement(ActiveComponent) : children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}