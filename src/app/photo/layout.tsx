
import React from 'react';

export default function PhotoLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen w-full items-start justify-center bg-background p-4">
      <div className="w-full max-w-4xl">
        {children}
      </div>
    </main>
  );
}
