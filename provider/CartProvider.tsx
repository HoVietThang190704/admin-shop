"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { CartService } from "@/service/cart.service";
import { useAuth } from "./AuthProvider";
import { CartItem } from "@/lib/interface/cart.interface";
import { Product } from "@/lib/interface/product.interface";

interface CartContextType {
  cartCount: number;
  cartItems: CartItem[];
  cartTotal: number;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
  addToCart: (productId: string) => Promise<boolean>;
  decreaseQuantity: (productId: string) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<boolean>;
}

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  cartItems: [],
  cartTotal: 0,
  isLoading: false,
  refreshCart: async () => {},
  addToCart: async () => false,
  decreaseQuantity: async () => false,
  updateQuantity: async () => false,
  removeFromCart: async () => false,
});

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await CartService.getInstance().getCart();
      if (response.success && response.data) {
        setCartItems(response.data);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const product = item.product as Product;
      const price = typeof product === "object" ? product.price : 0;
      return acc + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const addToCart = async (productId: string) => {
    if (!user) return false;
    const response = await CartService.getInstance().addToCart(productId);
    if (response.success) {
      await refreshCart();
      return true;
    }
    return false;
  };

  const decreaseQuantity = async (productId: string) => {
    if (!user) return false;
    const response = await CartService.getInstance().decreaseQuantity(productId);
    if (response.success) {
      await refreshCart();
      return true;
    }
    return false;
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return false;
    if (quantity < 0) return false;
    const response = await CartService.getInstance().updateQuantity(productId, quantity);
    if (response.success) {
      await refreshCart();
      return true;
    }
    return false;
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return false;
    const response = await CartService.getInstance().removeFromCart(productId);
    if (response.success) {
      await refreshCart();
      return true;
    }
    return false;
  };

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        cartItems,
        cartTotal,
        isLoading,
        refreshCart,
        addToCart,
        decreaseQuantity,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
