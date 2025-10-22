import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Bell, AlertTriangle, Info } from 'lucide-react';
import { notifications } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function NotificationsPage() {
  const getIcon = (title: string) => {
    if (title.toLowerCase().includes('alert')) {
      return <AlertTriangle className="h-6 w-6 text-destructive" />;
    }
    if (title.toLowerCase().includes('offline')) {
      return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    }
    return <Info className="h-6 w-6 text-primary" />;
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">
          Review important alerts and system messages.
        </p>
      </div>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={cn("shadow-sm transition-all", !notification.read && "bg-secondary border-primary/50")}>
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <div className="mt-1">
                    {getIcon(notification.title)}
                </div>
                <div className="flex-1">
                    <CardTitle className="flex items-center justify-between">
                        <span>{notification.title}</span>
                        {!notification.read && <Badge className="bg-accent text-accent-foreground">New</Badge>}
                    </CardTitle>
                    <CardDescription>{notification.description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                </p>
            </CardContent>
          </Card>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-foreground">No notifications</h3>
            <p className="mt-1 text-sm text-muted-foreground">Your inbox is clear.</p>
          </div>
        )}
      </div>
    </div>
  );
}
