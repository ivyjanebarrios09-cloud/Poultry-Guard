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
import { flyCountLogs } from '@/lib/data';
import { format } from 'date-fns';

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">History</h1>
        <p className="text-muted-foreground">
          Historical data of fly counts from all devices.
        </p>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Log History</CardTitle>
          <CardDescription>
            Review past fly count measurements and their analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Count</TableHead>
                <TableHead>Analysis</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flyCountLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">
                    {format(new Date(log.date), 'PPP p')}
                  </TableCell>
                  <TableCell className="text-right">{log.count}</TableCell>
                  <TableCell>{log.analysis}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
