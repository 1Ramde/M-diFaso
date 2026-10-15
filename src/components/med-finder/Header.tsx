import { Pill } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="flex h-16 items-center border-b bg-card px-4 md:px-6">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <Pill className="h-6 w-6 text-primary" />
        <span className="text-lg font-headline">MédiFaso</span>
      </Link>
    </header>
  );
}
