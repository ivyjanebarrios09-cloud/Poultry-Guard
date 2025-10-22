
import { PhotoAnalyzer } from '@/components/dashboard/photo-analyzer';

export default function PhotoPage() {
  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold font-headline tracking-tight">Photo Analysis Endpoint</h1>
      </div>
      <PhotoAnalyzer />
    </div>
  );
}
