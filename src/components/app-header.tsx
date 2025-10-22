'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, User as UserIcon, Menu, Bug } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from './ui/sheet';

const menuItems = [
  { href: '/dashboard', label: 'Home' },
  { href: '/dashboard/history', label: 'History' },
  { href: '/dashboard/calendar', label: 'Calendar' },
  { href: '/dashboard/photo', label: 'Photo' },
  { href: '/dashboard/instructions', label: 'Instructions' },
  { href: '/dashboard/about', label: 'About' },
];

export function AppHeader() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  
  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    return email[0].toUpperCase();
  }

  const navLinks = (
    <>
      {menuItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            "transition-colors hover:text-foreground",
            pathname === item.href ? "text-foreground font-semibold" : "text-muted-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      {/* Left side: Logo */}
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Image src="/image/logoo.png" alt="PoultryGuard Logo" width={32} height={32} className="text-primary" />
          <span className="hidden sm:inline-block">PoultryGuard</span>
        </Link>
      </div>
      
      {/* Center: Navigation Links (Desktop) */}
      <nav className="hidden md:flex flex-row items-center justify-center gap-5 text-sm lg:gap-6 flex-1">
        {navLinks}
      </nav>

      {/* Right side: User Menu & Mobile Menu Trigger */}
      <div className="flex items-center gap-4">
         <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle className="sr-only">Main Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="grid gap-6 text-lg font-medium mt-4">
                      <Link
                      href="/dashboard"
                      className="flex items-center gap-2 text-lg font-semibold"
                      >
                      <Image src="/image/logoo.png" alt="PoultryGuard Logo" width={32} height={32} className="text-primary" />
                      <span className="sr-only">PoultryGuard</span>
                      </Link>
                      {menuItems.map((item) => (
                          <Link
                              key={item.label}
                              href={item.href}
                              className={cn(
                                  "transition-colors hover:text-foreground",
                                  pathname === item.href ? "text-foreground" : "text-muted-foreground"
                              )}
                              >
                              {item.label}
                          </Link>
                      ))}
                  </nav>
                </SheetContent>
            </Sheet>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full"
            >
              <Avatar>
                <AvatarImage src={`https://avatar.vercel.sh/${user?.email}.png`} alt={user?.email ?? 'User'} />
                <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-body">
              <p>Signed in as</p>
              <p className="font-semibold">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
