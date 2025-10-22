
'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { LayoutDashboard, BarChart2, HardDrive, Bell, FileText, Image as ImageIcon, Settings, HelpCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/fly-count', label: 'Fly Count', icon: BarChart2 },
  { href: '/dashboard/devices', label: 'Devices', icon: HardDrive },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
  { href: '/dashboard/photo-analysis', label: 'Photo Analysis', icon: ImageIcon },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Image src="/image/logoo.png" alt="PoultryGuard Logo" width={32} height={32} className="text-primary" />
          <h1 className="text-xl font-headline font-semibold">PoultryGuard</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                    <>
                        <item.icon />
                        <span>{item.label}</span>
                    </>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                 <SidebarMenuButton tooltip="Settings">
                    <Settings />
                    <span>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                 <SidebarMenuButton tooltip="Help">
                    <HelpCircle />
                    <span>Help</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
