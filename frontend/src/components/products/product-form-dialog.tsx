"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Plus } from "lucide-react";
import type { Product } from "./product-card";

const productFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").min(3, "Nome deve ter pelo menos 3 caracteres"),
  category: z.string().min(1, "Categoria é obrigatória"),
  description: z.string().optional(),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Preço deve ser um número positivo",
  }),
  imageUrl: z.string().url("URL deve ser válida").optional().or(z.literal("")),
  stockQuantity: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: "Quantidade deve ser um número não negativo",
  }),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormDialogProps {
  onSubmit: (data: ProductFormValues) => Promise<void>;
  isLoading?: boolean;
  product?: Product;
  categories?: string[];
}

const CATEGORIES = [
  "Eletrônicos",
  "Livros",
  "Roupas",
  "Alimentos",
  "Móveis",
  "Higiene",
  "Esportes",
  "Brinquedos",
];

export function ProductFormDialog({
  onSubmit,
  isLoading = false,
  product,
  categories = CATEGORIES,
}: ProductFormDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product
      ? {
          name: product.name,
          category: product.category,
          description: product.description || "",
          price: product.price,
          imageUrl: product.imageUrl || "",
          stockQuantity: product.stockQuantity.toString(),
        }
      : {
          name: "",
          category: "",
          description: "",
          price: "",
          imageUrl: "",
          stockQuantity: "0",
        },
  });

  const handleSubmit = async (data: ProductFormValues) => {
    try {
      await onSubmit(data);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Erro ao submeter formulário:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {product ? (
          <Button variant="outline" size="sm">
            Editar Produto
          </Button>
        ) : (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          <DialogDescription>
            {product ? "Atualize as informações do produto" : "Preencha os campos para criar um novo produto"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Produto *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do produto" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço (R$) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>Preço do produto em reais</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Descrição do produto (opcional)"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://exemplo.com/imagem.jpg"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>URL válida de uma imagem (opcional)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stockQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade em Estoque</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : product ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
