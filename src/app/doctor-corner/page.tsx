
'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Header } from '@/components/med-finder/Header';
import { MedicationSearchForm } from '@/components/med-finder/MedicationSearchForm';
import { PharmacyCard } from '@/components/med-finder/PharmacyCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Stethoscope } from 'lucide-react';
import { pharmacies as initialPharmacies } from '@/lib/data';
import type { Pharmacy, MedicationStock } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

const SESSION_PREFIX = 'pharmacy_session_';

function DoctorCornerContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  
  const [results, setResults] = useState<{ pharmacy: Pharmacy, stock: MedicationStock }[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(initialPharmacies);

  const loadMergedData = useCallback(() => {
    let updatedPharmacies = [...initialPharmacies];
    try {
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const key = window.sessionStorage.key(i);
        if (key && key.startsWith(SESSION_PREFIX)) {
          const session = JSON.parse(window.sessionStorage.getItem(key) || '{}');
          if (session.pharmacy?.id) {
            const idx = updatedPharmacies.findIndex(p => p.id === session.pharmacy.id);
            if (idx !== -1) updatedPharmacies[idx] = session.pharmacy;
          }
        }
      }
    } catch (e) {}
    setPharmacies(updatedPharmacies);
  }, []);

  useEffect(() => {
    loadMergedData();
    const interval = setInterval(loadMergedData, 2000);
    return () => clearInterval(interval);
  }, [loadMergedData]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const searchName = query.trim().toLowerCase();
    const matches: { pharmacy: Pharmacy, stock: MedicationStock }[] = [];
    pharmacies.forEach(p => {
      const foundKey = Object.keys(p.stock || {}).find(m => m.toLowerCase() === searchName);
      if (foundKey) matches.push({ pharmacy: p, stock: p.stock[foundKey] });
    });
    setResults(matches);
  }, [query, pharmacies]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Stethoscope className="h-8 w-8 text-primary" />
                <CardTitle className="text-3xl font-bold tracking-tight">Le coin du médecin</CardTitle>
              </div>
              <CardDescription className="pt-2 text-base">
                Vérifiez la disponibilité réelle pour vos prescriptions et guidez vos patients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MedicationSearchForm initialQuery={query} />
            </CardContent>
          </Card>

          {query && results.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {results.map(({ pharmacy, stock }) => (
                <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} medication={query} stock={stock} />
              ))}
            </div>
          )}

          {query && results.length === 0 && (
            <Alert className="mt-8 text-center bg-card">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Non trouvé</AlertTitle>
              <AlertDescription>
                Désolé, &quot;{query}&quot; n'est actuellement répertorié dans aucune pharmacie.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </main>
      <footer className="bg-muted py-6 px-6 text-center text-sm text-muted-foreground mt-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <span>© {new Date().getFullYear()} MédiFaso.</span>
          <div className="flex gap-2">
             <Button asChild variant="outline" size="sm"><Link href="/">Accueil</Link></Button>
             <Button asChild variant="outline" size="sm"><Link href="/pharmacist-login">Espace Pharmacien</Link></Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function DoctorCorner() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Chargement...</div>}>
      <DoctorCornerContent />
    </Suspense>
  );
}
