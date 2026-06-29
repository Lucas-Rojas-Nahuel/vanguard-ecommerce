import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  // 1. Desenvolver los params asíncronos (Estándar de Next.js reciente)
  const { id } = await params;
  const supabase = await createClient();

  // 2. Consultar el producto específico por su ID
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  // 3. Si el producto no existe en la BD, lanzar pantalla 404 nativa
  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Botón para volver atrás */}
        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition inline-flex items-center gap-1">
          ← Volver al catálogo
        </Link>

        {/* Contenedor principal del detalle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm items-center">
          
          {/* Lado Izquierdo: Placeholder de Imagen Premium */}
          <div className="aspect-square w-full rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border border-neutral-200 dark:border-neutral-700">
            <span className="text-neutral-400 text-sm font-medium">Sin imagen (Próximamente)</span>
          </div>

          {/* Lado Derecho: Información de Compra */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${product.stock > 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'}`}>
                {product.stock > 0 ? `Stock Disponible: ${product.stock} u` : 'Agotado'}
              </span>
              <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            </div>

            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
              {product.description}
            </p>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Precio Final</p>
                <p className="text-4xl font-extrabold tracking-tight">${product.price}</p>
              </div>
            </div>

            {/* Botón de acción (Estético por ahora, listo para el carrito) */}
            <button 
              disabled={product.stock === 0}
              className="w-full bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-400 disabled:cursor-not-allowed py-3 rounded-xl font-semibold text-sm transition shadow-sm cursor-pointer"
            >
              {product.stock > 0 ? 'Añadir al carrito' : 'Sin Stock'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}