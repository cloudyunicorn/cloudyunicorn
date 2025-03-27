import React from 'react';
import { MailIcon, PlusCircleIcon, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';

interface NavItem {
  title: string;
  url?: string;
  component?: React.ComponentType<any>;
  icon?: LucideIcon;
}

interface NavMainProps {
  items: NavItem[];
  activeItem: string | null;
  onSelectComponent: (
    title: string,
    callback: () => React.ComponentType<any> | null
  ) => void;
}

export function NavMain({
  items,
  activeItem,
  onSelectComponent,
}: NavMainProps) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
            >
              <PlusCircleIcon size={20} />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <MailIcon size={20} />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.url ? (
                <SidebarMenuButton tooltip={item.title} asChild>
                  <Link href={item.url}>
                    {item.icon && <item.icon size={20} />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => {
                    if (item.component) {
                      // Wrap the component in a callback so that state remains a function
                      onSelectComponent(item.title, () => item.component!);
                    }
                  }}
                  className={`${
                    activeItem === item.title
                      ? 'bg-primary/50 text-white'
                      : 'text-gray-100'
                  } hover:bg-primary/40 hover:text-white duration-200 ease-in-out`}
                >
                  {item.icon && <item.icon size={20} />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
