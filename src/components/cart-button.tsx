
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

export function CartButton() {
    const { cartCount } = useCart();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        // Render a placeholder or nothing on the server
        return (
            <Button asChild variant="ghost" size="icon">
                <Link href="/cart">
                    <ShoppingCart />
                    <span className="sr-only">View Cart</span>
                </Link>
            </Button>
        );
    }

    return (
        <Button asChild variant="ghost" size="icon">
            <Link href="/cart">
                <div className="relative">
                    <ShoppingCart />
                    {cartCount > 0 && (
                        <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                    <span className="sr-only">View Cart</span>
                </div>
            </Link>
        </Button>
    );
}
