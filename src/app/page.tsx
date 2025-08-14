
'use client';

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';

const pizzaImages = [
  { src: '/images/a1.jpeg', alt: 'Delicious artisan pizza', hint: 'artisan pizza' },
  { src: '/images/a2.jpeg', alt: 'A fresh-made pizza', hint: 'fresh pizza' },
  { src: '/images/a3.jpeg', alt: 'A cheesy pizza on display', hint: 'cheesy pizza' },
  { src: '/images/a4.jpeg', alt: 'A pizza with various toppings', hint: 'pizza toppings' },
  { src: '/images/a5.jpeg', alt: 'Another delicious pizza', hint: 'delicious pizza' },
  { src: '/images/a6.jpeg', alt: 'A perfectly baked pizza', hint: 'baked pizza' },
];

export default function Home() {
  const { user } = useAuth();
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  return (
    <main className="-mt-16">
      <div className="relative h-screen w-full overflow-hidden">
        <Carousel
          plugins={[plugin.current]}
          className="absolute inset-0 w-full h-full"
          opts={{
            loop: true,
          }}
        >
          <CarouselContent className="h-full">
            {pizzaImages.map((img, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="relative h-full w-full">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={1920}
                    height={1080}
                    className="w-full h-full object-cover"
                    data-ai-hint={img.hint}
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center p-4 h-full text-white">
          <h1 className="text-4xl md:text-6xl font-bold font-headline text-white mb-4">
              Welcome to ChefPizza
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Your journey to the perfect pizza starts here. Let's get crafting!
          </p>
          <Button size="lg" asChild>
              <Link href={user ? "/user" : "/login"}>
                  Start Your Order
                  <ArrowRight className="ml-2" />
              </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
