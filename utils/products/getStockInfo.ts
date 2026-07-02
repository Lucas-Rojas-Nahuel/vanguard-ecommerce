export default function getStockInfo(stock: number) {
  if (stock === 0)
    return { label: "Sin stock", cls: "text-red-500 bg-red-500/10" };
  if (stock <= 3)
    return {
      label: `Solo ${stock} en stock`,
      cls: "text-amber-500 bg-amber-500/10",
    };
  return {
    label: `${stock} disponibles`,
    cls: "text-emerald-500 bg-emerald-500/10",
  };
}
