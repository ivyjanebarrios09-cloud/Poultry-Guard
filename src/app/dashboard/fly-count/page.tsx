'use client';

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
import { format } from 'date-fns';
import { useCollection } from '@/firebase';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

type FlyCountLog = {
  id: string;
  timestamp: Timestamp;
  flyCount: number;
  analysis: string;
};

export default function FlyCountPage() {
  const firestore = useFirestore();
  const flyCountsQuery = firestore ? query(collection(firestore, 'flyCounts'), orderBy('timestamp', 'desc')) : null;
  const { data: flyCountLogs, loading, error } = useCollection<FlyCountLog>(flyCountsQuery);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Fly Count Logs</h1>
        <p className="text-muted-foreground">
          Historical data of fly counts from all devices, stored in Firestore.
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
          {loading && (
             <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
             </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load fly count logs: {error.message}
              </AlertDescription>
            </Alert>
          )}
          {!loading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Analysis</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flyCountLogs && flyCountLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      {log.timestamp ? format(log.timestamp.toDate(), 'PPP p') : 'No date'}
                    </TableCell>
                    <TableCell>{log.analysis}</TableCell>
                    <TableCell className="text-right">{log.flyCount}</TableCell>
                  </TableRow>
                ))}
                 {(!flyCountLogs || flyCountLogs.length === 0) && (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                            No fly count logs found.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
