
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
import { AlertTriangle, UserPlus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function PharmacistSignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [pharmacyName, setPharmacyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    
    if (password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères.');
        return;
    }

    // --- SIMULATION D'INSCRIPTION ---
    // Dans une vraie application, vous créeriez un nouvel utilisateur avec Firebase Auth
    // et un nouveau document pharmacie dans Firestore.
    
    console.log('Simulation d\'inscription:', { pharmacyName, email });
    
    toast({
      title: 'Inscription réussie ! (Simulation)',
      description: "Vous allez être redirigé vers la page de connexion.",
    });

    // Rediriger vers la page de connexion après une courte pause
    setTimeout(() => {
      router.push('/pharmacist-login');
    }, 2000);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-8 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <UserPlus className="h-6 w-6 text-primary" />
              Créer un compte Pharmacien
            </CardTitle>
            <CardDescription>
              Rejoignez notre réseau pour gérer votre inventaire en ligne.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pharmacyName">Nom de la pharmacie</Label>
                <Input
                  id="pharmacyName"
                  type="text"
                  placeholder="Ex: Pharmacie de l'Avenir"
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Erreur d'inscription</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full">
                Créer mon compte
              </Button>
            </form>
          </CardContent>
           <CardFooter>
             <p className="text-sm text-muted-foreground">
              Vous avez déjà un compte ?{' '}
              <Link href="/pharmacist-login" className="text-primary underline-offset-4 hover:underline">
                Connectez-vous
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
      <footer className="bg-muted py-6 px-6 text-center text-sm text-muted-foreground">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <span>© {new Date().getFullYear()} MédiFaso. Tous droits réservés.</span>
            <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                    <Link href="/">Retour à la recherche</Link>
                </Button>
            </div>
        </div>
      </footer>
    </div>
  );
}
