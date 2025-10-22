'use client';

import { useFormStatus, useActionState } from 'react-dom';
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
import React, { useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const placeholder = PlaceHolderImages.find(p => p.id === 'photo-analysis-placeholder')!;

const initialState = {
  description: null,
  error: null,
  timestamp: Date.now(),
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <LoaderCircle className="animate-spin" /> : '✨'}
      {pending ? 'Analyzing...' : 'Describe Photo'}
    </Button>
  );
}

export function PhotoAnalyzer() {
  const [state, formAction] = useActionState(describePhotoAction, initialState);
  const [preview, setPreview] = useState<string | null>(placeholder.imageUrl);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(placeholder.imageUrl);

  // In a real app, this would fetch the latest photo
  const handleRefresh = () => {
    // For now, we'll just cycle through some placeholder seeds
    const newSeed = Math.floor(Math.random() * 100) + 1;
    const newUrl = `https://picsum.photos/seed/${newSeed}/1280/720`;
    setPreview(newUrl);
    setPhotoDataUri(newUrl);
  };


  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <form action={formAction}>
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
                {preview && (
                  <Image
                    src={preview}
                    alt="Latest monitoring photo"
                    fill
                    className="object-cover"
                    data-ai-hint="monitoring device"
                  />
                )}
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-2">
                <SubmitButton />
                <Button type="button" variant="ghost" onClick={handleRefresh}>
                    <RefreshCw />
                    Refresh
                </Button>
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
