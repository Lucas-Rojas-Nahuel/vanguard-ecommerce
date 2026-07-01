import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Logout } from "../../../app/(auth)/actions";
import CartIcon from "./CartIcon";
import ThemeToggle from "./ThemeToggle";
import NavLinks from "./NavLinks";
import NavSearch from "./NavSearch";
import { MdLogout } from "react-icons/md";
import { IoShieldOutline } from "react-icons/io5";
import MobileMenuComponent from "./MobileMenu";

export default async function Navbar() {
  const supabase = await createClient();

  // 1. Obtenemos el usuario de la sesión
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  // 1. Obtenemos el usuario de la sesión de cookies
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;

  // 2. Si hay usuario, verificamos su rol en la tabla de perfiles
  if (authUser) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authUser.id)
      .single();

    if (profile?.role === "admin") {
      isAdmin = true;
    }
  }

  return (
    <nav className=" mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
      <div className="w-full mx-auto h-full flex items-center justify-between lg:px-4 lg:px-6 gap-1  lg:gap-2">
        {/* logo */}
        <Link href="/" className="flex gap-1 font-bold tracking-tight text-lg">
          Vanguard{" "}
          <span className="hidden min-[425px]:block  text-neutral-400 font-normal">
            Shop
          </span>
        </Link>

        {/* Desktop center nav */}
        <NavLinks />

        {/* Desktop search */}
        <NavSearch />

        {/* Enlaces de navegación derecha */}
        <div className="flex items-center gap-1 lg:gap-2">
          {/* darkmode toggle */}
          <ThemeToggle />
          {/* BOTÓN DEL CARRITO DINÁMICO */}
          <CartIcon />

          {/* Aquí van tus botones previos de Login / Admin / Logout */}
          <div className="hidden lg:flex items-center ml-1">
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-700 rounded-lg transition-colors bg-neutral-50 dark:bg-neutral-800"
                  >
                    <IoShieldOutline size={12} /> Dashboard
                  </Link>
                )}

                {/* Formulario nativo para ejecutar la Server Action de Logout */}
                <form action={Logout}>
                  <button
                    type="submit"
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <MdLogout size={15} />
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center content-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-sm hover:opacity-90 transition-opacity"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-sm hover:opacity-90 transition-opacity"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
          {/* INTERFAZ MÓVIL: El botón hamburguesa y panel flotante */}
          <MobileMenuComponent
            userEmail={authUser?.email || null}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </nav>
  );
}
