
"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from "framer-motion";
import { Pizza, ArrowRight, ArrowLeft, ShoppingCart, RotateCw } from "lucide-react";

import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { SelectionCard } from "./selection-card";
import { PizzaBaseIcon, PizzaSauceIcon, CheeseIcon, VeggieIcon, PizzaSummaryIcon, MeatIcon } from "./pizza-icons";

import { pizzaBases, pizzaSauces, cheeseTypes, veggieToppings, meatToppings, type PizzaOption } from "@/lib/data";
import { InventoryItem } from "@/app/admin/actions";

type Step = "base" | "sauce" | "cheese" | "veggies" | "meat" | "summary";

interface PizzaState {
  base: PizzaOption | null;
  sauce: PizzaOption | null;
  cheese: PizzaOption | null;
  veggies: PizzaOption[];
  meat: PizzaOption[];
}

const steps: Step[] = ["base", "sauce", "cheese", "veggies", "meat", "summary"];

const stepTitles: Record<Step, string> = {
  base: "Choose Your Base",
  sauce: "Select a Sauce",
  cheese: "Pick Your Cheese",
  veggies: "Add Some Veggies",
  meat: "Choose Your Meat",
  summary: "Order Summary",
};

const stepDescriptions: Record<Step, string> = {
  base: "The foundation of your masterpiece.",
  sauce: "The heart of your pizza's flavor.",
  cheese: "Because everything is better with cheese.",
  veggies: "Fresh, healthy, and delicious toppings.",
  meat: "For the carnivores.",
  summary: "Review your creation before adding it to the cart.",
};


export function PizzaCustomizer({ inventory }: { inventory: InventoryItem[] }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [pizza, setPizza] = useState<PizzaState>({ base: null, sauce: null, cheese: null, veggies: [], meat: [] });
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const inventoryMap = useMemo(() => {
    return inventory.reduce((acc, item) => {
        acc[item.name] = item.stock;
        return acc;
    }, {} as Record<string, number>);
  }, [inventory])

  useEffect(() => {
    const configStr = searchParams.get('config');
    if (configStr) {
      try {
        const decodedConfig = atob(configStr);
        const config = JSON.parse(decodedConfig);
        setPizza(config);
        setCurrentStepIndex(steps.length - 1); // Go to summary
      } catch (error) {
        console.error("Failed to parse pizza config from URL:", error);
      }
    }
  }, [searchParams]);

  const currentStep = steps[currentStepIndex];

  const totalPrice = useMemo(() => {
    const basePrice = pizza.base?.price || 0;
    const saucePrice = pizza.sauce?.price || 0;
    const cheesePrice = pizza.cheese?.price || 0;
    const veggiesPrice = pizza.veggies.reduce((acc, veggie) => acc + veggie.price, 0);
    const meatPrice = pizza.meat.reduce((acc, meat) => acc + meat.price, 0);
    return basePrice + saucePrice + cheesePrice + veggiesPrice + meatPrice;
  }, [pizza]);

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleSelectBase = (base: PizzaOption) => setPizza({ ...pizza, base });
  const handleSelectSauce = (sauce: PizzaOption) => setPizza({ ...pizza, sauce });
  const handleSelectCheese = (cheese: PizzaOption) => setPizza({ ...pizza, cheese });
  const handleSelectVeggie = (veggie: PizzaOption) => {
    setPizza(prev => {
      const isSelected = prev.veggies.some(v => v.name === veggie.name);
      if (isSelected) {
        return { ...prev, veggies: prev.veggies.filter(v => v.name !== veggie.name) };
      }
      return { ...prev, veggies: [...prev.veggies, veggie] };
    });
  };
  const handleSelectMeat = (meat: PizzaOption) => {
    setPizza(prev => {
      const isSelected = prev.meat.some(m => m.name === meat.name);
      if (isSelected) {
        return { ...prev, meat: prev.meat.filter(m => m.name !== m.name) };
      }
      return { ...prev, meat: [...prev.meat, meat] };
    });
  };

  const handleAddToCart = () => {
    addToCart(pizza);
    toast({
      title: "Pizza Added!",
      description: "Your custom pizza has been added to the cart.",
    })
    resetAndRestart();
  };

  const resetAndRestart = () => {
    setPizza({ base: null, sauce: null, cheese: null, veggies: [], meat: [] });
    setCurrentStepIndex(0);
    // Clear the config from the URL to avoid re-loading the same pizza
    const newUrl = window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }

  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  
  const isNextDisabled = () => {
    switch(currentStep) {
        case 'base': return !pizza.base;
        case 'sauce': return !pizza.sauce;
        case 'cheese': return !pizza.cheese;
        default: return false;
    }
  }

  const renderStepContent = () => {
    const OptionsGrid = ({ children }: { children: React.ReactNode }) => (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">{children}</div>
    );

    const getStock = (name: string) => inventoryMap[name] ?? 100; // Default to a high number if not in map
    
    switch (currentStep) {
      case "base":
        return <OptionsGrid>{pizzaBases.map(b => <SelectionCard key={b.name} {...b} icon={<PizzaBaseIcon />} isSelected={pizza.base?.name === b.name} onSelect={() => handleSelectBase(b)} stock={getStock(b.name)} />)}</OptionsGrid>;
      case "sauce":
        return <OptionsGrid>{pizzaSauces.map(s => <SelectionCard key={s.name} {...s} icon={<PizzaSauceIcon />} isSelected={pizza.sauce?.name === s.name} onSelect={() => handleSelectSauce(s)} stock={getStock(s.name)} />)}</OptionsGrid>;
      case "cheese":
        return <OptionsGrid>{cheeseTypes.map(c => <SelectionCard key={c.name} {...c} icon={<CheeseIcon />} isSelected={pizza.cheese?.name === c.name} onSelect={() => handleSelectCheese(c)} stock={getStock(c.name)} />)}</OptionsGrid>;
      case "veggies":
        return <OptionsGrid>{veggieToppings.map(v => <SelectionCard key={v.name} {...v} icon={<VeggieIcon />} isSelected={pizza.veggies.some(pv => pv.name === v.name)} onSelect={() => handleSelectVeggie(v)} stock={getStock(v.name)} />)}</OptionsGrid>;
      case "meat":
        return <OptionsGrid>{meatToppings.map(m => <SelectionCard key={m.name} {...m} icon={<MeatIcon />} isSelected={pizza.meat.some(pm => pm.name === m.name)} onSelect={() => handleSelectMeat(m)} stock={getStock(m.name)} />)}</OptionsGrid>;
      case "summary":
        return (
          <div className="space-y-4 py-4">
              <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <PizzaSummaryIcon className="w-6 h-6 text-primary"/>
                        <CardTitle>Your Custom Pizza</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    {pizza.base && <p><strong>Base:</strong> {pizza.base.name} (${pizza.base.price.toFixed(2)})</p>}
                    {pizza.sauce && <p><strong>Sauce:</strong> {pizza.sauce.name} (${pizza.sauce.price.toFixed(2)})</p>}
                    {pizza.cheese && <p><strong>Cheese:</strong> {pizza.cheese.name} (${pizza.cheese.price.toFixed(2)})</p>}
                    {pizza.veggies.length > 0 && 
                        <div>
                            <strong>Veggies:</strong>
                            <ul className="list-disc pl-5">
                                {pizza.veggies.map(v => <li key={v.name}>{v.name} (${v.price.toFixed(2)})</li>)}
                            </ul>
                        </div>
                    }
                    {pizza.meat.length > 0 &&
                        <div>
                            <strong>Meat:</strong>
                            <ul className="list-disc pl-5">
                                {pizza.meat.map(m => <li key={m.name}>{m.name} (${m.price.toFixed(2)})</li>)}
                            </ul>
                        </div>
                    }
                </CardContent>
                <CardFooter className="bg-secondary/50 p-4 rounded-b-lg">
                    <p className="text-lg font-bold w-full text-right">Total: ${totalPrice.toFixed(2)}</p>
                </CardFooter>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden shadow-2xl shadow-primary/10">
        <CardHeader className="p-4 md:p-6">
          <Progress value={progress} className="mb-4 h-2" />
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-headline">{stepTitles[currentStep]}</CardTitle>
              <CardDescription>{stepDescriptions[currentStep]}</CardDescription>
            </div>
            <div className="hidden sm:block p-3 bg-primary/10 text-primary rounded-full">
                <Pizza className="w-8 h-8"/>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6 min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
        <Separator />
        <CardFooter className="p-4 bg-muted/20 flex justify-between">
           <div className="flex items-center gap-2">
            <Button variant="outline" onClick={prevStep} disabled={currentStepIndex === 0}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
            <Button variant="ghost" size="sm" onClick={resetAndRestart}>
                <RotateCw className="mr-2 h-4 w-4" />
                Start Over
            </Button>
           </div>
          {currentStep === 'summary' ? (
            <Button onClick={handleAddToCart} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <ShoppingCart className="mr-2 h-4 w-4"/>
              Add to Cart
            </Button>
          ) : (
            <Button onClick={nextStep} disabled={isNextDisabled()}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
