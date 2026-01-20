"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { Product } from "./products-page";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (product: Omit<Product, "id">) => void;
}

export function ProductFormDialog({
  open,
  onOpenChange,
  onSubmit,
}: ProductFormDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    if (!formData.category.trim()) {
      newErrors.category = "Categoria é obrigatória";
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Preço deve ser maior que zero";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    }
    if (!formData.image.trim()) {
      newErrors.image = "URL da imagem é obrigatória";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      description: formData.description,
      image: formData.image,
    });

    // Reset form
    setFormData({
      name: "",
      category: "",
      price: "",
      description: "",
      image: "",
    });
    setErrors({});
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
          <DialogDescription>
            Preencha os campos para cadastrar um novo produto
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Ex: Notebook Dell"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              placeholder="Ex: Eletrônicos"
            />
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              placeholder="Ex: 3500.00"
            />
            {errors.price && (
              <p className="text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("description", e.target.value)}
              placeholder="Descreva o produto..."
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">URL da Imagem *</Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => handleChange("image", e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
            />
            {errors.image && (
              <p className="text-sm text-red-600">{errors.image}</p>
            )}
            <p className="text-xs text-gray-500">
              Cole o link de uma imagem da internet
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Cadastrar Produto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
