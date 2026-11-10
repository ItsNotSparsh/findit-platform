import {
  Backpack,
  BookOpen,
  Glasses,
  Headphones,
  IdCard,
  KeyRound,
  Laptop,
  Package,
  Shirt,
  Smartphone,
  Watch,
  Wallet,
} from "lucide-react";

const CATEGORY_ICONS = {
  phones: Smartphone,
  laptops: Laptop,
  headphones: Headphones,
  wallets: Wallet,
  keys: KeyRound,
  bags: Backpack,
  "id cards": IdCard,
  books: BookOpen,
  glasses: Glasses,
  clothing: Shirt,
  watches: Watch,
  other: Package,
} as const;

export function CategoryIcon({ name, className = "h-4 w-4" }: { name: string; className?: string }) {
  const Icon = CATEGORY_ICONS[name.trim().toLowerCase() as keyof typeof CATEGORY_ICONS] ?? Package;
  return <Icon aria-hidden="true" className={className} />;
}
