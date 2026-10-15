
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/med-finder/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BriefcaseMedical, LogOut, Save, PlusCircle, Trash2, UserCog } from 'lucide-react';
import type { Pharmacy, StockStatus, MedicationStock } from '@/lib/types';

const SESSION_PREFIX = 'pharmacy_session_';
const ACTIVE_ID_KEY = 'active_pharmacy_id';

export default function PharmacistCorner() {
  const router = useRouter();
  const { toast } = useToast();

  const [currentPharmacy, setCurrentPharmacy] = useState<Pharmacy | null>(null);
  const [stock, setStock] = useState<Record<string, MedicationStock>>({});
  const [pharmacyName, setPharmacyName] = useState('');
  const [pharmacyEmail, setPharmacyEmail] = useState('');
  
  // États pour le nouveau médicament
  const [newMedName, setNewMedName] = useState('');
  const [newMedPrice, setNewMedPrice] = useState('2500');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    const activeId = window.sessionStorage.getItem(ACTIVE_ID_KEY);
    if (!activeId) {
      router.replace('/pharmacist-login');
      return;
    }

    const sessionKey = `${SESSION_PREFIX}${activeId}`;
    const sessionData = window.sessionStorage.getItem(sessionKey);

    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        if (session.pharmacy) {
          setCurrentPharmacy(session.pharmacy);
          setStock(session.pharmacy.stock || {});
          setPharmacyName(session.pharmacy.name);
          setPharmacyEmail(session.pharmacy.email || 'contact@pharmacie.bf');
        }
      } catch (e) {
        router.replace('/pharmacist-login');
      }
    }
  }, [router]);

  const handleStockChange = (name: string, status: StockStatus) => {
    setStock(prev => ({ ...prev, [name]: { ...prev[name], status } }));
  };

  const handlePriceChange = (name: string, price: number) => {
    setStock(prev => ({ ...prev, [name]: { ...prev[name], price } }));
  };

  const handleAddMedication = () => {
    if (!newMedName.trim()) return;
    setStock(prev => ({
      ...prev,
      [newMedName.trim()]: { status: 'En Stock', price: parseInt(newMedPrice) }
    }));
    setNewMedName('');
    setIsAddDialogOpen(false);
    toast({ title: "Médicament ajouté", description: `${newMedName} a été ajouté à votre liste de modification.` });
  };

  const handleDeleteMedication = (name: string) => {
    const updatedStock = { ...stock };
    delete updatedStock[name];
    setStock(updatedStock);
  };

  const handleSaveChanges = () => {
    if (!currentPharmacy) return;

    const updatedPharmacy: Pharmacy = {
      ...currentPharmacy,
      name: pharmacyName,
      email: pharmacyEmail,
      stock: stock,
    };

    const sessionKey = `${SESSION_PREFIX}${currentPharmacy.id}`;
    window.sessionStorage.setItem(sessionKey, JSON.stringify({ 
        isLoggedIn: true, 
        pharmacy: updatedPharmacy 
    }));
    
    setCurrentPharmacy(updatedPharmacy);
    toast({ title: "Modifications sauvegardées", description: "Votre inventaire est maintenant à jour pour tous les utilisateurs." });
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(ACTIVE_ID_KEY);
    router.push('/pharmacist-login');
  };

  if (!currentPharmacy) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <BriefcaseMedical className="h-10 w-10 text-primary" />
              <h1 className="text-3xl font-bold">Espace Gestion - {currentPharmacy.name}</h1>
            </div>
            <Button variant="outline" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Déconnexion</Button>
          </div>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><UserCog className="h-5 w-5" /> Informations de l'officine</CardTitle></CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nom d'affichage</Label>
                <Input value={pharmacyName} onChange={e => setPharmacyName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email de contact</Label>
                <Input value={pharmacyEmail} onChange={e => setPharmacyEmail(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Inventaire des stocks</CardTitle>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary"><PlusCircle className="mr-2 h-4 w-4" /> Ajouter un médicament</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nouveau médicament</DialogTitle>
                      <DialogDescription>Ajoutez un produit qui n'est pas encore dans votre liste.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Nom du médicament</Label>
                        <Input placeholder="Ex: Paracétamol" value={newMedName} onChange={e => setNewMedName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Prix (CFA)</Label>
                        <Input type="number" value={newMedPrice} onChange={e => setNewMedPrice(e.target.value)} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddMedication}>Ajouter à l'inventaire</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(stock).length === 0 && <p className="text-muted-foreground col-span-full py-8 text-center">Aucun médicament en stock. Cliquez sur "Ajouter".</p>}
                {Object.entries(stock).map(([name, data]) => (
                  <div key={name} className="flex flex-col gap-3 rounded-xl border p-4 bg-card shadow-sm">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-lg">{name}</span>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteMedication(name)} className="text-destructive h-8 w-8"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Prix (CFA)</Label>
                        <Input type="number" value={data.price} onChange={e => handlePriceChange(name, parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Disponibilité</Label>
                        <Select value={data.status} onValueChange={(s: StockStatus) => handleStockChange(name, s)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="En Stock">En Stock</SelectItem>
                            <SelectItem value="Stock Faible">Stock Faible</SelectItem>
                            <SelectItem value="En Rupture">En Rupture</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4 pb-12">
            <Button onClick={handleSaveChanges} size="lg" className="px-10"><Save className="mr-2 h-5 w-5" />Sauvegarder les modifications</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
