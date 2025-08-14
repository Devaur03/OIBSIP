
'use client';

import { Suspense, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { PizzaCustomizer } from "@/components/pizza-customizer";
import { AiSuggestion } from "@/components/ai-suggestion";
import { getInventoryForUser } from './actions';
import { InventoryItem } from '../admin/actions';

function UserPageContent() {
  const { user, loading } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);


  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setInventoryLoading(true);
        const inventoryItems = await getInventoryForUser();
        setInventory(inventoryItems);
      } catch (error) {
        console.error("Failed to fetch inventory data", error);
        // Optionally, show a toast to the user
      } finally {
        setInventoryLoading(false);
      }
    };
    fetchInventory();
  }, [])

  if (loading || inventoryLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // The auth hook handles redirection
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <main>
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-headline text-primary mb-2 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-accent"/>
                Need some inspiration?
            </h2>
            <p className="text-muted-foreground">Let our AI chef suggest a pizza for you!</p>
            <AiSuggestion />
        </div>
        <PizzaCustomizer inventory={inventory}/>
      </main>
    </div>
  );
}

export default function UserPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    }>
      <UserPageContent />
    </Suspense>
  )
}
