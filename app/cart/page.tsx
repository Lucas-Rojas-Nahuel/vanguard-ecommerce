"use client";

import { useCart, CartItem } from "../../context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount } =
    useCart();

  // Función para reducir la cantidad en 1 (reutiliza addToCart o maneja lógica directa)
  const handleDecrease = (item: CartItem) => {
    // Si la cantidad es 1, al restarle lo removemos por completo
    if (item.quantity === 1) {
      removeFromCart(item.id);
    } else {
      // Truco limpio: restamos mutando el contexto indirectamente a través de un set si tuviéramos decrementar,
      // pero como en nuestro contexto addToCart solo suma, podemos recrear la reducción vaciando e insertando,
      // o mejor lo manejamos con una función nativa del estado directamente en una próxima iteración.
      // Para esta versión simplificada, si es mayor a 1, modificamos la lógica del array aquí mismo si fuera necesario.
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 space-y-4 text-neutral-900 dark:text-neutral-50">
        <div className="text-5xl">🛒</div>
        <h1 className="text-2xl font-bold tracking-tight">
          Tu carrito está vacío
        </h1>
        <p className="text-neutral-500 text-sm max-w-xs">
          Parece que aún no has agregado ningún producto a tu orden.
        </p>
        <Link
          href="/"
          className="bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 px-5 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition inline-block"
        >
          Explorar tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-5">
          <h1 className="text-3xl font-bold tracking-tight">
            Tu Carrito ({cartCount})
          </h1>
          <button
            onClick={clearCart}
            className="text-xs text-red-500 hover:text-red-700 font-medium transition cursor-pointer hover:underline"
          >
            Vaciar carrito
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Precio unitario: ${item.price}
                  </p>
                </div>

                {/* Control de cantidad simplificado */}
                <div className="flex items-center gap-3 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-lg text-sm font-medium">
                  <span className="text-neutral-600 dark:text-neutral-300">
                    Cant: <span className="font-bold">{item.quantity}</span>
                  </span>
                </div>

                <div className="text-right space-y-1">
                  <p className="font-bold text-sm sm:text-base">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[11px] text-neutral-400 hover:text-red-500 transition cursor-pointer"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen del Pedido */}
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold tracking-tight">
              Resumen de Compra
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal ({cartCount} productos)</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Envío</span>
                <span className="text-emerald-600 font-medium">Gratis</span>
              </div>
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 flex justify-between font-bold text-base">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() =>
                alert(
                  "🚀 ¡Próximamente: Pasarela de pagos e integración con Stripe!",
                )
              }
              className="w-full bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 py-3 rounded-xl font-semibold text-sm transition hover:opacity-90 shadow-sm cursor-pointer"
            >
              Continuar al pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
