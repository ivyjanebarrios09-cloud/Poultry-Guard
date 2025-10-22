import {
  Card,
  CardContent,
} from '@/components/ui/card';
import Image from 'next/image';

const teamMembers = [
  'Antenor',
  'Dela Cruz',
  'Laxamana',
  'Ong',
  'Reyes, J.',
  'Reyes, R.',
];

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
        <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
            <Image
                src="https://picsum.photos/seed/rainyday/1280/400"
                alt="Abstract background image"
                fill
                className="object-cover"
                data-ai-hint="rainy window"
            />
        </div>

      <div className="text-center px-4">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Meet the Team</h1>
        <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">
            We are Team 3, the creators of "PoultryGuard," a device and mobile application for remote pest control management in poultry farms. We are students from the Technological Institute of the Philippines - QC Area. All information gathered from this application will be used solely for educational purposes.
        </p>
      </div>
      
      <Card className="shadow-lg w-full">
        <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {teamMembers.map((member) => (
                    <div key={member} className="bg-secondary/50 p-4 rounded-md text-center">
                        <p className="font-medium text-secondary-foreground">{member}</p>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
