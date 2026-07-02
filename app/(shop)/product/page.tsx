import { createClient } from "@/lib/supabase/server";
 
import Link from "next/link";

export default async function Products() {
  const supabase = await createClient();

  // 1. Obtener el usuario autenticado actual desde la cookie
  const {
    data: { user },
  } = await supabase.auth.getUser();

  
  // 3. Traer los productos ordenados del más nuevo al más viejo
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
      {/* CONTENIDO PRINCIPAL: CATÁLOGO */}
      <main className="max-w-6xl mx-auto p-6 mt-6 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Catálogo de Tecnología
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products?.map((product) => (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className="group border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-5 space-y-3 shadow-sm hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition cursor-pointer"
            >
              <h2 className="text-xl font-semibold group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition">
                {product.name}
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold">${product.price}</span>
                <span className="text-xs text-neutral-500">
                  Stock: {product.stock}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
