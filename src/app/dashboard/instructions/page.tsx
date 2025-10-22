import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function InstructionsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Instructions</h1>
        <p className="text-muted-foreground">
          How to use the PoultryGuard Pro system.
        </p>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Follow these steps to get your system up and running.
          </CardDescription>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <h3>Step 1: Device Setup</h3>
          <p>Place your PoultryGuard Pro devices in key locations around your farm. Ensure they have a clear view and are protected from the elements.</p>
          
          <h3>Step 2: Connect to Network</h3>
          <p>Power on the devices and connect them to your farm's Wi-Fi network using the mobile companion app.</p>

          <h3>Step 3: Monitor Dashboard</h3>
          <p>Once connected, data will start appearing on your dashboard. Use the various pages to monitor fly counts, check device status, and analyze photos.</p>

          <h3>Step 4: Generate Reports</h3>
          <p>Use the 'Reports' page to generate weekly or monthly summaries of your farm's data for record-keeping and analysis.</p>
        </CardContent>
      </Card>
    </div>
  );
}
