import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  // 1. Inicializar el cliente de Supabase para Servidor
  const supabase = await createClient();

  // 2. Hacer la consulta directamente a PostgreSQL (sin pasar por una API externa)
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true);

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error al cargar productos: {error.message}
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Mi Tienda de Tecnología
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products?.map((product) => (
          <div
            key={product.id}
            className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 space-y-3 shadow-sm hover:shadow-md transition"
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
  );
}
