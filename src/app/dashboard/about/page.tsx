import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline tracking-tight">About PoultryGuard Pro</h1>
        <p className="text-muted-foreground">
          Advanced Poultry Monitoring System
        </p>
      </div>
      <Card className="shadow-lg max-w-2xl">
        <CardHeader className="items-center">
          <Image src="/image/logoo.png" alt="PoultryGuard Logo" width={64} height={64} />
          <CardTitle className="mt-4">Our Mission</CardTitle>
          <CardDescription>
            Revolutionizing poultry farm management through smart technology.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p>
            PoultryGuard Pro is an innovative solution designed to help modern farmers monitor their poultry environments with ease and precision. By leveraging AI-powered photo analysis and real-time data tracking, we provide actionable insights to improve hygiene, reduce pest-related issues, and ensure the well-being of your flock. Our mission is to empower farmers with the tools they need for a more productive and sustainable operation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
