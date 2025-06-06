'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bot, Menu, Store } from 'lucide-react';

import { NavAgents } from '@/components/sidebar/nav-agents';
import { NavUserWithTeams } from '@/components/sidebar/nav-user-with-teams';
import CTA from '@/components/sidebar/cta';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { state, setOpen, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar: string;
  }>({
    name: 'Loading...',
    email: 'loading@example.com',
    avatar: '',
  });

  const pathname = usePathname();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        setUser({
          name:
            data.user.user_metadata?.name ||
            data.user.email?.split('@')[0] ||
            'User',
          email: data.user.email || '',
          avatar: data.user.user_metadata?.avatar_url || '',
        });
      }
    };

    fetchUserData();
  }, []);

  // Handle keyboard shortcuts (CMD+B) for consistency
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'b') {
        event.preventDefault();
        // We'll handle this in the parent page component
        // to ensure proper coordination between panels
        setOpen(!state.startsWith('expanded'));

        // Broadcast a custom event to notify other components
        window.dispatchEvent(
          new CustomEvent('sidebar-left-toggled', {
            detail: { expanded: !state.startsWith('expanded') },
          }),
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state, setOpen]);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-0 !bg-base-200/95 !text-base-content backdrop-blur-xl 
                 shadow-2xl shadow-base-content/10 
                 border-r border-base-300/50
                 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']
                 [&_[data-sidebar=sidebar]]:!bg-base-200/95 [&_[data-sidebar=sidebar]]:!text-base-content"
      {...props}
    >
      <SidebarHeader className="px-3 py-4 border-b border-base-300/30">
        <div className="flex h-[40px] items-center px-2 relative">
          {state !== 'collapsed' && (
            <div className="transition-all duration-200 ease-in-out whitespace-nowrap">
              <span className="font-bold text-lg text-base-content bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Yari</span>
            </div>
          )}
          <div className="ml-auto flex items-center gap-2">
            {state !== 'collapsed' && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarTrigger className="h-8 w-8" />
                  </TooltipTrigger>
                  <TooltipContent>Toggle sidebar (CMD+B)</TooltipContent>
                </Tooltip>
              </>
            )}
            {isMobile && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setOpenMobile(true)}
                    className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-base-300"
                  >
                    <Menu className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Open menu</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </SidebarHeader>
      {state === 'collapsed' && (
        <div 
          className="absolute inset-0 z-10 cursor-pointer" 
          onClick={() => setOpen(true)}
          aria-label="Expand sidebar"
        />
      )}
      <SidebarContent className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      <SidebarGroup>
        <Link href="/agents">
          <SidebarMenuButton className={cn(
            "group relative overflow-hidden rounded-xl mx-2 mb-2 transition-all duration-300",
            "hover:bg-base-300 hover:shadow-lg hover:shadow-base-content/10",
            {
              'bg-base-300 shadow-lg shadow-base-content/5 font-medium border border-base-content/20': pathname === '/agents',
            }
          )}>
            <div className="absolute inset-0 bg-primary/10
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Bot className="h-4 w-4 mr-3 relative z-10" />
            <span className="flex items-center justify-between w-full relative z-10">
              Agent Playground
              <Badge variant="new">
                New
              </Badge>
            </span>
          </SidebarMenuButton>
        </Link>
        
        <Link href="/marketplace">
          <SidebarMenuButton className={cn(
            "group relative overflow-hidden rounded-xl mx-2 mb-2 transition-all duration-300",
            "hover:bg-base-300 hover:shadow-lg hover:shadow-base-content/10",
            {
              'bg-base-300 shadow-lg shadow-base-content/5 font-medium border border-base-content/20': pathname === '/marketplace',
            }
          )}>
            <div className="absolute inset-0 bg-primary/10
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Store className="h-4 w-4 mr-3 relative z-10" />
            <span className="flex items-center justify-between w-full relative z-10">
              Marketplace
              <Badge variant="new">
                New
              </Badge>
            </span>
          </SidebarMenuButton>
        </Link>
      </SidebarGroup>
        <NavAgents />
      </SidebarContent>
      {state !== 'collapsed' && (
        <div className="px-3 py-2 border-t border-base-300/30 bg-base-200/30">
          <CTA />
        </div>
      )}
      <SidebarFooter className="border-t border-base-300/30 bg-base-200/50 backdrop-blur-sm">
        {state === 'collapsed' && (
          <div className="mt-2 flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarTrigger className="h-8 w-8" />
              </TooltipTrigger>
              <TooltipContent>Expand sidebar (CMD+B)</TooltipContent>
            </Tooltip>
          </div>
        )}
        <NavUserWithTeams user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
