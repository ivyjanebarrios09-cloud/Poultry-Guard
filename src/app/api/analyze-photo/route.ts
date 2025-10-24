
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase/client';
import { countFliesInPhoto } from '@/ai/flows/count-flies-in-photo';
import { getFirestore, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

// Helper function to initialize Firebase server-side
function initializeFirebaseServer() {
  const apps = getApps();
  if (apps.length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

async function toDataURL(url: string): Promise<string> {
  // The proxy is not needed when running in a server environment
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image directly: ${response.statusText}`);
  }
  const blob = await response.blob();
  const buffer = Buffer.from(await blob.arrayBuffer());
  return `data:${blob.type};base64,${buffer.toString('base64')}`;
}

async function saveToFirestore(data: { flyCount: number; analysis: string; imageUrl: string; }) {
  try {
    const firebaseApp = initializeFirebaseServer();
    const db = getFirestore(firebaseApp);
    const collectionRef = collection(db, 'flyCounts');
    const log = {
      ...data,
      timestamp: serverTimestamp(),
    };
    await addDoc(collectionRef, log);
    console.log("Analysis result saved to Firestore.");
  } catch (error) {
    console.error("Error saving to Firestore: ", error);
    // We will still return the analysis result even if Firestore fails
    // but we'll log the error.
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Fetch the latest photo from Supabase
    const supabase = createSupabaseClient();
    const { data: listData, error: listError } = await supabase.storage
      .from('poultryguardPhoto')
      .list('photos', {
        limit: 1,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (listError) throw listError;

    if (!listData || listData.length === 0 || listData[0].name === '.emptyFolderPlaceholder') {
      return NextResponse.json({ error: 'No photos found in the bucket to analyze.' }, { status: 404 });
    }

    const latestFile = listData[0];
    const { data: publicUrlData } = supabase.storage
      .from('poultryguardPhoto')
      .getPublicUrl(`photos/${latestFile.name}`);

    if (!publicUrlData) {
      throw new Error('Could not get public URL for the latest photo.');
    }

    const imageUrl = `${publicUrlData.publicUrl}?t=${new Date().getTime()}`;

    // 2. Convert image to Data URI
    const photoDataUri = await toDataURL(imageUrl);

    // 3. Perform AI analysis
    const result = await countFliesInPhoto({ photoDataUri });

    // 4. Save result to Firestore (fire-and-forget, don't block response)
    saveToFirestore({
      flyCount: result.flyCount,
      analysis: result.analysis,
      imageUrl: imageUrl,
    });
    
    // 5. Return JSON response
    return NextResponse.json({
      flyCount: result.flyCount,
      analysis: result.analysis,
      imageUrl: imageUrl,
    }, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: `Failed to analyze photo: ${errorMessage}` }, { status: 500 });
  }
}
