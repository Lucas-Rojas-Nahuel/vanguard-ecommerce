"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart, cart } = useCart();
  const [added, setAdded] = useState(false);

  // Buscar si el producto ya está en el carrito para verificar su cantidad actual
  const cartItem = cart.find((item) => item.id === product.id);
  const currentQuantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    if (currentQuantity >= product.stock) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
    });

    // Feedback visual rápido de "¡Añadido!"
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isMaxedOut = currentQuantity >= product.stock;

  return (
    <button
      onClick={handleAdd}
      disabled={product.stock === 0 || isMaxedOut}
      className="w-full bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-400 disabled:cursor-not-allowed py-3 rounded-xl font-semibold text-sm transition shadow-sm cursor-pointer"
    >
      {product.stock === 0
        ? "Sin Stock"
        : isMaxedOut
          ? "Límite de stock alcanzado"
          : added
            ? "¡Añadido con éxito! ✓"
            : "Añadir al carrito"}
    </button>
  );
}
