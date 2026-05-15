import { useMemo, useState } from 'react';
import { addCartItem, clearRemoteCart } from './cartApi';
import { getSession } from '../auth/authSession';

export function useCart() {
  const [cart, setCart] = useState([]);

  function isClientSession() {
    return getSession()?.backendRole === 'client';
  }

  function addToCart(restaurant, item) {
    setCart((prev) => {
      const key = `${restaurant.id}:${item.id}`;
      const existing = prev.find((line) => line.id === key);

      if (existing) {
        return prev.map((line) =>
          line.id === key ? { ...line, qty: line.qty + 1 } : line,
        );
      }

      return [
        ...prev,
        {
          id: key,
          itemId: item.id,
          name: item.name,
          price: item.price,
          qty: 1,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
        },
      ];
    });

    if (isClientSession()) {
      addCartItem(item.id, 1).catch(() => {
        // Le panier local reste fonctionnel meme si l'API ne repond pas.
      });
    }
  }

  function updateQty(id, qty) {
    if (qty <= 0) {
      setCart((prev) => prev.filter((line) => line.id !== id));
      return;
    }

    setCart((prev) => prev.map((line) => (line.id === id ? { ...line, qty } : line)));
  }

  function removeItem(id) {
    setCart((prev) => prev.filter((line) => line.id !== id));
  }

  function clearCart() {
    setCart([]);

    if (isClientSession()) {
      clearRemoteCart().catch(() => {
        // Le panier local est vide, meme si le clear remote echoue.
      });
    }
  }

  const cartCount = useMemo(() => cart.reduce((sum, line) => sum + line.qty, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((sum, line) => sum + line.qty * line.price, 0), [cart]);

  return {
    cart,
    addToCart,
    updateQty,
    removeItem,
    clearCart,
    cartCount,
    cartTotal,
  };
}
