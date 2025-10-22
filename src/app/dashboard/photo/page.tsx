import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { PhotoAnalyzer } from '@/components/dashboard/photo-analyzer';

export default function PhotoPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-5 w-5" />
          <span className="font-semibold">Latest Photo</span>
        </Link>
      </div>
      <PhotoAnalyzer />
    </div>
  );
}
