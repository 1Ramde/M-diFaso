
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/med-finder/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, LogIn } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { pharmacies as initialPharmacies } from '@/lib/data';

const SESSION_PREFIX = 'pharmacy_session_';
const ACTIVE_ID_KEY = 'active_pharmacy_id';

export default function PharmacistLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string>('');
  const [email, setEmail] = useState('admin@medifaso.bf');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedPharmacyId) {
      setError('Veuillez sélectionner une pharmacie.');
      return;
    }

    // Simulation d'authentification
    if ((email === 'admin@medifaso.bf' || email === 'admin@medifaso.com' || email === 'admin@pharmacherche.com') && password === 'password123') {
        const sessionKey = `${SESSION_PREFIX}${selectedPharmacyId}`;
        const savedSession = window.sessionStorage.getItem(sessionKey);
        
        let pharmacyToStore;

        if (savedSession) {
            // Si une session existe déjà pour cette pharmacie (avec des modifs), on la garde
            const parsed = JSON.parse(savedSession);
            pharmacyToStore = parsed.pharmacy;
        } else {
            // Sinon on prend les données initiales du fichier data.ts
            pharmacyToStore = initialPharmacies.find(p => p.id.toString() === selectedPharmacyId);
        }

        if (!pharmacyToStore) {
            setError('Erreur lors du chargement des données.');
            return;
        }

        // On enregistre la session spécifique à cette pharmacie
        window.sessionStorage.setItem(sessionKey, JSON.stringify({ 
            isLoggedIn: true, 
            pharmacy: pharmacyToStore 
        }));
        
        // On définit quelle est la pharmacie active
        window.sessionStorage.setItem(ACTIVE_ID_KEY, selectedPharmacyId);
        
        toast({
            title: 'Connexion réussie',
            description: `Bienvenue à la ${pharmacyToStore.name}.`,
        });
        router.push('/pharmacist-corner');
    } else {
      setError('Identifiants invalides.');
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-8 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <LogIn className="h-6 w-6 text-primary" />
              Accès Pharmacien
            </CardTitle>
            <CardDescription>
              Connectez-vous pour gérer l'inventaire de votre officine.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pharmacy">Choisir votre pharmacie</Label>
                <Select value={selectedPharmacyId} onValueChange={setSelectedPharmacyId}>
                  <SelectTrigger id="pharmacy">
                    <SelectValue placeholder="Sélectionnez..." />
                  </SelectTrigger>
                  <SelectContent>
                    {initialPharmacies.map(pharmacy => (
                      <SelectItem key={pharmacy.id} value={pharmacy.id.toString()}>
                        {pharmacy.name} ({pharmacy.city})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full">Se connecter</Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button asChild variant="outline" className="w-full">
                <Link href="/">Retour à l'accueil</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
