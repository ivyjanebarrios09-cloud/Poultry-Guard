import { PhotoAnalyzer } from "@/components/dashboard/photo-analyzer";

export default function PhotoPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Photo Analysis</h1>
        <p className="text-muted-foreground">
          Use AI to get a textual description of an uploaded photo.
        </p>
      </div>
      <PhotoAnalyzer />
    </div>
  );
}
