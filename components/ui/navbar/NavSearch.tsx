"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function NavSearch() {
  const [navSearch, setNavSearch] = useState("");
  const router = useRouter();

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault();

    //si está vacio, lo mandamos al catálogo limpio
    if (!navSearch.trim()) {
      router.push("/products");
      return;
    }

    //codificamos el texto para que sea seguro en la URL (ej: "teclado mecanico" -> "teclado%20mecanico")
    const query = encodeURIComponent(navSearch.trim());

    //redirigimos a la página de productos con  el Queryt Parameter
    router.push(`/products?search=${query}`);
  };

  return (
    <form
      onSubmit={handleNavSearch}
      className="flex flex-1 max-w-[280px] relative"
    >
      <FaSearch
        size={13}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
      />
      <input
        type="text"
        value={navSearch}
        onChange={(e) => setNavSearch(e.target.value)}
        placeholder="Buscar hardware..."
        className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-colors"
      />
    </form>
  );
}
