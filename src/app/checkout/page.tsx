
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { createOrder, saveOrder } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, CreditCard } from 'lucide-react';
import Image from 'next/image';

// Extend Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // We only want to redirect on the client side, and only if the cart is empty.
    if (isClient && cart.length === 0) {
      router.replace('/user');
    }
  }, [isClient, cart, router]);

  const handlePayment = async () => {
    setLoading(true);

    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'Please log in to proceed with the payment.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    try {
      const order = await createOrder({ amount: totalPrice });
      
      if (!order) {
        throw new Error('Order creation failed.');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'ChefPizza',
        description: 'Pizza Order Payment',
        image: '/images/l.png', // You can host a logo image
        order_id: order.id,
        handler: async function (response: any) {
            try {
                await saveOrder({
                    userId: user.uid,
                    cart,
                    totalPrice,
                    paymentId: response.razorpay_payment_id,
                });

                toast({
                    title: 'Payment Successful!',
                    description: 'Your order has been placed. Thank you!',
                });
                clearCart();
                router.push('/orders');

            } catch (saveError) {
                 toast({
                    title: 'Payment Complete, but...',
                    description: "Your payment was successful, but we couldn't save your order details. Please contact support.",
                    variant: 'destructive',
                });
                setLoading(false);
            }
        },
        prefill: {
          name: user.displayName || 'ChefPizza Customer',
          email: user.email || '',
          contact: '', // Can be prefilled if you collect phone numbers
        },
        notes: {
          address: 'ChefPizza Corporate Office',
        },
        theme: {
          color: '#F9482A', // This is your primary color
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast({
          title: 'Payment Failed',
          description: response.error.description,
          variant: 'destructive',
        });
        setLoading(false);
      });
      rzp.open();
      
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  // While redirecting or if the cart is empty, show a loader or nothing
  if (!isClient || cart.length === 0) {
     return (
       <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
     )
  }

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center gap-3 mb-2">
                <Image src="/images/l.png" alt="ChefPizza Logo" width={32} height={32} />
                <CardTitle className="text-3xl font-bold font-headline text-primary">
                Checkout
                </CardTitle>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Order Summary</h3>
            {cart.map(pizza => (
              <div key={pizza.id} className="flex justify-between text-sm">
                <span>Custom Pizza</span>
                <span>${pizza.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total Amount</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            You will be redirected to Razorpay for a secure payment.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" onClick={handlePayment} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="mr-2 h-4 w-4" />
            )}
            Pay ${totalPrice.toFixed(2)} with Razorpay
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
