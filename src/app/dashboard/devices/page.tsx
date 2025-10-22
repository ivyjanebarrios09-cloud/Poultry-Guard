import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { devices } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export default function DevicesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Device Status</h1>
        <p className="text-muted-foreground">
          Monitor the status and location of all your devices.
        </p>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Device List</CardTitle>
          <CardDescription>
            A list of all registered PoultryGuard Pro devices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device ID</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Seen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell className="font-medium">{device.id}</TableCell>
                  <TableCell>{device.location}</TableCell>
                  <TableCell>
                    <Badge
                      variant={device.status === 'Online' ? 'default' : 'destructive'}
                      className={cn(
                        device.status === 'Online'
                          ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
                      )}
                    >
                      {device.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(device.lastSeen), { addSuffix: true })}
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
