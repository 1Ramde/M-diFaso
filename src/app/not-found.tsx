import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/med-finder/Header';

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold mb-2">404 - Page non trouvée</h1>
        <p className="text-muted-foreground mb-6">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <Button asChild>
          <Link href="/">Retour à l'accueil</Link>
        </Button>
      </main>
    </div>
  );
}
