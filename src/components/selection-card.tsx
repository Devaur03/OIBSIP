
"use client";

import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SelectionCardProps {
  name: string;
  price: number;
  icon: ReactNode;
  isSelected: boolean;
  onSelect: () => void;
  stock: number;
}

export function SelectionCard({ name, price, icon, isSelected, onSelect, stock }: SelectionCardProps) {
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isOutOfStock) return;
    onSelect();
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
          "relative focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg group",
          isOutOfStock ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      )}
      tabIndex={isOutOfStock ? -1 : 0}
      onKeyDown={(e) => { if((e.key === 'Enter' || e.key === ' ') && !isOutOfStock) onSelect() }}
      aria-disabled={isOutOfStock}
    >
      <Card
        className={cn(
          "h-full transition-all duration-300 ease-in-out",
          isSelected && !isOutOfStock ? "border-primary ring-2 ring-primary shadow-lg" : "border-border",
          !isOutOfStock && "group-hover:shadow-md"
        )}
      >
        <CardContent className="flex flex-col items-center justify-center p-4 text-center gap-3">
          <div className={cn("w-12 h-12 transition-colors", isSelected && !isOutOfStock ? 'text-primary' : 'text-muted-foreground')}>
            {icon}
          </div>
          <p className="font-semibold text-sm leading-tight">{name}</p>
          <p className="text-xs text-muted-foreground">${price.toFixed(2)}</p>
        </CardContent>
      </Card>
      {isSelected && !isOutOfStock && (
        <div className="absolute top-2 right-2 text-primary bg-card rounded-full">
          <CheckCircle2 size={20} />
        </div>
      )}
      {isOutOfStock && (
        <Badge variant="destructive" className="absolute top-2 right-2">Out of stock</Badge>
      )}
      {isLowStock && (
         <Badge variant="secondary" className="absolute top-2 right-2 bg-orange-100 text-orange-800">Only {stock} left!</Badge>
      )}
    </div>
  );
}
