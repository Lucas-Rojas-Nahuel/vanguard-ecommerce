"use client";
import fmtPrice from "@/utils/products/fmtPrice";
import getStockInfo from "@/utils/products/getStockInfo";
import Link from "next/link";
import ProductCardButton from "./ProductCardButton";
 

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    images: string[];
    category_id: number;
  };
  categories: { id: number; name: string }[];
}

export default function ProductCard({
  product,
  categories,
}: {
  product: ProductCardProps["product"];
  categories: ProductCardProps["categories"];
}) {
  const { label, cls } = getStockInfo(product.stock);
  const category = categories.find((c) => c.id === product.category_id);

  console.log(category);
  return (
    <div className="bg-card border border-border rounded-sm hover:border-foreground/20 transition-colors flex lg:flex-col group">
      {/* Image */}
      <Link
        href={`/product/${product.id}`}
        className="w-16 h-16 lg:w-full lg:h-auto lg:aspect-square shrink-0 overflow-hidden bg-background border-r border-border lg:border-r-0 lg:border-b"
      >
        <img
          src={product.images[0] || "https://placehold.co/100x100?text=Tech"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
      </Link>

      {/* Info */}
      <div className="flex-1 p-3 lg:p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center justify-between gap-1.5 mb-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide truncate">
              {category?.name}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium   ${cls}`}
            >
              {label}
            </span>
          </div>
          <Link
            href={`/product/${product.id}`}
            className="text-sm font-medium text-foreground text-left leading-tight line-clamp-2 hover:text-muted-foreground transition-colors w-full"
          >
            {product.name}
          </Link>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-sm font-bold font-['Geist_Mono',monospace] text-foreground">
            {fmtPrice(product.price)}
          </span>
          <div className={"flex items-center gap-2"}>
            <ProductCardButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
