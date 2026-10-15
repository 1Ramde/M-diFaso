
import { Suspense } from 'react';
import Link from 'next/link';

import { HomePageContent } from '@/components/med-finder/HomePageContent';
import { AISection } from '@/components/med-finder/AISection';
import { Button } from '@/components/ui/button';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}) {
  const resolvedSearchParams = await searchParams;
  const query = typeof resolvedSearchParams?.query === 'string' ? resolvedSearchParams.query : '';
  const alternativesQuery = typeof resolvedSearchParams?.alternatives === 'string' ? resolvedSearchParams.alternatives : undefined;

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* We pass the initialQuery to the client component, so it can be used on first render */}
      <HomePageContent initialQuery={query} />
      
      <main className="flex flex-1 flex-col items-center bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          <AISection alternativesQuery={alternativesQuery} />
        </div>
      </main>

      <footer className="bg-muted py-6 px-6 text-center text-sm text-muted-foreground">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <span>© {new Date().getFullYear()} MédiFaso. Tous droits réservés.</span>
            <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                    <Link href="/pharmacist-login">Le coin du pharmacien</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                    <Link href="/doctor-corner">Le coin du médecin</Link>
                </Button>
            </div>
        </div>
      </footer>
    </div>
  );
}
