
'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, totalPrice } = useCart();
  const { toast } = useToast();

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: 'Your cart is empty',
        description: 'Add some pizzas to your cart before checking out.',
        variant: 'destructive',
      });
      return;
    }
    // Logic is now moved to the checkout page
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-3">
            <ShoppingCart className="w-8 h-8"/>
            Your Cart
        </h1>
        {cart.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => clearCart()}>
                <Trash2 className="mr-2 h-4 w-4"/>
                Clear Cart
            </Button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground mb-4">Your cart is empty.</p>
          <Button asChild>
            <Link href="/user">Start Crafting a Pizza</Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
                {cart.map((pizza, index) => (
                    <Card key={index} className="overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between p-4 bg-muted/30">
                            <CardTitle className="text-lg font-headline">Custom Pizza #{index + 1}</CardTitle>
                             <Button variant="ghost" size="icon" onClick={() => removeFromCart(pizza.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Remove</span>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-4 text-sm space-y-2">
                             <p><strong>Base:</strong> {pizza.base?.name}</p>
                             <p><strong>Sauce:</strong> {pizza.sauce?.name}</p>
                             <p><strong>Cheese:</strong> {pizza.cheese?.name}</p>
                             {pizza.veggies.length > 0 && <p><strong>Veggies:</strong> {pizza.veggies.map(v => v.name).join(', ')}</p>}
                             {pizza.meat.length > 0 && <p><strong>Meat:</strong> {pizza.meat.map(m => m.name).join(', ')}</p>}
                        </CardContent>
                        <CardFooter className="p-4 bg-muted/30 text-right">
                            <p className="font-bold w-full">Price: ${pizza.price.toFixed(2)}</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <div className="md:col-span-1">
                <Card className="sticky top-20">
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between">
                            <span>Taxes & Fees</span>
                            <span>$0.00</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button className="w-full" size="lg" asChild disabled={cart.length === 0}>
                            <Link href="/checkout">Proceed to Checkout</Link>
                         </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
      )}
    </div>
  );
}
