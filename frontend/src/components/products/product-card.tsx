import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import type { Product } from "./products-page";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`;
          }}
        />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-xl">{product.name}</CardTitle>
          <span className="inline-flex shrink-0 items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            {product.category}
          </span>
        </div>
        <CardDescription className="line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">
            R$ {product.price.toFixed(2)}
          </span>
        </div>
        {product.quantity_stock !== undefined && (
          <p className="mt-2 text-sm text-gray-600">
            Estoque: {product.quantity_stock} unidades
          </p>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-2">
          <button className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
            Ver Detalhes
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
