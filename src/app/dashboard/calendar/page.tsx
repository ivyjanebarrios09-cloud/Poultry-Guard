import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

export default function CalendarPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          View important dates and schedule events.
        </p>
      </div>
      <Card className="shadow-lg max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Event Calendar</CardTitle>
          <CardDescription>
            Keep track of your farm schedule.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            className="rounded-md border"
          />
        </CardContent>
      </Card>
    </div>
  );
}
