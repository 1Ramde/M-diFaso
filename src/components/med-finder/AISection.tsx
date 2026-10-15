
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';


// This is a server component to fetch AI results
export function AISection({ alternativesQuery }: { alternativesQuery?: string }) {
  if (!alternativesQuery) {
    return null;
  }
  
  return (
    <Alert className="mt-8">
      <Info className="h-4 w-4" />
      <AlertTitle>Fonctionnalité IA bientôt disponible</AlertTitle>
      <AlertDescription>
        La suggestion d'alternatives par intelligence artificielle est en cours de finalisation et sera activée prochainement.
      </AlertDescription>
    </Alert>
  );
}
