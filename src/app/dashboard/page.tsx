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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { devices, notifications } from '@/lib/data';
import { useAuth } from '@/context/auth-context';
import { format, formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Download, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useFirestore } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useMemo } from 'react';

type FlyCountLog = {
  id: string;
  flyCount: number;
  analysis: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  } | null;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const firestore = useFirestore();

  const flyCountsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'flyCounts'), orderBy('timestamp', 'desc'));
  }, [firestore]);

  const { data: flyCountLogs, loading: loadingLogs } = useCollection<FlyCountLog>(flyCountsQuery);

  const latestLog = flyCountLogs?.[0];
  const onlineDevices = devices.filter(d => d.status === 'Online').length;
  
  const getUsername = (email: string | null) => {
    if (!email) return 'User';
    return email.split('@')[0];
  };

  const chartData = useMemo(() => {
    if (!flyCountLogs) return [];
    return flyCountLogs
      .map(log => {
        const date = log.timestamp ? new Date(log.timestamp.seconds * 1000) : new Date();
        return {
          date: format(date, 'MMM d'),
          count: log.flyCount,
        };
      })
      .reverse();
  }, [flyCountLogs]);
  
  const getLogTime = (timestamp: FlyCountLog['timestamp']) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return format(date, 'MMM d, yyyy, h:mm:ss a');
  };

  const getRelativeTime = (timestamp: FlyCountLog['timestamp']) => {
    if (!timestamp) return '';
    return formatDistanceToNow(new Date(timestamp.seconds * 1000), { addSuffix: true });
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
            {loadingLogs ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <>
                <div className="text-4xl font-bold">{latestLog?.flyCount ?? 'N/A'}</div>
                <p className="text-xs text-muted-foreground">{latestLog?.analysis ?? 'No analysis yet'}</p>
                <p className="text-xs text-muted-foreground">{latestLog ? getRelativeTime(latestLog.timestamp) : ''}</p>
              </>
            )}
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
             <Link href="/dashboard/reports" className="w-full">
                <div className="flex space-x-1 rounded-md bg-muted p-1">
                    <Button variant="ghost" className="w-full bg-background shadow-sm">Weekly</Button>
                    <Button variant="ghost" className="w-full">Monthly</Button>
                </div>
            </Link>
            <p className="text-center text-xs text-muted-foreground mt-2">Select a period to generate a report.</p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/reports" className="w-full">
              <Button className="w-full"><Download className="mr-2 h-4 w-4" /> Download Report</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="shadow-sm lg:col-span-4">
            <CardHeader>
                <CardTitle>Fly Count Trend</CardTitle>
                <CardDescription>Average daily fly counts from recent analyses.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                    <YAxis domain={['auto', 'auto']} tick={{fontSize: 12}} tickLine={false} axisLine={false} />
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
             {notifications.length === 0 && <p className="text-sm text-center text-muted-foreground">No new notifications.</p>}
          </CardContent>
        </Card>
      </div>

       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detailed Logs</CardTitle>
          <CardDescription>
            A comprehensive record of all fly count readings from Firestore.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Count</TableHead>
                <TableHead>Analysis</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Image</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingLogs && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <div className="flex justify-center items-center gap-2">
                      <LoaderCircle className="animate-spin h-4 w-4" />
                      <span>Loading logs...</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!loadingLogs && flyCountLogs && flyCountLogs.length > 0 ? (
                flyCountLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.flyCount}</TableCell>
                    <TableCell>{log.analysis}</TableCell>
                    <TableCell>{getLogTime(log.timestamp)}</TableCell>
                    <TableCell>
                      <Image src={`https://picsum.photos/seed/${log.id}/40/40`} alt="Fly trap image" width={40} height={40} className="rounded-md" data-ai-hint="fly trap" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                !loadingLogs && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">No logs found in Firestore.</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}

    