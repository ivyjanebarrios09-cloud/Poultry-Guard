'use server';

/**
 * @fileOverview Counts the number of flies in an uploaded photo using AI.
 *
 * - countFliesInPhoto - A function that accepts a photo data URI and returns a fly count and analysis.
 * - CountFliesInPhotoInput - The input type for the countFliesInPhoto function.
 * - CountFliesInPhotoOutput - The return type for the countFliesInPhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CountFliesInPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo from a poultry farm fly trap, as a data URI or a public URL. Expected format: 'data:<mimetype>;base64,<encoded_data>' or 'http(s)://...'"
    ),
});
export type CountFliesInPhotoInput = z.infer<typeof CountFliesInPhotoInputSchema>;

const CountFliesInPhotoOutputSchema = z.object({
  flyCount: z.number().describe('The total number of flies counted in the photo.'),
  analysis: z.string().describe('A brief analysis of the fly count (e.g., "Low", "Moderate", "High", "Critical").'),
});
export type CountFliesInPhotoOutput = z.infer<typeof CountFliesInPhotoOutputSchema>;

export async function countFliesInPhoto(
  input: CountFliesInPhotoInput
): Promise<CountFliesInPhotoOutput> {
  return countFliesInPhotoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'countFliesInPhotoPrompt',
  input: {schema: CountFliesInPhotoInputSchema},
  output: {schema: CountFliesInPhotoOutputSchema},
  prompt: `You are an AI that specializes in analyzing images from poultry farm fly traps. Your task is to accurately count the number of flies visible in the provided photo.

Based on the count, provide a simple, one-word analysis of the infestation level. Use the following categories:
- 0-50 flies: "Low"
- 51-100 flies: "Moderate"
- 101-150 flies: "High"
- 151+ flies: "Critical"

Analyze the following photo:

{{media url=photoDataUri}}`,
});

const countFliesInPhotoFlow = ai.defineFlow(
  {
    name: 'countFliesInPhotoFlow',
    inputSchema: CountFliesInPhotoInputSchema,
    outputSchema: CountFliesInPhotoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
