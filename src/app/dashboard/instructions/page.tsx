import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChevronLeft, LayoutDashboard, User, CalendarDays, History, BookOpen } from 'lucide-react';
import Link from 'next/link';

const guideItems = [
  {
    icon: <LayoutDashboard className="h-8 w-8 text-primary" />,
    title: 'Dashboard',
    description: 'The main screen of the application. It provides a quick overview of all the important metrics and gives you access to all other sections of the app.',
    href: '/dashboard'
  },
  {
    icon: <User className="h-8 w-8 text-primary" />,
    title: 'Profile',
    description: 'Manage your account settings, including your name, email, and password.',
    href: '#'
  },
  {
    icon: <CalendarDays className="h-8 w-8 text-primary" />,
    title: 'Calendar Management',
    description: 'Schedule activities, set reminders for important events, and view your upcoming appointments.',
    href: '/dashboard/calendar'
  },
  {
    icon: <History className="h-8 w-8 text-primary" />,
    title: 'Pest Infestation Historical Data',
    description: 'View historical data about fly infestation trends. Analyze charts and download reports for further analysis.',
    href: '/dashboard/history'
  },
  {
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    title: 'About Us',
    description: 'Learn more about the team behind PoultryGuard and our mission to improve pest management in poultry farms.',
    href: '/dashboard/about'
  },
];

export default function InstructionsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className='flex items-center gap-4'>
        <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold font-headline tracking-tight">App Navigation Guide</h1>
      </div>
      <p className="text-muted-foreground">
        Welcome to the PoultryGuard App Navigation Guide. Here's a quick overview of how to use the app's features.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guideItems.map((item) => (
          <Link href={item.href} key={item.title}>
            <Card className="shadow-sm hover:shadow-lg transition-shadow h-full">
              <CardHeader className="flex flex-row items-center gap-4">
                {item.icon}
                <CardTitle className='text-xl'>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
         <Card className="shadow-sm lg:col-span-3 bg-secondary/50">
            <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>
                    We are constantly working on adding new features. Keep an eye on this space for more tools to help you manage your farm.
                </CardDescription>
            </CardHeader>
        </Card>
      </div>
    </div>
  );
}