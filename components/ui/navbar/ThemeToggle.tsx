"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita errores de hidratación esperando a que el componente esté montado en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-9 h-9" />; // Espacio en blanco temporal del mismo tamaño

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition cursor-pointer text-neutral-800 dark:text-neutral-200"
      aria-label="Cambiar tema"
    >
      {theme === "dark" ? (
        // Icono de Sol ☀️
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.22 4.22l1.59 1.59m12.38 12.38l1.59 1.59M3 12h2.25m13.5 0H21M5.81 18.19l1.59-1.59m12.38-12.38l1.59-1.59M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" />
        </svg>
      ) : (
        // Icono de Luna 🌙
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 12.83A9.54 9.54 0 0 1 12.25 22.5c-5.25 0-9.5-4.25-9.5-9.5a9.54 9.54 0 0 1 9.03-9.5.5.5 0 0 1 .54.5c0 4.25 3.5 7.75 7.75 7.75a.5.5 0 0 1 .43.58Z" />
        </svg>
      )}
    </button>
  );
}