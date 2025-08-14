
'use client';

import { useEffect, useState, useTransition } from 'react';
import { getInventory, InventoryItem, updateStock } from '../actions';
import { Button } from '@/components/ui/button';
import { Loader2, Package, TrendingDown, TrendingUp, Minus, Plus, Check } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function InventoryPage() {
  const { toast } = useToast();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // State to hold the temporary input values for stock
  const [stockInputs, setStockInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const inventoryItems = await getInventory();
        setInventory(inventoryItems);
        // Initialize stockInputs with current stock values
        const initialInputs = inventoryItems.reduce((acc, item) => {
            acc[item._id] = String(item.stock);
            return acc;
        }, {} as Record<string, string>)
        setStockInputs(initialInputs);

      } catch (error) {
        console.error("Failed to fetch inventory data", error);
        toast({ title: "Error", description: "Could not load inventory data.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, [toast]);

  const handleInputChange = (itemId: string, value: string) => {
    setStockInputs(prev => ({ ...prev, [itemId]: value }));
  };

  const handleStockUpdate = (itemId: string, newStockValue: string | number) => {
    const newStock = Number(newStockValue);
    if (isNaN(newStock) || newStock < 0) {
        toast({ title: "Invalid Input", description: "Please enter a valid, non-negative number.", variant: "destructive"});
        return;
    }

    startTransition(async () => {
        const result = await updateStock(itemId, newStock);
        if (result.success) {
            setInventory(prev => prev.map(item => item._id === itemId ? { ...item, stock: newStock } : item));
            // Also update the input state to reflect the saved value
            setStockInputs(prev => ({ ...prev, [itemId]: String(newStock) }));
            toast({ title: "Success", description: "Stock updated successfully." });
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
        }
    });
  };
  
  const renderStockBadge = (stock: number) => {
    if (stock > 20) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">{stock} <TrendingUp className="ml-2 h-4 w-4"/></Badge>;
    }
    if (stock >= 5) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">{stock}</Badge>;
    }
    return <Badge variant="destructive">{stock} <TrendingDown className="ml-2 h-4 w-4"/></Badge>;
  }

  const groupInventoryByType = (items: InventoryItem[]) => {
    return items.reduce((acc, item) => {
      const { type } = item;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(item);
      return acc;
    }, {} as Record<string, InventoryItem[]>);
  };

  const groupedInventory = groupInventoryByType(inventory);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Inventory Management</h1>
        <p className="text-lg text-muted-foreground">
          View and manage ingredient stock levels.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(groupedInventory).map(([type, items]) => (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="capitalize flex items-center gap-2">
                <Package className="h-6 w-6"/>
                {type}s
              </CardTitle>
              <CardDescription>Available stock for {type} items.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right pr-12">Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow 
                      key={item._id}
                      className={cn({
                        "bg-red-50 hover:bg-red-100": item.stock < 5,
                        "bg-yellow-50 hover:bg-yellow-100": item.stock >= 5 && item.stock < 20,
                      })}
                    >
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleStockUpdate(item._id, item.stock - 1)} disabled={item.stock === 0 || isPending}>
                            <Minus className="h-4 w-4"/>
                        </Button>
                        
                        <Input 
                            type="number"
                            value={stockInputs[item._id] ?? ''}
                            onChange={(e) => handleInputChange(item._id, e.target.value)}
                            onBlur={() => {
                                if (String(item.stock) !== stockInputs[item._id]) {
                                    handleStockUpdate(item._id, stockInputs[item._id])
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                     if (String(item.stock) !== stockInputs[item._id]) {
                                        handleStockUpdate(item._id, stockInputs[item._id])
                                    }
                                }
                            }}
                            className="w-16 h-8 text-center"
                            disabled={isPending}
                        />

                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleStockUpdate(item._id, item.stock + 1)} disabled={isPending}>
                            <Plus className="h-4 w-4"/>
                        </Button>
                        <div className="w-20 text-left ml-2">
                           {renderStockBadge(item.stock)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

