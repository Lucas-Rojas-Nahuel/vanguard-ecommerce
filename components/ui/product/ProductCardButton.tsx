"use client";

import { useState } from "react";

import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { useCart } from "@/context/CartContext";

interface ProductCardButtonProps {
  product: {
    id: string | number;
    name: string;
    price: number;
    stock: number;
    image?: string;
  };
}

export default function ProductCardButton({ product }: ProductCardButtonProps) {
  const { cart, addToCart, decreaseQuantity } = useCart();

  // 🔎 Buscamos si este producto específico ya está en el carrito global
  const cartItem = cart.find((item) => item.id === String(product.id));
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentQuantity < product.stock) {
      addToCart({
        id: String(product.id),
        name: product.name,
        price: product.price,
        stock: product.stock,
      });
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentQuantity > 0) {
      decreaseQuantity(String(product.id));
      // Si la cantidad que va a quedar es 0, le avisamos al padre para que reactive el badge
    }
  };

  // Botón inicial de agregar (+)
  if (currentQuantity === 0) {
    return (
      <button
        onClick={handleIncrement}
        disabled={product.stock === 0}
        className="w-8 h-8 flex items-center justify-center bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        aria-label="Agregar al carrito"
      >
        <FaPlus size={14} />
      </button>
    );
  }

  // Si la cantidad es mayor a 0, transformamos el botón en un selector expandido
  return (
    <div
      className="flex items-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg h-8 px-1 w-24 justify-between shadow-sm animate-in fade-in zoom-in-95 duration-100 shrink-0"
      onClick={(e) => e.preventDefault()}
    >
      <button
        onClick={handleDecrement}
        className="w-6 h-6 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-neutral-700 rounded-md transition-colors cursor-pointer"
      >
        <FaMinus size={12} />
      </button>

      <span className="text-xs font-semibold font-mono text-neutral-900 dark:text-white min-w-[14px] text-center select-none">
        {currentQuantity}
      </span>

      <button
        onClick={handleIncrement}
        disabled={currentQuantity >= product.stock}
        className="w-6 h-6 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-neutral-700 rounded-md transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <FaPlus size={12} />
      </button>
    </div>
  );
}
