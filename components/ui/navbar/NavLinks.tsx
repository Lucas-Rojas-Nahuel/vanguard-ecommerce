"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const pathname = usePathname(); // 👈 Esto lee la URL actual (ej: "/", "/products", "/cart")

  // Definimos tus enlaces en un array para no repetir código
  const links = [
    { href: "/", label: "Inicio" },
    { href: "/products", label: "Productos" },
  ];

  return (
    <div className="hidden lg:flex items-center gap-1">
      {links.map((link) => {
        // Verificamos si la URL actual coincide exactamente con el enlace
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-colors ${
              isActive
                ? "text-neutral-900 dark:text-white font-semibold underline underline-offset-4 decoration-2" // Estilo cuando está ACTIVO
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white" // Estilo cuando está INACTIVO
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}