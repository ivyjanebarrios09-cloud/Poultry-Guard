import { ReportGenerator } from "@/components/dashboard/report-generator";

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Generate and download weekly or monthly fly count summaries.
        </p>
      </div>
      <ReportGenerator />
    </div>
  );
}
