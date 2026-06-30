
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Logout } from "../../../app/(auth)/actions";
import CartIcon from "./CartIcon";

export default async function Navbar() {
   

  const supabase = await createClient();

  // 1. Obtener el usuario autenticado actual desde la cookie
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Extraer el nombre directamente de la metadata de la sesión (Sin pegarle a la BD)
  const fallbackName = user?.user_metadata?.full_name || "Usuario";

  return (
    <nav className="flex items-center gap-4 text-sm font-medium">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Enlaces de navegación derecha */}
        <div className="flex items-center gap-6 text-sm font-medium">
          {/* BOTÓN DEL CARRITO DINÁMICO */}
          <CartIcon/>

          {/* Aquí van tus botones previos de Login / Admin / Logout */}
          {user ? (
            <>
              <span className="text-neutral-500 dark:text-neutral-400">
                Hola,{" "}
                <strong className="text-neutral-900 dark:text-neutral-100">
                  {fallbackName ? fallbackName : "Usuario"}
                </strong>
              </span>

              {/* Formulario nativo para ejecutar la Server Action de Logout */}
              <form action={Logout}>
                <button
                  type="submit"
                  className="text-red-500 hover:underline cursor-pointer"
                >
                  Cerrar sesión
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 px-3 py-1.5 rounded-lg transition"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
