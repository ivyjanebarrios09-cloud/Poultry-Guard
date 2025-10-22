'use server';

/**
 * @fileOverview Provides a textual description of an uploaded photo using AI.
 *
 * - describeUploadedPhoto - A function that accepts a photo data URI and returns a textual description.
 * - DescribeUploadedPhotoInput - The input type for the describeUploadedPhoto function, which is a photo data URI.
 * - DescribeUploadedPhotoOutput - The return type for the describeUploadedPhoto function, which is a text description.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DescribeUploadedPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo, as a data URI or a public URL. Expected format: 'data:<mimetype>;base64,<encoded_data>' or 'http(s)://...'"
    ),
});
export type DescribeUploadedPhotoInput = z.infer<typeof DescribeUploadedPhotoInputSchema>;

const DescribeUploadedPhotoOutputSchema = z.object({
  description: z.string().describe('A textual description of the photo.'),
});
export type DescribeUploadedPhotoOutput = z.infer<typeof DescribeUploadedPhotoOutputSchema>;

export async function describeUploadedPhoto(
  input: DescribeUploadedPhotoInput
): Promise<DescribeUploadedPhotoOutput> {
  return describeUploadedPhotoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'describeUploadedPhotoPrompt',
  input: {schema: DescribeUploadedPhotoInputSchema},
  output: {schema: DescribeUploadedPhotoOutputSchema},
  prompt: `You are an AI that describes the content of an image, specifically for a poultry farm monitoring system.

  Describe the following photo, focusing on details relevant to a farm manager, such as the number of flies, the state of the equipment, and any anomalies:

  {{media url=photoDataUri}}`,
});

const describeUploadedPhotoFlow = ai.defineFlow(
  {
    name: 'describeUploadedPhotoFlow',
    inputSchema: DescribeUploadedPhotoInputSchema,
    outputSchema: DescribeUploadedPhotoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
