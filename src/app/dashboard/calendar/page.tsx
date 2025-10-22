'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { useState } from 'react';

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date('2025-10-23T00:00:00'));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          Schedule and view your farm's events and appointments.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <Card className="shadow-lg">
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="p-0"
                classNames={{
                  root: 'w-full',
                  month: 'w-full',
                  table: 'w-full',
                  head_row: 'flex justify-around',
                  row: 'flex w-full mt-2 justify-around',
                  day_selected:
                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                  day_today: 'bg-accent text-accent-foreground',
                }}
              />
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">No recent activities.</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Schedule an Event</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="event-date">Select Date</Label>
                <Input id="event-date" value={date ? format(date, 'MM/dd/yyyy') : ''} readOnly />
                <p className="text-sm text-muted-foreground">Select a date from the calendar.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-time">Time</Label>
                <Input id="event-time" type="time" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-name">Event Name</Label>
                <Input id="event-name" placeholder="e.g., Vet Appointment" />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90">Add Event</Button>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Upcoming Appointments</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardDescription>Next Appointment</CardDescription>
                  <CardTitle>No upcoming appointments</CardTitle>
                </CardHeader>
              </Card>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardDescription>Total Appointments</CardDescription>
                  <CardTitle className="text-4xl">0</CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
