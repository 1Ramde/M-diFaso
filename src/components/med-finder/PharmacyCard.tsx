import type { Pharmacy, MedicationStock } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Pill, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  pharmacy: Pharmacy;
  medication: string;
  stock: MedicationStock;
};

const getBadgeClass = (status: string) => {
  switch (status) {
    case 'En Stock':
      return 'bg-accent/80 text-accent-foreground border-green-300';
    case 'Stock Faible':
      return 'bg-yellow-400/80 text-yellow-900 border-yellow-500';
    case 'En Rupture':
      return 'bg-destructive/80 text-destructive-foreground border-red-500';
    default:
      return 'bg-muted text-muted-foreground';
  }
};


export function PharmacyCard({ pharmacy, medication, stock }: Props) {
  return (
    <Card className="flex h-full flex-col transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-4">
          <span className="text-xl font-bold">{pharmacy.name}</span>
          <Badge className={cn('whitespace-nowrap', getBadgeClass(stock.status))}>
            {stock.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4 shrink-0" />
            <span>{pharmacy.address}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Pill className="mr-2 h-4 w-4 shrink-0" />
            <span className="italic">Recherche pour : {medication}</span>
          </div>
          <div className="flex items-center font-semibold text-primary">
            <Tag className="mr-2 h-4 w-4 shrink-0" />
            <span>{stock.price.toLocaleString('fr-FR')} CFA</span>
          </div>
        </div>
        <div className="text-right font-medium text-primary">
          {pharmacy.distance}
        </div>
      </CardContent>
    </Card>
  );
}
