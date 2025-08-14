'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle2 } from 'lucide-react';
import { CartButton } from './cart-button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function Header() {
  const { user, signOut, isAdmin } = useAuth();
  const router = useRouter();

  return (
    <header className="bg-background/50 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <Image src="/images/l.png" alt="ChefPizza Logo" width={32} height={32} />
          <span className="text-xl font-bold font-headline hidden sm:inline">
            ChefPizza
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <CartButton />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                    <AvatarFallback>
                        <UserCircle2 />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.displayName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem onClick={() => router.push('/admin')}>
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => router.push('/orders')}>
                  My Orders
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
