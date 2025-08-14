
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getOrders } from './actions';
import { Loader2, Package, Utensils, Send, CheckCircle, Truck } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Order {
  _id: string;
  userId: string;
  cart: any[]; 
  totalPrice: number;
  paymentId: string;
  status: string;
  createdAt: string; 
}

const statusConfig = {
  'Paid': { icon: CheckCircle, color: 'bg-blue-100 text-blue-800' },
  'In the Kitchen': { icon: Utensils, color: 'bg-yellow-100 text-yellow-800' },
  'On its way': { icon: Truck, color: 'bg-orange-100 text-orange-800' },
  'Delivered': { icon: Send, color: 'bg-green-100 text-green-800' },
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          const userOrders = await getOrders(user.uid);
          setOrders(userOrders);
          setError(null);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch orders.');
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();

      // Poll for updates every 10 seconds
      const interval = setInterval(fetchOrders, 10000);
      return () => clearInterval(interval);
    }
    if (!authLoading && !user) {
        setLoading(false);
    }
  }, [user, authLoading]);

  const renderStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig] || { icon: Package, color: 'bg-gray-100 text-gray-800' };
    const Icon = config.icon;
    return (
        <Badge variant="secondary" className={`${config.color}`}>
            <Icon className="mr-2 h-4 w-4"/>
            {status}
        </Badge>
    );
  }

  const renderContent = () => {
    if (loading || authLoading) {
      return (
        <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      );
    }

    if (error) {
      return <div className="text-center text-destructive">{error}</div>;
    }

    if (orders.length === 0) {
      return (
        <div className="text-center py-20">
          <Package className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-semibold">No orders yet</h2>
          <p className="mt-2 text-muted-foreground">
            You haven't placed any orders. Let's change that!
          </p>
          <Button asChild className="mt-6">
            <Link href="/user">Start Crafting a Pizza</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order._id} className="shadow-md">
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <CardTitle>Order #{order._id.slice(-6)}</CardTitle>
                <CardDescription>
                  Placed on: {new Date(order.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">${order.totalPrice.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Payment ID: {order.paymentId.slice(-8)}</p>
              </div>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>View Details</AccordionTrigger>
                        <AccordionContent>
                           <ul className="space-y-2 text-sm">
                                {order.cart.map((pizza, index) => (
                                    <li key={index} className="p-2 rounded-md bg-muted/50">
                                        <p className="font-semibold">Custom Pizza #{index + 1}</p>
                                        <div className="pl-4 text-xs text-muted-foreground">
                                            {pizza.base && <p>Base: {pizza.base.name}</p>}
                                            {pizza.sauce && <p>Sauce: {pizza.sauce.name}</p>}
                                            {pizza.cheese && <p>Cheese: {pizza.cheese.name}</p>}
                                            {pizza.veggies.length > 0 && <p>Veggies: {pizza.veggies.map((v: any) => v.name).join(', ')}</p>}
                                            {pizza.meat.length > 0 && <p>Meat: {pizza.meat.map((m: any) => m.name).join(', ')}</p>}
                                        </div>
                                    </li>
                                ))}
                           </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
            <CardFooter>
                {renderStatusBadge(order.status)}
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-headline text-primary mb-6">
        My Orders
      </h1>
      {renderContent()}
    </div>
  );
}
