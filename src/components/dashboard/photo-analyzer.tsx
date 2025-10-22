'use client';

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { describePhotoAction } from '@/actions/photo-actions';
import { LoaderCircle, Bot, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { createSupabaseClient } from '@/lib/supabase/client';
import { Skeleton } from '../ui/skeleton';

const initialState = {
  description: null,
  error: null,
  timestamp: Date.now(),
};

function SubmitButton({ isPhotoAvailable }: { isPhotoAvailable: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || !isPhotoAvailable}>
      {pending ? <LoaderCircle className="animate-spin" /> : '✨'}
      {pending ? 'Analyzing...' : 'Describe Photo'}
    </Button>
  );
}

async function toDataURL(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}


export function PhotoAnalyzer() {
  const [state, formAction] = useActionState(describePhotoAction, initialState);
  const [preview, setPreview] = useState<string | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const supabase = createSupabaseClient();

  const fetchLatestPhoto = async () => {
    setIsLoading(true);
    setFetchError(null);
    setPreview(null);
    setPhotoDataUri(null);
    try {
      const { data, error } = await supabase.storage
        .from('poultryguardPhoto')
        .list('photos', {
          limit: 1,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) {
        throw error;
      }
      
      if (data && data.length > 0 && data[0].name !== '.emptyFolderPlaceholder') {
        const latestFile = data[0];
        const { data: publicUrlData } = supabase.storage
          .from('poultryguardPhoto')
          .getPublicUrl(`photos/${latestFile.name}`);
        
        if (publicUrlData) {
          const imageUrl = publicUrlData.publicUrl;
          const uniqueUrl = `${imageUrl}?t=${new Date().getTime()}`;
          setPreview(uniqueUrl);

          // Convert to data URI for the AI
          const dataUrl = await toDataURL(uniqueUrl);
          setPhotoDataUri(dataUrl);
        } else {
           throw new Error('Could not get public URL for the latest photo.');
        }

      } else {
        setFetchError('No photos found in the bucket.');
      }
    } catch (error) {
      console.error('Error fetching latest photo:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while fetching the photo.';
      setFetchError(`Failed to load image: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestPhoto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    fetchLatestPhoto();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <form ref={formRef} action={formAction}>
          <input type="hidden" name="photoDataUri" value={photoDataUri || ''} />
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Latest Monitoring Photo</CardTitle>
              <CardDescription>
                The most recent photo from your monitoring device.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full relative overflow-hidden rounded-lg border">
                {isLoading ? (
                  <Skeleton className="w-full h-full" />
                ) : fetchError ? (
                  <div className="w-full h-full flex items-center justify-center bg-muted p-4 text-center">
                    <p className="text-destructive">{fetchError}</p>
                  </div>
                ) : preview ? (
                  <Image
                    src={preview}
                    alt="Latest monitoring photo"
                    fill
                    className="object-cover"
                    data-ai-hint="monitoring device"
                    unoptimized // Important for bypassing Next.js image cache with URL params
                  />
                ) : (
                   <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                    <p>No photo to display.</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleRefresh} disabled={isLoading}>
                    <RefreshCw className={isLoading ? "animate-spin" : ""} />
                    Refresh
                </Button>
                <SubmitButton isPhotoAvailable={!!photoDataUri} />
            </CardFooter>
          </Card>
        </form>

        {(useFormStatus().pending || state.description || state.error) && (
          <Card className="mt-8">
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>AI Analysis</CardTitle>
                <CardDescription>
                  Here&apos;s what the AI sees in your photo.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {useFormStatus().pending && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <LoaderCircle className="animate-spin h-4 w-4" />
                  <span>Analyzing photo...</span>
                </div>
              )}
              {state.description && <p className="prose prose-sm max-w-none text-foreground">{state.description}</p>}
              {state.error && <p className="text-destructive">{state.error}</p>}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
