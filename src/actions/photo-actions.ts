'use server';

import { describeUploadedPhoto } from '@/ai/flows/describe-uploaded-photo';

type FormState = {
  description: string | null;
  error: string | null;
  timestamp: number;
}

export async function describePhotoAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const photoDataUri = formData.get('photoDataUri');

  if (typeof photoDataUri !== 'string' || !photoDataUri.startsWith('data:image')) {
    return { description: null, error: 'Invalid image data. Please upload a valid image file.', timestamp: Date.now() };
  }

  try {
    const result = await describeUploadedPhoto({ photoDataUri });
    return {
      description: result.description,
      error: null,
      timestamp: Date.now()
    };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { description: null, error: `Failed to analyze photo: ${errorMessage}`, timestamp: Date.now() };
  }
}
