import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const teamMembers = [
  'Antenor',
  'Dela Cruz',
  'Laxamana',
  'Ong',
  'Reyes, J.',
  'Reyes, R.',
];

const sdgGoals = [
  {
    title: 'SDG15: The Life of Land',
    description: 'Preserving terrestrial ecosystems by managing pests sustainably without harming biodiversity.',
    imageUrl: '/image/SDG15 The Life of Land.jpg',
    aiHint: 'terrestrial ecosystem'
  },
  {
    title: 'SDG3: Good Health and Well-Being',
    description: 'We believe that developing app with device promotes on protecting human and chicken health by minimizing disease risks upon user feedback and activities it shape the future researcher to develop more.',
    imageUrl: '/image/SDG3 Good Health and Well-Being.jpg',
    aiHint: 'health wellbeing'
  }
]

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-12 w-full max-w-5xl mx-auto">
      <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
        <Image
          src="/image/about.jpg"
          alt="The PoultryGuard development team"
          fill
          className="object-cover"
          data-ai-hint="team meeting"
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

      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-headline">Our Mission</h2>
          <p className="mt-2 text-muted-foreground">Aligned with the UN's Sustainable Development Goals.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sdgGoals.map((goal) => (
                <Card key={goal.title} className="shadow-md hover:shadow-xl transition-shadow">
                    <CardHeader className="items-center">
                        <div className="relative h-24 w-24 mb-4">
                            <Image src={goal.imageUrl} alt={goal.title} width={200} height={200} style={{objectFit: 'contain'}} data-ai-hint={goal.aiHint} />
                        </div>
                        <CardTitle className="text-center text-xl">{goal.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-muted-foreground">{goal.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
