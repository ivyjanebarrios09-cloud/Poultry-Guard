'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { describePhotoAction } from '@/actions/photo-actions';
import { LoaderCircle, Image as ImageIcon, Bot, Upload } from 'lucide-react';
import React, { useState, useRef } from 'react';
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
    <Button type="submit" disabled={pending} className="bg-accent hover:bg-accent/90">
      {pending ? <LoaderCircle className="animate-spin" /> : <ImageIcon />}
      {pending ? 'Analyzing...' : 'Analyze Photo'}
    </Button>
  );
}

export function PhotoAnalyzer() {
  const [state, formAction] = useFormState(describePhotoAction, initialState);
  const [preview, setPreview] = useState<string | null>(placeholder.imageUrl);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        setPhotoDataUri(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card className="shadow-lg">
        <form action={formAction}>
          <input type="hidden" name="photoDataUri" value={photoDataUri || ''} />
          <CardHeader>
            <CardTitle>Upload Photo</CardTitle>
            <CardDescription>
              Upload a photo from your farm for AI analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video w-full relative overflow-hidden rounded-lg border">
                {preview && (
                    <Image
                        src={preview}
                        alt="Photo preview"
                        fill
                        className="object-cover"
                        data-ai-hint={placeholder.imageHint}
                    />
                )}
                {!preview && (
                    <div className="flex items-center justify-center h-full bg-muted">
                        <ImageIcon className="h-16 w-16 text-muted-foreground" />
                    </div>
                )}
            </div>
             <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <Button type="button" variant="outline" onClick={handleUploadClick} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Choose File
            </Button>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      <div className="space-y-8">
        {(useFormStatus().pending || state.description || state.error) && (
            <Card>
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
                    {useFormStatus().pending && <div className="flex items-center gap-2 text-muted-foreground"><LoaderCircle className="animate-spin h-4 w-4" /><span>Analyzing photo...</span></div>}
                    {state.description && <p className="prose prose-sm max-w-none text-foreground">{state.description}</p>}
                    {state.error && <p className="text-destructive">{state.error}</p>}
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
