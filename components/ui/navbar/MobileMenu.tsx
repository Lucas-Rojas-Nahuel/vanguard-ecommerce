"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoIosMenu, IoMdClose } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { createClient } from "@/lib/supabase/client"; // Ajusta la ruta a tu cliente de Supabase

interface MobileMenuProps {
  userEmail: string | null;
  isAdmin: boolean;
}

export default function MobileMenuComponent({
  userEmail,
  isAdmin,
}: MobileMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // 💡 Cerramos el menú automáticamente si el usuario cambia de página
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.refresh(); // Refresca los Server Components para actualizar el Navbar global
    router.push("/");
  };

  // Definimos los enlaces base del cliente
  const menuItems = [
    { label: "Inicio", href: "/" },
    { label: "Productos", href: "/product" },
    { label: userEmail ? "Mi Cuenta" : "Iniciar Sesión", href: "/login" },
    ...(isAdmin
      ? [
          { label: "Dashboard", href: "/admin" },
          { label: "Inventario", href: "/admin/products" },
        ]
      : []),
  ];

  return (
    <div className="lg:hidden flex items-center">
      {/* Botón Hamburguesa */}
      <button
        onClick={() => setMenuOpen((o) => !o)}
        className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors z-50 relative cursor-pointer"
        aria-label="Toggle menu"
      >
        {menuOpen ? <IoMdClose size={20} /> : <IoIosMenu size={20} />}
      </button>

      {/* Desplegable Fullscreen */}
      {menuOpen && (
        <div className="fixed top-16 left-0 right-0 bottom-0 h-[calc(100vh-64px)] z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md flex flex-col animate-in fade-in slide-in-from-top-2 duration-200 border-t border-neutral-100 dark:border-neutral-800">
          <div className="max-w-[430px] mx-auto w-full px-6 py-8 flex flex-col justify-between h-full">
            {/* Lista de Navegación */}
            <div className="flex flex-col">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-left py-4 text-xl font-medium tracking-tight text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 hover:text-neutral-500 transition-colors"
                >
                  {item.label}
                </Link>
              ))}

              {/* Botón de Cerrar Sesión */}
              {userEmail && (
                <button
                  onClick={handleSignOut}
                  className="text-left py-4 text-xl font-medium text-neutral-400 hover:text-red-500 transition-colors flex items-center gap-3 mt-2 cursor-pointer"
                >
                  <MdLogout size={18} /> Cerrar Sesión
                </button>
              )}
            </div>

            {/* Metadata inferior de la sesión */}
            {userEmail && (
              <p className="text-xs text-neutral-400 mt-auto">
                Sesión activa:{" "}
                <span className="text-neutral-900 dark:text-white font-medium">
                  {userEmail}
                </span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
