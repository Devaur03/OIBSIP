"use client";

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { suggestPizza } from '@/ai/flows/pizza-suggestion';

export function AiSuggestion() {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getSuggestion = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestion(null);
    setIsDialogOpen(true);

    const recentOrderData = JSON.stringify({
      base: "Thick Crust",
      sauce: "Spicy Red",
      cheese: "Provolone",
      veggies: ["Onions", "Jalapeños"],
      meat: []
    });

    try {
      const result = await suggestPizza({ recentOrderData });
      setSuggestion(result.suggestedPizza);
    } catch (e) {
      setError("Sorry, our AI chef is busy. Please try again later.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mt-4">
        <Button onClick={getSuggestion} disabled={isLoading} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          {isLoading && !isDialogOpen ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-5 w-5" />
          )}
          Get AI Suggestion
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline">
              <Sparkles className="text-accent" />
              AI Pizza Suggestion
            </DialogTitle>
            <DialogDescription>
              Based on recent popular orders, here's a combination you might love!
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 min-h-[100px] flex items-center justify-center">
            {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {suggestion && (
              <Alert className="border-accent">
                 <Sparkles className="h-4 w-4 !left-4 !top-4 text-accent" />
                <AlertTitle className="font-semibold text-accent">Chef's Recommendation</AlertTitle>
                <AlertDescription className="font-bold text-lg text-foreground">{suggestion}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} variant="outline">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
