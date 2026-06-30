'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Estructura de un producto dentro del carrito
export interface CartItem {
  id: string
  name: string
  price: number
  stock: number
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  // 1. Cargar el carrito desde LocalStorage al iniciar la app (solo en el cliente)
  useEffect(() => {
    const savedCart = localStorage.getItem('vanguard_cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error("Error cargando el carrito desde localStorage", e)
      }
    }
  }, [])

  // 2. Guardar en LocalStorage cada vez que el carrito cambie
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('vanguard_cart', JSON.stringify(cart))
    } else {
      localStorage.removeItem('vanguard_cart')
    }
  }, [cart])

  // 3. Función para añadir productos
  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)

      if (existingItem) {
        // Validar que no supere el stock máximo que viene de Supabase
        if (existingItem.quantity >= product.stock) return prevCart
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }

      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  // 4. Función para remover un producto completo
  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  // 5. Vaciar el carrito
  const clearCart = () => setCart([])

  // Cálculos dinámicos
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe ser usado dentro de un CartProvider')
  return context
}