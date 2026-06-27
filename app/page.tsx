import { createClient } from "@/lib/supabase/server";
import { Logout } from "./(auth)/actions";

export default async function HomePage() {
  const supabase = await createClient();

  // 1. Obtener el usuario autenticado actual desde la cookie
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Extraer el nombre directamente de la metadata de la sesión (Sin pegarle a la BD)
  const fallbackName = user?.user_metadata?.full_name || "Usuario";

  // 3. Traer los productos (tu consulta de la Fase 1)
  const { data: products } = await supabase.from("products").select("*");

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
      {/* NAVBAR MINIMALISTA */}
      <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="font-bold tracking-tight text-lg">
            Vanguard <span className="text-neutral-400 font-normal">Shop</span>
          </a>

          <nav className="flex items-center gap-4 text-sm font-medium">
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
                <a href="/login" className="hover:underline">
                  Iniciar Sesión
                </a>
                <a
                  href="/register"
                  className="bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 px-3 py-1.5 rounded-lg transition"
                >
                  Registrarse
                </a>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL: CATÁLOGO */}
      <main className="max-w-6xl mx-auto p-6 mt-6 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Catálogo de Tecnología
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products?.map((product) => (
            <div
              key={product.id}
              className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-5 space-y-3 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold">${product.price}</span>
                <span className="text-xs text-neutral-500">
                  Stock: {product.stock}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
