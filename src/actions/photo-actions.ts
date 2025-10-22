'use server';

import { countFliesInPhoto } from '@/ai/flows/count-flies-in-photo';

type FormState = {
  flyCount: number | null;
  analysis: string | null;
  error: string | null;
  timestamp: number;
  imageUrl: string | null;
}

export async function analyzePhotoAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const photoDataUri = formData.get('photoDataUri');
  const imageUrl = formData.get('imageUrl') as string | null;

  if (typeof photoDataUri !== 'string' || !photoDataUri.startsWith('data:image') && !photoDataUri.startsWith('http')) {
    return { flyCount: null, analysis: null, error: 'Invalid image data. Please upload a valid image file.', timestamp: Date.now(), imageUrl: null };
  }

  try {
    const result = await countFliesInPhoto({ photoDataUri });
    return {
      flyCount: result.flyCount,
      analysis: result.analysis,
      error: null,
      timestamp: Date.now(),
      imageUrl: imageUrl
    };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { flyCount: null, analysis: null, error: `Failed to analyze photo: ${errorMessage}`, timestamp: Date.now(), imageUrl: null };
  }
}
