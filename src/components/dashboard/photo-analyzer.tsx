'use client';

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
import { LoaderCircle, Bot, Bug } from 'lucide-react';
import Image from 'next/image';
import { createSupabaseClient } from '@/lib/supabase/client';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  flyCount: null,
  analysis: null,
  error: null,
  timestamp: 0, // Initialize with 0 to ensure first result is processed
  imageUrl: null,
};

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

const saveToFirestore = (db: Firestore, data: { flyCount: number; analysis: string; imageUrl: string; }, onSuccess: () => void, onError: (error: Error) => void) => {
  if (!db) {
    onError(new Error("Firestore is not initialized."));
    return;
  }
  const collectionRef = collection(db, 'flyCounts');
  const log = {
    ...data,
    timestamp: serverTimestamp(),
  };

  addDoc(collectionRef, log)
    .then(() => {
      onSuccess();
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
      onError(error);
    });
};


export function PhotoAnalyzer() {
  const [state, formAction] = useActionState(analyzePhotoAction, initialState);
  const [preview, setPreview] = useState<string | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);
  const supabase = createSupabaseClient();
  const firestore = useFirestore();
  const { toast } = useToast();
  const lastProcessedTimestamp = useRef(0);

  const getAnalysisVariant = (analysis: string | null) => {
    switch (analysis?.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'destructive';
      case 'moderate':
        return 'secondary';
      default:
        return 'default';
    }
  }

  useEffect(() => {
    const fetchAndAnalyze = async () => {
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

        if (error) throw error;
        
        if (data && data.length > 0 && data[0].name !== '.emptyFolderPlaceholder') {
          const latestFile = data[0];
          const { data: publicUrlData } = supabase.storage
            .from('poultryguardPhoto')
            .getPublicUrl(`photos/${latestFile.name}`);
          
          if (publicUrlData) {
            const imageUrl = `${publicUrlData.publicUrl}?t=${new Date().getTime()}`;
            setPreview(imageUrl);
            
            const dataUrl = await toDataURL(imageUrl);
            setPhotoDataUri(dataUrl);

            // Automatically trigger analysis
            const formData = new FormData();
            formData.append('photoDataUri', dataUrl);
            formData.append('imageUrl', imageUrl);
            
            setIsAnalyzing(true);
            formAction(formData);

          } else {
             throw new Error('Could not get public URL for the latest photo.');
          }
        } else {
          setFetchError('No photos found in the bucket to analyze.');
        }
      } catch (error) {
        console.error('Error fetching or analyzing photo:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        setFetchError(`Failed to load or analyze image: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndAnalyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Runs only once on component mount

  useEffect(() => {
    // Stop analyzing spinner when results come in
    if (state.timestamp > 0) {
      setIsAnalyzing(false);
    }
    
    // Process results (save to Firestore, show toasts)
    if (state.timestamp > lastProcessedTimestamp.current) {
       lastProcessedTimestamp.current = state.timestamp;
      if (state.error) {
        toast({
          variant: "destructive",
          title: "Analysis Error",
          description: state.error,
        });
      } else if (state.flyCount !== null && state.analysis && state.imageUrl) {
        saveToFirestore(
          firestore!,
          { flyCount: state.flyCount, analysis: state.analysis, imageUrl: state.imageUrl },
          () => {
            toast({
              title: "Analysis Complete & Saved",
              description: `Fly count of ${state.flyCount} has been saved to the database.`,
            });
          },
          (error) => {
            toast({
              variant: "destructive",
              title: "Firestore Error",
              description: error.message || "Could not save the result to the database.",
            });
          }
        );
      }
    }
  }, [state, firestore, toast]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Fly Count Analysis</CardTitle>
              <CardDescription>
                Automatically analyzing the latest fly trap photo.
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
                    unoptimized
                  />
                ) : (
                   <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                    <p>No photo to display.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

        {(isAnalyzing || state.flyCount !== null || state.error) && (
          <Card className="mt-8">
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>AI Analysis</CardTitle>
                <CardDescription>
                  Here is the result from the automated fly count.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {isAnalyzing && !state.flyCount ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <LoaderCircle className="animate-spin h-4 w-4" />
                  <span>Analyzing photo...</span>
                </div>
              ) : state.flyCount !== null && state.timestamp === lastProcessedTimestamp.current ? (
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold">{state.flyCount}</div>
                  <div className='flex flex-col'>
                    <p className='text-lg font-medium'>Flies Detected</p>
                    {state.analysis && <Badge variant={getAnalysisVariant(state.analysis)}>{state.analysis}</Badge>}
                  </div>
                </div>
              ) : state.error && state.timestamp === lastProcessedTimestamp.current ? (
                <p className="text-destructive">{state.error}</p>
              ) : null}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
