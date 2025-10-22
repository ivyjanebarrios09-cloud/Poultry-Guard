import { PhotoAnalyzer } from "@/components/dashboard/photo-analyzer";
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function PhotoAnalysisPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <ChevronLeft className="h-6 w-6 text-muted-foreground" />
        </Link>
        <h1 className="text-2xl font-bold font-headline tracking-tight">Latest Photo</h1>
      </div>
      <PhotoAnalyzer />
    </div>
  );
}
