
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Loader2, Package,ClipboardList } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null; // Auth hook handles redirection
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Admin Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Welcome, {user.displayName || 'Admin'}! Manage your store here.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <ClipboardList className="h-6 w-6 text-accent"/>
              Manage Orders
            </CardTitle>
            <CardDescription>View and update the status of recent customer orders.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end">
            <Button asChild>
              <Link href="/admin/orders">Go to Orders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Package className="h-6 w-6 text-accent"/>
              Manage Inventory
            </CardTitle>
            <CardDescription>View and adjust stock levels for all ingredients.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end">
            <Button asChild>
              <Link href="/admin/inventory">Go to Inventory</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
