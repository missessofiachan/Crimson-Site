'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { trackAddToCart, trackRemoveFromCart } from '@/lib/gtag';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load cart from localStorage when component mounts
  useEffect(() => {
    if (!isClient) return;

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch {
        // Silently handle localStorage parse errors
      }
    }
  }, [isClient]);

  // Memoized totals calculation
  const { totalItems, totalPrice } = useMemo(() => {
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const price = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return { totalItems: itemCount, totalPrice: price };
  }, [items]);

  // Save to localStorage with debouncing
  useEffect(() => {
    if (!isClient || items.length === 0) return;

    const timeoutId = setTimeout(() => {
      localStorage.setItem('cart', JSON.stringify(items));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [items, isClient]);

  const addToCart = useCallback((product: Omit<CartItem, 'quantity'>) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item._id === product._id);

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        return updatedItems;
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });

    trackAddToCart(product);
  }, []);

  const removeFromCart = useCallback(
    (itemId: string) => {
      const itemToRemove = items.find((item) => item._id === itemId);

      setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));

      if (itemToRemove) {
        trackRemoveFromCart(itemToRemove);
      }

      if (items.length === 1) {
        localStorage.removeItem('cart');
      }
    },
    [items]
  );

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) return;

    setItems((prevItems) =>
      prevItems.map((item) => (item._id === itemId ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem('cart');
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
