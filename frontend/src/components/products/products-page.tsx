"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "./product-card";
import { ProductFormDialog } from "./product-form-dialog";
import { ProductFilters } from "./product-filters";
import { Button } from "~/components/ui/button";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  quantity_stock?: number;
}

export interface FilterState {
  searchName: string;
  minPrice: string;
  maxPrice: string;
  category: string;
  sortBy: "name" | "price-asc" | "price-desc" | "category";
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [filters, setFilters] = useState<FilterState>({
    searchName: "",
    minPrice: "",
    maxPrice: "",
    category: "",
    sortBy: "name",
  });

  // Carregar produtos da API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/products");
      if (!response.ok) throw new Error("API não disponível");
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.log("Usando dados mock - API não disponível");
      // Produtos mock para desenvolvimento com imagens reais
      const mockProducts: Product[] = [
        {
          id: 1,
          name: "Notebook Dell XPS 13",
          category: "Eletrônicos",
          price: 4500,
          description: "Ultrabook Dell XPS 13 com Intel Core i7, 16GB RAM, SSD 512GB",
          image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
        },
        {
          id: 2,
          name: "iPhone 15 Pro Max",
          category: "Smartphones",
          price: 8999,
          description: "Smartphone Apple iPhone 15 Pro Max com chip A17 Pro, 256GB",
          image: "https://images.unsplash.com/photo-1592286927505-1def25e85d1f?w=400&h=300&fit=crop",
        },
        {
          id: 3,
          name: "Mouse Logitech MX Master 3",
          category: "Acessórios",
          price: 450,
          description: "Mouse sem fio Logitech MX Master 3 com precisão profissional",
          image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300&fit=crop",
        },
        {
          id: 4,
          name: "Teclado Mecânico RGB",
          category: "Acessórios",
          price: 680,
          description: "Teclado mecânico com switches hot-swappable e RGB customizável",
          image: "https://images.unsplash.com/photo-1587829191301-b5b19941ea64?w=400&h=300&fit=crop",
        },
        {
          id: 5,
          name: "Monitor LG UltraWide 34\"",
          category: "Eletrônicos",
          price: 2800,
          description: "Monitor LG UltraWide 34 polegadas 2K com taxa de 144Hz",
          image: "https://images.unsplash.com/photo-1574368130206-403f3e7af9d9?w=400&h=300&fit=crop",
        },
        {
          id: 6,
          name: "Webcam Logitech C920",
          category: "Acessórios",
          price: 520,
          description: "Webcam Full HD 1080p com microfone estéreo de qualidade",
          image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop",
        },
        {
          id: 7,
          name: "Headset SteelSeries Arctis Pro",
          category: "Acessórios",
          price: 990,
          description: "Headset gamer profissional com som surround 7.1 premium",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
        },
        {
          id: 8,
          name: "Tablet iPad Air",
          category: "Eletrônicos",
          price: 5999,
          description: "iPad Air com chip M1, 64GB de armazenamento e tela Liquid Retina",
          image: "https://images.unsplash.com/photo-1544716278-ca5e3af35abd?w=400&h=300&fit=crop",
        },
        {
          id: 9,
          name: "Smart Watch Apple Watch Series 9",
          category: "Wearables",
          price: 3999,
          description: "Apple Watch Series 9 com Always-On Retina display e sensores avançados",
          image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=300&fit=crop",
        },
        {
          id: 10,
          name: "Câmera Digital Canon EOS R6",
          category: "Fotografia",
          price: 12999,
          description: "Câmera mirrorless Canon EOS R6 com sensor Full Frame 20MP",
          image: "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=400&h=300&fit=crop",
        },
        {
          id: 11,
          name: "Fone AirPods Pro (2ª geração)",
          category: "Acessórios",
          price: 1999,
          description: "Fones sem fio Apple AirPods Pro com cancelamento de ruído ativo",
          image: "https://images.unsplash.com/photo-1606833248051-5ce98cd8d315?w=400&h=300&fit=crop",
        },
        {
          id: 12,
          name: "Laptop MacBook Air M3",
          category: "Eletrônicos",
          price: 7999,
          description: "MacBook Air com chip M3, 8GB RAM, SSD 256GB e tela Liquid Retina",
          image: "https://images.unsplash.com/photo-1517694712162-7aae4d60bdf0?w=400&h=300&fit=crop",
        },
        {
          id: 13,
          name: "Monitor Dell 4K 27\"",
          category: "Eletrônicos",
          price: 1890,
          description: "Monitor Dell 27 polegadas 4K com suporte HDR e USB-C",
          image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
        },
        {
          id: 14,
          name: "Roteador WiFi 6 ASUS",
          category: "Rede",
          price: 890,
          description: "Roteador ASUS WiFi 6 com velocidade até 3Gbps e cobertura ampla",
          image: "https://images.unsplash.com/photo-1606933248051-5ce98cd8d315?w=400&h=300&fit=crop",
        },
        {
          id: 15,
          name: "SSD Externo Samsung 1TB",
          category: "Armazenamento",
          price: 890,
          description: "SSD portátil Samsung com 1TB de armazenamento e velocidade 1050MB/s",
          image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=300&fit=crop",
        },
        {
          id: 16,
          name: "Hub USB-C 7 em 1",
          category: "Acessórios",
          price: 299,
          description: "Hub USB-C multifuncional com HDMI, USB 3.0, cartão SD e carga rápida",
          image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop",
        },
        {
          id: 17,
          name: "Mochila para Laptop Samsonite",
          category: "Acessórios",
          price: 450,
          description: "Mochila profissional para laptop com compartimentos organizados",
          image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
        },
        {
          id: 18,
          name: "Carregador Rápido Anker 65W",
          category: "Acessórios",
          price: 280,
          description: "Carregador USB-C 65W com suporte a múltiplos dispositivos",
          image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=300&fit=crop",
        },
        {
          id: 19,
          name: "Mousepad Corsair Gamer",
          category: "Acessórios",
          price: 380,
          description: "Mousepad com RGB iluminado e superficie de controle otimizada",
          image: "https://images.unsplash.com/photo-1599505089423-66f31e39ddde?w=400&h=300&fit=crop",
        },
        {
          id: 20,
          name: "Suporte para Monitor Ajustável",
          category: "Acessórios",
          price: 190,
          description: "Suporte ergonômico para monitor com altura e inclinação ajustável",
          image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop",
        },
        {
          id: 21,
          name: "Controlador Xbox Series X",
          category: "Jogos",
          price: 490,
          description: "Controlador Xbox com retroalimentação tátil e gatilhos adaptativos",
          image: "https://images.unsplash.com/photo-1598594881042-7f51233b3de5?w=400&h=300&fit=crop",
        },
        {
          id: 22,
          name: "Projetor Epson EB-FH52",
          category: "Eletrônicos",
          price: 3200,
          description: "Projetor Full HD com 4000 lumens de brilho e contraste 15000:1",
          image: "https://images.unsplash.com/photo-1598905706672-3391e27f5b46?w=400&h=300&fit=crop",
        },
      ];
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros
  useEffect(() => {
    let result = [...products];

    // Filtro por nome
    if (filters.searchName) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(filters.searchName.toLowerCase())
      );
    }

    // Filtro por categoria
    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }

    // Filtro por faixa de preço
    if (filters.minPrice) {
      result = result.filter((p) => p.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter((p) => p.price <= parseFloat(filters.maxPrice));
    }

    // Ordenação
    switch (filters.sortBy) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "category":
        result.sort((a, b) => a.category.localeCompare(b.category));
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [filters, products]);

  const handleAddProduct = async (product: Omit<Product, "id">) => {
    try {
      const response = await fetch("http://localhost:3001/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error("Erro na API");
      const newProduct = await response.json();
      setProducts([...products, newProduct]);
      setIsDialogOpen(false);
    } catch (error) {
      // Mock: adiciona localmente
      const newProduct = { ...product, id: Date.now() };
      setProducts([...products, newProduct]);
      setIsDialogOpen(false);
    }
  };

  // Paginação
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Gerenciamento de Produtos
            </h1>
            <p className="mt-2 text-gray-600">
              {filteredProducts.length} produto{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} size="lg" className="w-full md:w-auto">
            + Novo Produto
          </Button>
        </div>

        <ProductFilters
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
        />

        {loading ? (
          <div className="py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-gray-500">Carregando produtos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white py-12 text-center">
            <p className="text-lg text-gray-500">Nenhum produto encontrado</p>
            <p className="mt-2 text-sm text-gray-400">
              Tente ajustar os filtros ou adicione um novo produto
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center gap-4 md:flex-row md:justify-center">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  ← Anterior
                </Button>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className="h-10 w-10"
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Próxima →
                </Button>
              </div>
            )}
          </>
        )}

        <ProductFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleAddProduct}
        />
      </div>
    </div>
  );
}
