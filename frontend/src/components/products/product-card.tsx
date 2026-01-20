"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Trash2, Edit } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  stockQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const price = parseFloat(product.price);
  const isOutOfStock = product.stockQuantity === 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative w-full h-48 bg-gray-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">Sem imagem</span>
          </div>
        )}
        <Badge
          variant={isOutOfStock ? "destructive" : "default"}
          className="absolute top-2 right-2"
        >
          {isOutOfStock ? "Fora de estoque" : `${product.stockQuantity} em estoque`}
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
            <CardDescription>{product.category}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">
            R$ {price.toFixed(2)}
          </span>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex gap-2 pt-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onEdit(product)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onDelete(product.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Deletar
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
