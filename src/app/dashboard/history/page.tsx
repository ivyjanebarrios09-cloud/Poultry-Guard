'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { format } from 'date-fns';
import { useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useMemo } from 'react';
import { LoaderCircle } from 'lucide-react';

type FlyCountLog = {
  id: string;
  flyCount: number;
  analysis: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  } | null;
};

export default function HistoryPage() {
  const firestore = useFirestore();
  const flyCountsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'flyCounts'), orderBy('timestamp', 'asc'));
  }, [firestore]);

  const { data: flyCountLogs, loading } = useCollection<FlyCountLog>(flyCountsQuery);

  const chartData = useMemo(() => {
    if (!flyCountLogs) return [];
    return flyCountLogs.map(log => {
      const date = log.timestamp ? new Date(log.timestamp.seconds * 1000) : new Date();
      return {
        date: format(date, 'MMM d'),
        count: log.flyCount,
      };
    });
  }, [flyCountLogs]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Fly Infestation Trends</h1>
        <p className="text-muted-foreground">
          Historical data of fly counts from your Firestore database.
        </p>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Fly Count Trend</CardTitle>
          <CardDescription>
            Historical data of fly counts from all devices.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] w-full">
          {loading ? (
             <div className="flex h-full w-full items-center justify-center gap-2 text-muted-foreground">
                <LoaderCircle className="h-6 w-6 animate-spin" />
                <span>Loading chart data...</span>
            </div>
          ) : !chartData || chartData.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <p>No data available to display the chart. Analyze a photo to get started.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  dataKey="count"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    