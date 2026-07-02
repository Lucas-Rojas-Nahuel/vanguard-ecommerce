import ProductCard from "@/components/ui/product/ProductCard";
import { createClient } from "@/lib/supabase/server";

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

export default async function HomePage() {
  const supabase = await createClient();

  // 1. Obtener el usuario autenticado actual desde la cookie
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Traer los productos ordenados del más nuevo al más viejo
  const { data: latestProducts } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);

  // 📡 Pedimos a Supabase el producto con mayor puntuación
  const { data: featuredProduct } = await supabase
    .from("products")
    .select("*")
    .order("rating", { ascending: false }) // Del más alto al más bajo
    .limit(1) // Solo queremos el número 1
    .single();

  // 4. Traer las categorías para poder mostrar el nombre de la categoría en cada producto
  const { data: categories } = await supabase.from("categories").select("*");

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
      <main className="max-w-6xl mx-auto p-6 mt-6 space-y-6">
        {/* CONTENIDO PRINCIPAL: HERO SECTION */}
        <section className=" py-10 lg:py-0 lg:min-h-[calc(100vh-64px)] lg:flex lg:items-center border-b border-border">
          <div className="lg:grid lg:grid-cols-[55%_45%] lg:gap-16 lg:items-center w-full lg:py-10">
            {/* Left: text */}
            <div>
              <span className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase font-['Geist_Mono',monospace] block mb-4">
                Tecnología Premium · Desde 2024
              </span>
              <h1 className="text-[2.2rem] lg:text-5xl font-bold leading-[1.1] tracking-tight text-foreground mb-5">
                Hardware de
                <br />
                Última
                <br className="hidden lg:block" /> Generación.
              </h1>
              <p className="text-sm lg:text-base text-muted-foreground leading-relaxed mb-8 max-w-[460px]">
                Componentes, portátiles y periféricos de primera línea. Envío
                express en 24&nbsp;h, garantía oficial de fábrica y soporte
                técnico especializado.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={"/product"}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold tracking-wide rounded-sm hover:opacity-90 transition-opacity"
                >
                  Explorar Catálogo <FaArrowRight size={15} />
                </Link>
              </div>
              {/* Stats - desktop only */}
              <div className="hidden lg:flex items-center gap-8 mt-12 pt-8 border-t border-border">
                {[
                  ["2,400+", "Clientes"],
                  ["48h", "Envío Max"],
                  ["100%", "Garantía"],
                ].map(([val, lbl]) => (
                  <div key={lbl}>
                    <p className="text-2xl font-bold font-['Geist_Mono',monospace] text-foreground">
                      {val}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {lbl}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* right: Visual */}
            <div className="hidden lg:block">
              <div className="relative">
                {featuredProduct && (
                  <>
                    <div className="aspect-square bg-card border border-border rounded-sm overflow-hidden">
                      <img
                        src={
                          featuredProduct.images[0] ||
                          "https://placehold.co/100x100?text=Tech"
                        }
                        alt={featuredProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Floating card */}
                    <Link
                      href={`/product/${featuredProduct.id}`}
                      className="absolute -bottom-4 -left-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xl flex items-center gap-4 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300 group"
                    >
                      {/* Miniatura del Producto */}
                      <div className="w-12 h-12 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden shrink-0">
                        <img
                          // Usamos un fallback por si no tiene imagen en la base de datos todavía
                          src={
                            featuredProduct.image ||
                            "https://placehold.co/100x100?text=Tech"
                          }
                          alt={featuredProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>

                      {/* Textos Informativos */}
                      <div className="flex flex-col min-w-[140px]">
                        <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate max-w-[160px]">
                          {featuredProduct.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                              featuredProduct.stock > 0
                                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {featuredProduct.stock > 0
                              ? "En stock"
                              : "Sin Stock"}
                          </span>
                          {/* Badge de Rating Destacado */}
                          <span className="text-[10px] bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-sm font-medium flex items-center gap-0.5">
                            ★ {featuredProduct.rating}
                          </span>
                        </div>
                      </div>

                      {/* Precio formateado al estilo Geist Mono */}
                      <span className="ml-2 text-sm font-bold font-mono text-neutral-900 dark:text-white">
                        ${featuredProduct.price.toLocaleString("es-AR")}
                      </span>
                    </Link>{" "}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ultimos lanzamientos */}
        <section className="py-12">
          <div className="flex items-center justify-between mb-7">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">
              Últimos Lanzamientos
            </h2>
            <Link
              href={"/product"}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Ver todo <FaArrowRight size={12} />
            </Link>
          </div>
          {/* Mobile: list, Desktop: 4-col grid */}
          <div className="flex flex-col gap-2.5 lg:hidden">
            {latestProducts && (
              <>
                {latestProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    categories={
                      (categories as { id: number; name: string }[]) ?? []
                    }
                  />
                ))}
              </>
            )}
          </div>
          <div className="hidden lg:grid lg:grid-cols-4 gap-5">
            {latestProducts && (
              <>
                {latestProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    categories={
                      (categories as { id: number; name: string }[]) ?? []
                    }
                  />
                ))}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
