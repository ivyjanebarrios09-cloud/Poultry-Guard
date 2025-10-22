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
import { analyzePhotoAction } from '@/actions/photo-actions';
import { LoaderCircle, Bot, RefreshCw, Bug } from 'lucide-react';
import Image from 'next/image';
import { createSupabaseClient } from '@/lib/supabase/client';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { useFirestore } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  flyCount: null,
  analysis: null,
  error: null,
  timestamp: Date.now(),
};

function SubmitButton({ isPhotoAvailable }: { isPhotoAvailable: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || !isPhotoAvailable}>
      {pending ? <LoaderCircle className="animate-spin" /> : <Bug />}
      {pending ? 'Counting Flies...' : 'Count Flies'}
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

const saveToFirestore = (db: Firestore, data: { flyCount: number; analysis: string; }) => {
  if (!db) return;
  const newDocRef = doc(collection(db, 'flyCounts'));
  const log = {
    ...data,
    id: newDocRef.id,
    timestamp: serverTimestamp(),
  };
  setDoc(newDocRef, log);
};


export function PhotoAnalyzer() {
  const [state, formAction] = useActionState(analyzePhotoAction, initialState);
  const [preview, setPreview] = useState<string | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const supabase = createSupabaseClient();
  const firestore = useFirestore();
  const { toast } = useToast();
  const lastProcessedTimestamp = useRef(0);

  const getAnalysisVariant = (analysis: string | null) => {
    switch (analysis?.toLowerCase()) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'moderate':
        return 'secondary';
      default:
        return 'default';
    }
  }

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

  useEffect(() => {
    if (state.flyCount !== null && state.analysis && state.timestamp > lastProcessedTimestamp.current) {
      if (firestore) {
        saveToFirestore(firestore, { flyCount: state.flyCount, analysis: state.analysis });
        toast({
          title: "Analysis Saved",
          description: `Fly count of ${state.flyCount} has been saved to the database.`,
        });
        lastProcessedTimestamp.current = state.timestamp;
      } else {
         toast({
          variant: "destructive",
          title: "Firestore Error",
          description: "Could not connect to the database to save the result.",
        });
      }
    }
  }, [state, firestore, toast]);

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
              <CardTitle>Fly Count Analysis</CardTitle>
              <CardDescription>
                Use the AI to count the number of flies in the latest trap photo.
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

        {(useFormStatus().pending || state.flyCount !== null || state.error) && (
          <Card className="mt-8">
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>AI Analysis</CardTitle>
                <CardDescription>
                  Here's the result from the AI-powered fly count.
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
              {state.flyCount !== null && (
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold">{state.flyCount}</div>
                  <div className='flex flex-col'>
                    <p className='text-lg font-medium'>Flies Detected</p>
                    {state.analysis && <Badge variant={getAnalysisVariant(state.analysis)}>{state.analysis}</Badge>}
                  </div>
                </div>
              )}
              {state.error && <p className="text-destructive">{state.error}</p>}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
