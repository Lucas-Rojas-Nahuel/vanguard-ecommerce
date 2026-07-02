import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SeedPage() {
  // 1. Opcional: Validar que el usuario sea Admin para que nadie use este endpoint
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return (
      <div className="p-10 text-red-500 font-bold">
        Acceso denegado. Solo administradores.
      </div>
    );
  }

  // 2. Acción del servidor para ejecutar el clonado
  async function importFromMercadoLibre() {
    "use server";
    const supabaseClient = await createClient();

    try {
      // Array actualizado con Categoria y Rating
      const mockProducts = [
        {
          name: "Teclado Mecánico Redragon Mitra K551",
          description:
            "Teclado mecánico ideal para gaming. Switch Blue de alta respuesta táctil, retroiluminación RGB ajustable y chasis de aluminio ultra resistente. Distribución en español.",
          price: 54900.0,
          stock: 15,
          category_name: "Periféricos",
          rating: 4.7,
        },
        {
          name: 'Monitor Gamer Samsung Odyssey G3 24"',
          description:
            "Monitor de 24 pulgadas FHD con tasa de refresco de 144Hz y 1ms de tiempo de respuesta. Compatible con AMD FreeSync Premium para partidas sin cortes.",
          price: 289000.0,
          stock: 8,
          category_name: "Monitores",
          rating: 4.5,
        },
        {
          name: "Mouse Logtech G305 Lightspeed Wireless",
          description:
            "Mouse inalámbrico para juegos con sensor HERO de próxima generación de 12.000 DPI. Increíble duración de batería de hasta 250 horas con una sola pila AA.",
          price: 42000.0,
          stock: 25,
          category_name: "Periféricos",
          rating: 4.8,
        },
        {
          name: "Auriculares HyperX Cloud Flight Wireless",
          description:
            "Auriculares inalámbricos para gaming de larga duración (hasta 30 horas). Almohadillas de espuma con memoria Memory Foam y micrófono desmontable con cancelación de ruido.",
          price: 115000.0,
          stock: 12,
          category_name: "Audio",
          rating: 4.6,
        },
        {
          name: "Notebook ASUS Vivobook 15 Intel i5",
          description:
            "Laptop ideal para productividad y estudio. Procesador Intel Core i5 de 12va generación, 16GB de Memoria RAM, 512GB SSD NVMe y pantalla de 15.6 pulgadas Full HD.",
          price: 899000.0,
          stock: 5,
          category_name: "Laptops",
          rating: 4.3,
        },
        {
          name: "Gabinete Corsair 4000D Airflow Black",
          description:
            "Gabinete Mid-Tower ATX con un panel frontal optimizado para un flujo de aire masivo. Gestión de cables RapidRoute y dos ventiladores AirGuide incluidos.",
          price: 98000.0,
          stock: 10,
          category_name: "Componentes",
          rating: 4.4,
        },
        {
          name: "Memoria RAM Kingston Fury Beast 16GB DDR4",
          description:
            "Módulo de memoria RAM de 16GB (1x16GB) corriendo a 3200MHz. Diseño de disipador de perfil bajo optimizado para Intel y AMD Ryzen.",
          price: 36500.0,
          stock: 40,
          category_name: "Componentes",
          rating: 4.7,
        },
        {
          name: "Placa de Video MSI NVIDIA RTX 4060 Ventus 2X",
          description:
            "Tarjeta gráfica de última generación con 8GB GDDR6. Arquitectura Ada Lovelace con trazado de rayos (Ray Tracing) y tecnología DLSS 3.0 de inteligencia artificial.",
          price: 460000.0,
          stock: 6,
          category_name: "Componentes",
          rating: 4.9,
        },
      ];

      // Procesamos producto por producto de manera secuencial para resolver las IDs de categorías
      for (const item of mockProducts) {
        // 1. Intentamos insertar la categoría. Si ya existe, 'upsert' no hace nada gracias al campo 'unique'
        // .select().single() nos devuelve el registro creado o existente de inmediato
        const { data: categoryData, error: catError } = await supabaseClient
          .from("categories")
          .upsert({ name: item.category_name }, { onConflict: "name" })
          .select()
          .single();

        if (catError || !categoryData) {
          console.error(
            `Error procesando categoría ${item.category_name}:`,
            catError,
          );
          continue; // Si falla la categoría, saltamos al siguiente producto para evitar romper todo
        }

        // 2. Preparamos el objeto final sustituyendo 'category_name' por el ID recién obtenido
        const finalProduct = {
          name: item.name,
          description: item.description,
          price: item.price,
          stock: item.stock,
          rating: item.rating,
          category_id: categoryData.id, // 🔗 Vinculamos la foreign key
        };

        // 3. Insertamos el producto final en la base de datos
        const { error: prodError } = await supabaseClient
          .from("products")
          .insert(finalProduct);

        if (prodError) {
          console.error(`Error insertando producto ${item.name}:`, prodError);
        }
      }

      console.log("¡Inyección inteligente finalizada!");
    } catch (error) {
      console.error("Error general en el seeding:", error);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-6 space-y-4">
      <div className="max-w-md text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Inyector de Catálogo ML
        </h1>
        <p className="text-sm text-neutral-400">
          Al pulsar el botón, traeremos los 20 productos más vendidos de la
          sección de Computación de MercadoLibre directamente a tu tienda
          virtual.
        </p>
      </div>

      <form action={importFromMercadoLibre}>
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded-xl transition shadow-md cursor-pointer text-sm"
        >
          🗲 Importar 20 Productos Reales
        </button>
      </form>
    </div>
  );
}
