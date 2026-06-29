import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// 1. Action para agregar productos
async function addProduct(formData: FormData) {
  'use server'
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);

  const { error } = await supabase.from("products").insert([
    { name, description, price, stock }
  ]);

  if (!error) revalidatePath("/admin/products");
}

// 2. NUEVA ACTION: Borrar productos por ID
async function deleteProduct(formData: FormData) {
  'use server'
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (!error) {
    // Refresca tanto el panel de administración como la tienda pública
    revalidatePath("/admin/products");
    revalidatePath("/");
  }
}

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6 sm:p-10 text-neutral-900 dark:text-neutral-50">
      <div className="max-w-5xl mx-auto space-y-10">
        
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
          <p className="text-sm text-neutral-500">Gestiona el inventario de productos de tu tienda</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Formulario */}
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-sm">
            <h2 className="text-lg font-semibold tracking-tight">Nuevo Producto</h2>
            <form action={addProduct} className="space-y-3 text-sm">
              <div className="space-y-1">
                <label className="font-medium">Nombre</label>
                <input name="name" type="text" required className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-neutral-500" placeholder="Ej. Teclado Mecánico" />
              </div>
              <div className="space-y-1">
                <label className="font-medium">Descripción</label>
                <textarea name="description" required rows={3} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-neutral-500" placeholder="Detalles..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium">Precio ($)</label>
                  <input name="price" type="number" step="0.01" required className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-neutral-500" placeholder="99.99" />
                </div>
                <div className="space-y-1">
                  <label className="font-medium">Stock</label>
                  <input name="stock" type="number" required className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-neutral-500" placeholder="15" />
                </div>
              </div>
              <button type="submit" className="w-full bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 py-2 rounded-lg font-medium transition cursor-pointer mt-2">
                Guardar Producto
              </button>
            </form>
          </div>

          {/* Tabla de Inventario */}
          <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-lg font-semibold tracking-tight">Inventario Actual</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-neutral-100 dark:bg-neutral-800/50 text-neutral-500 font-medium">
                    <th className="p-4">Producto</th>
                    <th className="p-4">Precio</th>
                    <th className="p-4 text-center">Stock</th>
                    <th className="p-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {products?.map((product) => (
                    <tr key={product.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition">
                      <td className="p-4 font-medium max-w-[200px] truncate">
                        <div>{product.name}</div>
                        <div className="text-xs text-neutral-400 font-normal truncate">{product.description}</div>
                      </td>
                      <td className="p-4 font-semibold">${product.price}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'}`}>
                          {product.stock} u
                        </span>
                      </td>
                      {/* Formulario rápido para eliminar */}
                      <td className="p-4 text-center">
                        <form action={deleteProduct}>
                          <input type="hidden" name="id" value={product.id} />
                          <button type="submit" className="text-red-500 hover:text-red-700 font-medium cursor-pointer hover:underline text-xs">
                            Eliminar
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}   