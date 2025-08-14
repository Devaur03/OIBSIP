
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { PizzaOption } from '@/lib/data';

interface PizzaConfig {
  id: string;
  base: PizzaOption | null;
  sauce: PizzaOption | null;
  cheese: PizzaOption | null;
  veggies: PizzaOption[];
  meat: PizzaOption[];
  price: number;
}

interface CartContextType {
  cart: PizzaConfig[];
  addToCart: (pizza: Omit<PizzaConfig, 'id' | 'price'>) => void;
  removeFromCart: (pizzaId: string) => void;
  clearCart: () => void;
  totalPrice: number;
  cartCount: number;
  isClient: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<PizzaConfig[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedCart = localStorage.getItem('pizzaCart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
        localStorage.setItem('pizzaCart', JSON.stringify(cart));
    }
  }, [cart, isClient]);
  
  const calculatePrice = (pizza: Omit<PizzaConfig, 'id' | 'price'>) => {
    const basePrice = pizza.base?.price || 0;
    const saucePrice = pizza.sauce?.price || 0;
    const cheesePrice = pizza.cheese?.price || 0;
    const veggiesPrice = pizza.veggies.reduce((acc, veggie) => acc + veggie.price, 0);
    const meatPrice = pizza.meat.reduce((acc, meat) => acc + meat.price, 0);
    return basePrice + saucePrice + cheesePrice + veggiesPrice + meatPrice;
  };

  const addToCart = (pizza: Omit<PizzaConfig, 'id' | 'price'>) => {
    const newPizza = {
      ...pizza,
      id: crypto.randomUUID(),
      price: calculatePrice(pizza)
    };
    setCart(prevCart => [...prevCart, newPizza]);
  };

  const removeFromCart = (pizzaId: string) => {
    setCart(prevCart => prevCart.filter(pizza => pizza.id !== pizzaId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalPrice = cart.reduce((total, pizza) => total + pizza.price, 0);
  const cartCount = cart.length;

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalPrice, cartCount, isClient }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
