
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/hooks/use-auth';
import { CartProvider } from '@/hooks/use-cart';
import { ConditionalHeader } from '@/components/conditional-header';

export const metadata: Metadata = {
  title: 'ChefPizza',
  description: 'Craft your perfect pizza!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <CartProvider>
            <ConditionalHeader />
            {children}
          </CartProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
