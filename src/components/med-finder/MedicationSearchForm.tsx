'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function MedicationSearchForm({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPath = pathname || '/';
    if (query.trim()) {
      router.push(`${currentPath}?query=${encodeURIComponent(query)}`);
    } else {
      router.push(currentPath);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="e.g., Amoxicilline, Ibuprofène..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 text-base"
        />
      </div>
      <Button type="submit" size="lg" className="h-auto py-3">
        <Search className="mr-2 h-4 w-4" />
        Rechercher
      </Button>
    </form>
  );
}
