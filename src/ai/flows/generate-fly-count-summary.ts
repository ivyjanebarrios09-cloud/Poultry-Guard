'use server';

/**
 * @fileOverview Generates a fly count summary report with optional natural language insights.
 *
 * - generateFlyCountSummary - A function to generate the fly count summary.
 * - GenerateFlyCountSummaryInput - The input type for the generateFlyCountSummary function.
 * - GenerateFlyCountSummaryOutput - The return type for the generateFlyCountSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFlyCountSummaryInputSchema = z.object({
  reportData: z.string().describe('The fly count report data in CSV format.'),
  reportType: z.enum(['weekly', 'monthly']).describe('The type of report (weekly or monthly).'),
  includeSummary: z
    .boolean()
    .optional()
    .default(true) // Default to true if not specified
    .describe('Whether to include a natural language summary in the report.'),
});
export type GenerateFlyCountSummaryInput = z.infer<typeof GenerateFlyCountSummaryInputSchema>;

const GenerateFlyCountSummaryOutputSchema = z.object({
  report: z.string().describe('The fly count report data in CSV format.'),
  summary: z.string().optional().describe('A natural language summary of the fly count data.'),
});
export type GenerateFlyCountSummaryOutput = z.infer<typeof GenerateFlyCountSummaryOutputSchema>;

export async function generateFlyCountSummary(input: GenerateFlyCountSummaryInput): Promise<GenerateFlyCountSummaryOutput> {
  return generateFlyCountSummaryFlow(input);
}

const generateFlyCountSummaryPrompt = ai.definePrompt({
  name: 'generateFlyCountSummaryPrompt',
  input: {schema: GenerateFlyCountSummaryInputSchema},
  output: {schema: GenerateFlyCountSummaryOutputSchema},
  prompt: `You are an expert data analyst specializing in poultry farm fly count data.

You will receive fly count data in CSV format, the report type (weekly or monthly), and whether to include a summary.

Based on the data, generate a natural language summary of the fly count trends and potential issues, if includeSummary is true.

CSV Data: {{{reportData}}}
Report Type: {{{reportType}}}
Include Summary: {{{includeSummary}}}

Summary (if includeSummary is true):
`,
});

const generateFlyCountSummaryFlow = ai.defineFlow(
  {
    name: 'generateFlyCountSummaryFlow',
    inputSchema: GenerateFlyCountSummaryInputSchema,
    outputSchema: GenerateFlyCountSummaryOutputSchema,
  },
  async input => {
    let summary = '';
    if (input.includeSummary) {
      const {text} = await generateFlyCountSummaryPrompt(input);
      summary = text;
    }

    return {
      report: input.reportData,
      summary: summary,
    };
  }
);

