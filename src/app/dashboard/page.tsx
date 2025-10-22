'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { devices, flyCountLogs, notifications } from '@/lib/data';
import { useAuth } from '@/context/auth-context';
import { format, formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const flyCountTrendData = [
    { date: 'Sep 28', count: 60 },
    { date: 'Sep 29', count: 62 },
    { date: 'Sep 30', count: 65 },
    { date: 'Oct 1', count: 68 },
    { date: 'Oct 2', count: 70 },
    { date: 'Oct 3', count: 72 },
    { date: 'Oct 4', count: 75 },
    { date: 'Oct 5', count: 78 },
    { date: 'Oct 6', count: 80 },
    { date: 'Oct 7', count: 82 },
    { date: 'Oct 8', count: 85 },
    { date: 'Oct 9', count: 88 },
    { date: 'Oct 10', count: 90 },
    { date: 'Oct 11', count: 92 },
    { date: 'Oct 12', count: 95 },
    { date: 'Oct 13', count: 98 },
    { date: 'Oct 14', count: 100 },
    { date: 'Oct 15', count: 102 },
    { date: 'Oct 16', count: 105 },
    { date: 'Oct 17', count: 108 },
    { date: 'Oct 18', count: 110 },
    { date: 'Oct 19', count: 115 },
    { date: 'Oct 20', count: 120 },
    { date: 'Oct 21', count: 125 },
    { date: 'Oct 22', count: 130 },
];

const detailedLogs = [
  { id: '1', count: 148, location: 'Latest Photo Analysis', time: 'Oct 22, 2025, 6:32:17 PM', image: 'https://picsum.photos/seed/1/40/40', hint: 'fly trap' },
  { id: '2', count: 79, location: 'Latest Photo Analysis', time: 'Oct 22, 2025, 6:28:49 PM', image: 'https://picsum.photos/seed/2/40/40', hint: 'fly trap' },
  { id: '3', count: 110, location: 'Latest Photo Analysis', time: 'Oct 21, 2025, 3:46:28 AM', image: 'https://picsum.photos/seed/3/40/40', hint: 'fly trap' },
  { id: '4', count: 107, location: 'Latest Photo Analysis', time: 'Oct 21, 2025, 3:37:14 AM', image: 'https://picsum.photos/seed/4/40/40', hint: 'fly trap' },
]

export default function DashboardPage() {
  const { user } = useAuth();
  const latestFlyCount = flyCountLogs[0]?.count || 0;
  const onlineDevices = devices.filter(d => d.status === 'Online').length;
  
  const getUsername = (email: string | null) => {
    if (!email) return 'User';
    return email.split('@')[0];
  };

  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes('critical')) return 'bg-red-500';
    if (status.toLowerCase().includes('warning')) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Welcome Back, {getUsername(user?.email || null)}!</h1>
        <p className="text-muted-foreground">
          Here&apos;s a live overview of your poultry monitoring system.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Fly Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{latestFlyCount}</div>
            <p className="text-xs text-muted-foreground">Latest Photo Analysis</p>
            <p className="text-xs text-muted-foreground">about 8 hours ago</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Device Status</CardTitle>
            <CardDescription className="text-2xl font-bold">{onlineDevices}/{devices.length} Online</CardDescription>
            <p className="text-xs text-muted-foreground">Live status from all monitoring devices.</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 text-sm">
              {devices.slice(0,3).map(device => (
                 <div key={device.id} className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", device.status === 'Online' ? 'bg-green-500' : 'bg-red-500')} />
                    <span>{device.id.replace('PGP-00', 'Camera ')} ({device.location.split(',')[0]})</span>
                    <span className="ml-auto text-muted-foreground">{device.status === 'Offline' ? `Offline for about ${formatDistanceToNow(new Date(device.lastSeen))}` : device.status}</span>
                 </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
            <CardDescription>Generate and download fly count summaries.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-1 rounded-md bg-muted p-1">
                <Button variant="ghost" className="w-full bg-background shadow-sm">Weekly</Button>
                <Button variant="ghost" className="w-full">Monthly</Button>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-2">Select a period to generate a report.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full"><Download className="mr-2 h-4 w-4" /> Download Report</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="shadow-sm lg:col-span-4">
            <CardHeader>
                <CardTitle>Fly Count Trend</CardTitle>
                <CardDescription>Average daily fly counts over the last 30 days.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={flyCountTrendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                    <YAxis domain={[60, 130]} tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                      }}
                    />
                    <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card className="shadow-sm lg:col-span-3">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Recent alerts and system status updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-4">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1" />
                    <div className="flex-1">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}</p>
                    </div>
                    <Badge variant="destructive" className={cn(
                      notification.title.includes('Alert') && 'bg-yellow-400/80 text-yellow-900 border-yellow-500/50 hover:bg-yellow-400',
                      notification.title.includes('Offline') && 'bg-red-400/80 text-red-900 border-red-500/50 hover:bg-red-400'
                    )}>
                      {notification.title.includes('Alert') ? 'Warning' : 'Critical'}
                    </Badge>
                </div>
            ))}
          </CardContent>
        </Card>
      </div>

       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detailed Logs</CardTitle>
          <CardDescription>
            A comprehensive record of all fly count readings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Count</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Image</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detailedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.count}</TableCell>
                  <TableCell>{log.location}</TableCell>
                  <TableCell>{log.time}</TableCell>
                  <TableCell>
                    <Image src={log.image} alt="Fly trap image" width={40} height={40} className="rounded-md" data-ai-hint={log.hint} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
