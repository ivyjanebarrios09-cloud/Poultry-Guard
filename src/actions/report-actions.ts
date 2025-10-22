'use server';

import { generateFlyCountSummary, type GenerateFlyCountSummaryInput } from '@/ai/flows/generate-fly-count-summary';

type FormState = {
  summary: string | null;
  report: string | null;
  error: string | null;
  timestamp: number;
}

// Dummy data for report generation
const weeklyData = `date,fly_count\n2024-07-15,150\n2024-07-16,155\n2024-07-17,148\n2024-07-18,160\n2024-07-19,162\n2024-07-20,157\n2024-07-21,152`;
const monthlyData = `date,fly_count\n2024-07-01,130\n2024-07-08,135\n2024-07-15,152\n2024-07-22,165`;

export async function generateReportAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const reportType = formData.get('reportType');
  const includeSummary = formData.get('includeSummary') === 'on';

  if (reportType !== 'weekly' && reportType !== 'monthly') {
    return { summary: null, report: null, error: 'Invalid report type.', timestamp: Date.now() };
  }
  
  const input: GenerateFlyCountSummaryInput = {
    reportType,
    includeSummary,
    reportData: reportType === 'weekly' ? weeklyData : monthlyData
  };

  try {
    const result = await generateFlyCountSummary(input);
    return {
      summary: result.summary ?? null,
      report: result.report,
      error: null,
      timestamp: Date.now()
    };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { summary: null, report: null, error: `Failed to generate report: ${errorMessage}`, timestamp: Date.now() };
  }
}
