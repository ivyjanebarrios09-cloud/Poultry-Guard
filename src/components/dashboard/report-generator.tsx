'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { generateReportAction } from '@/actions/report-actions';
import { Download, LoaderCircle, FileText, Bot } from 'lucide-react';
import { useActionState, useState } from 'react';

const initialState = {
  summary: null,
  report: null,
  error: null,
  timestamp: Date.now(),
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-accent hover:bg-accent/90">
      {pending ? <LoaderCircle className="animate-spin" /> : <FileText />}
      {pending ? 'Generating...' : 'Generate Report'}
    </Button>
  );
}

export function ReportGenerator() {
  const [state, formAction] = useActionState(generateReportAction, initialState);
  const [reportType, setReportType] = useState('weekly');

  const handleDownload = () => {
    if (!state.report) return;
    const blob = new Blob([state.report], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    link.href = URL.createObjectURL(blob);
    link.rel = 'noopener';
    link.download = `${reportType}_fly_count_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
            <CardDescription>
              Select parameters to generate a fly count report.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select name="reportType" defaultValue="weekly" onValueChange={setReportType} required>
                <SelectTrigger id="reportType">
                  <SelectValue placeholder="Select a report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 self-end mb-2">
              <Checkbox id="includeSummary" name="includeSummary" defaultChecked />
              <Label htmlFor="includeSummary">
                Include AI-powered summary
              </Label>
            </div>
          </CardContent>
          <CardFooter className="justify-end border-t px-6 py-4">
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state.summary && (
        <Card>
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>AI-Generated Summary</CardTitle>
              <CardDescription>
                A natural language summary of the report data.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-foreground">
            <p>{state.summary}</p>
          </CardContent>
        </Card>
      )}

      {state.report && (
         <Card>
            <CardHeader>
              <CardTitle>Report Ready</CardTitle>
              <CardDescription>
                Your report has been generated successfully.
              </CardDescription>
            </CardHeader>
            <CardFooter>
                <Button onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                </Button>
            </CardFooter>
        </Card>
      )}

      {state.error && (
        <Card className="bg-destructive/10 border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
              <CardDescription className="text-destructive/80">{state.error}</CardDescription>
            </CardHeader>
        </Card>
      )}
    </div>
  );
}
