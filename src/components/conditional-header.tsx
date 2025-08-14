'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { useState, useEffect } from 'react';

const NO_HEADER_PAGES = ['/login', '/signup', '/forgot-password'];

export function ConditionalHeader() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  if (NO_HEADER_PAGES.includes(pathname)) {
    return null;
  }
  
  if (!isClient) {
    return null;
  }

  return <Header />;
}
