
'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { pharmacies as initialPharmacies } from '@/lib/data';
import type { Pharmacy, MedicationStock } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/med-finder/Header';
import { MedicationSearchForm } from '@/components/med-finder/MedicationSearchForm';
import { PharmacyCard } from '@/components/med-finder/PharmacyCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, MapPin } from 'lucide-react';

const SESSION_PREFIX = 'pharmacy_session_';

export function HomePageContent({ initialQuery }: { initialQuery: string }) {
  const [results, setResults] = useState<{ pharmacy: Pharmacy, stock: MedicationStock }[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(initialPharmacies);

  // Fonction pour charger les données de toutes les sessions actives
  const loadMergedData = useCallback(() => {
    let updatedPharmacies = [...initialPharmacies];
    
    try {
      // On parcourt tout le sessionStorage
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const key = window.sessionStorage.key(i);
        if (key && key.startsWith(SESSION_PREFIX)) {
          const sessionData = window.sessionStorage.getItem(key);
          if (sessionData) {
            const session = JSON.parse(sessionData);
            if (session.pharmacy && session.pharmacy.id) {
              const idx = updatedPharmacies.findIndex(p => p.id === session.pharmacy.id);
              if (idx !== -1) {
                updatedPharmacies[idx] = session.pharmacy;
              }
            }
          }
        }
      }
    } catch (e) {
      console.error("Erreur fusion données:", e);
    }
    
    setPharmacies(updatedPharmacies);
  }, []);

  useEffect(() => {
    loadMergedData();

    // Écouter les changements dans d'autres onglets/fenêtres
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith(SESSION_PREFIX)) {
        loadMergedData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Astuce pour détecter les changements dans la MÊME fenêtre (puisque l'événement storage ne se déclenche pas pour elle-même)
    const interval = setInterval(loadMergedData, 2000); 

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [loadMergedData]);

  useEffect(() => {
    if (!initialQuery) {
      setResults([]);
      return;
    }

    const searchName = initialQuery.trim().toLowerCase();
    const matches: { pharmacy: Pharmacy, stock: MedicationStock }[] = [];

    pharmacies.forEach(p => {
      const foundMedKey = Object.keys(p.stock || {}).find(m => m.toLowerCase() === searchName);
      if (foundMedKey) {
        matches.push({ pharmacy: p, stock: p.stock[foundMedKey] });
      }
    });

    setResults(matches);
  }, [initialQuery, pharmacies]);

  const mapImage = PlaceHolderImages.find(p => p.id === 'map-placeholder');

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center bg-background px-4 pt-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Trouvez votre médicament</CardTitle>
              <CardDescription>Recherchez la disponibilité en temps réel dans les pharmacies du Burkina.</CardDescription>
            </CardHeader>
            <CardContent>
              <MedicationSearchForm initialQuery={initialQuery} />
            </CardContent>
          </Card>

          {initialQuery && results.length > 0 && (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="text-primary" />
                    <span>Emplacements des pharmacies</span>
                  </CardTitle>
                  <CardDescription>Pharmacies ayant "{initialQuery}" disponible à proximité.</CardDescription>
                </CardHeader>
                <CardContent>
                  {mapImage && (
                    <div className="aspect-[3/1] w-full overflow-hidden rounded-lg border">
                      <Image src={mapImage.imageUrl} alt="Map" width={1200} height={400} className="object-cover" />
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {results.map(({ pharmacy, stock }) => (
                  <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} medication={initialQuery} stock={stock} />
                ))}
              </div>
            </div>
          )}

          {initialQuery && results.length === 0 && (
            <Alert className="mt-8 text-center bg-card">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Non trouvé</AlertTitle>
              <AlertDescription>
                Désolé, "{initialQuery}" n'a été trouvé dans aucune pharmacie de notre réseau pour le moment.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </main>
    </>
  );
}
