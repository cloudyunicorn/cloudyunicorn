'use client';

import React from 'react';
import {
  BarChartIcon,
  Calendar,
  ClipboardListIcon,
  DatabaseIcon,
  FileIcon,
  HeartHandshake,
  HelpCircleIcon,
  LayoutDashboardIcon,
  SearchIcon,
  SettingsIcon,
  SwatchBook,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavMain } from './nav-main';
import { NavDocuments } from './nav-documents';
import Image from 'next/image';
import Logo from '@/assets/logo.png';
import { NavSecondary } from './nav-secondary-';
import { NavUser } from './nav-user';
import CalendarComponent from '@/components/calendar';
import Dashboard from "@/app/dashboard/page";
import Analytics from "../analytics";
import Posts from "../posts";
import Templates from "../templates";
import SocialAccounts from "../social-accounts";

interface NavItem {
  title: string;
  url?: string;
  component?: React.ComponentType;
  icon?: React.ComponentType<{ size?: number }>;
}

interface SidebarMenuProps extends React.ComponentProps<typeof Sidebar> {
  items: NavItem[];
  activeItem: string | null;
  onSelectComponent: (title: string, callback: () => React.ComponentType<any> | null) => void;
}

export const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '@/assets/logo.png',
  },
  navMain: [
    {
      title: 'Dashboard',
      component: Dashboard,
      icon: LayoutDashboardIcon,
    },
    {
      title: 'Calendar',
      // If you want to render a component inline instead of navigating,
      // you can pass the component property (e.g., component: CalendarComponent).
      // For now, I'll leave the URL so it navigates to the calendar page.
      component: CalendarComponent,
      icon: Calendar,
    },
    {
      title: 'Analytics',
      component: Analytics,
      icon: BarChartIcon,
    },
    {
      title: 'Posts',
      component: Posts,
      icon: HeartHandshake,
    },
    {
      title: 'Templates',
      component: Templates,
      icon: SwatchBook,
    },
    {
      title: 'Assets',
      component: SocialAccounts,
      icon: DatabaseIcon,
    },
    {
      title: 'Social Accounts',
      component: SocialAccounts,
      icon: ClipboardListIcon,
    },
    {
      title: 'Word Assistant',
      component: SocialAccounts,
      icon: FileIcon,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '/settings',
      icon: SettingsIcon,
    },
    {
      title: 'Get Help',
      url: '/help',
      icon: HelpCircleIcon,
    },
    {
      title: 'Search',
      url: '/search',
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: 'Assets',
      url: '/assets',
      icon: DatabaseIcon,
    },
    {
      name: 'Social Accounts',
      url: '/reports',
      icon: ClipboardListIcon,
    },
    {
      name: 'Word Assistant',
      url: '/word-assistant',
      icon: FileIcon,
    },
  ],
};

export function AppSidebar({
  items,
  activeItem,
  onSelectComponent,
  ...props
}: SidebarMenuProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Image src={Logo} alt="cloudyunicorn" height={20} />
                <span className="text-base font-semibold">Cloudy Unicorn</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Pass onSelectComponent so NavMain can trigger inline component changes if needed */}
        <NavMain items={data.navMain} activeItem={activeItem} onSelectComponent={onSelectComponent} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
