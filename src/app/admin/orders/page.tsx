
'use client';

import { useEffect, useState, useTransition } from 'react';
import { getRecentOrders, updateOrderStatus, Order } from '../actions';
import { Button } from '@/components/ui/button';
import { Loader2, Utensils, Send, CheckCircle, Truck } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast';

export default function OrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const recentOrders = await getRecentOrders();
        setOrders(recentOrders);
      } catch (error) {
        console.error("Failed to fetch order data", error);
        toast({ title: "Error", description: "Could not load order data.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [toast]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
     startTransition(async () => {
        const result = await updateOrderStatus(orderId, newStatus);
        if (result.success) {
            setOrders(prev => prev.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
            toast({ title: "Success", description: "Order status updated." });
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
        }
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const statusIcons: Record<string, React.ReactNode> = {
    'Paid': <CheckCircle className="mr-2 h-4 w-4 text-green-600" />,
    'In the Kitchen': <Utensils className="mr-2 h-4 w-4" />,
    'On its way': <Truck className="mr-2 h-4 w-4" />,
    'Delivered': <Send className="mr-2 h-4 w-4" />,
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Order Management</h1>
            <p className="text-lg text-muted-foreground">
              Track and manage incoming customer orders.
            </p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>A list of the last 20 orders placed.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map(order => (
                            <TableRow key={order._id}>
                                <TableCell className="font-mono text-xs">...{order._id.slice(-6)}</TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                                <TableCell className="text-center">
                                    <Select
                                        value={order.status}
                                        onValueChange={(newStatus) => handleStatusChange(order._id, newStatus)}
                                        disabled={isPending}
                                    >
                                        <SelectTrigger className="w-[200px] mx-auto">
                                            <SelectValue placeholder="Set Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="In the Kitchen">
                                                <div className="flex items-center">
                                                    <Utensils className="mr-2 h-4 w-4"/> In the Kitchen
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="On its way">
                                                <div className="flex items-center">
                                                    <Truck className="mr-2 h-4 w-4"/> On its way
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="Delivered">
                                                 <div className="flex items-center">
                                                    <Send className="mr-2 h-4 w-4"/> Delivered
                                                 </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
