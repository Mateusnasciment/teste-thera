"use client";

import { useState, useCallback, useMemo } from "react";
import { api } from "~/trpc/react";
import { ProductCard, ProductFilters, ProductFormDialog } from "~/components/products";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface FilterState {
  searchName?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  sortBy: string;
  sortOrder: string;
  page: number;
  limit: number;
}

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>({
    searchName: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    category: undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  });

  // Fetch products
  const { data: productsData, isLoading: productsLoading, refetch: refetchProducts } = api.products.list.useQuery(filters);
  
  // Fetch categories
  const { data: categoriesData = [], isLoading: categoriesLoading } = api.products.getCategories.useQuery();

  // Create product mutation
  const createMutation = api.products.create.useMutation({
    onSuccess: () => {
      refetchProducts();
    },
  });

  // Update product mutation
  const updateMutation = api.products.update.useMutation({
    onSuccess: () => {
      refetchProducts();
    },
  });

  // Delete product mutation
  const deleteMutation = api.products.delete.useMutation({
    onSuccess: () => {
      refetchProducts();
    },
  });

  const handleSearch = useCallback((search: string) => {
    setFilters((prev) => ({
      ...prev,
      searchName: search || undefined,
      page: 1,
    }));
  }, []);

  const handleMinPriceChange = useCallback((price: number | undefined) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: price,
      page: 1,
    }));
  }, []);

  const handleMaxPriceChange = useCallback((price: number | undefined) => {
    setFilters((prev) => ({
      ...prev,
      maxPrice: price,
      page: 1,
    }));
  }, []);

  const handleCategoryChange = useCallback((category: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      category,
      page: 1,
    }));
  }, []);

  const handleSortChange = useCallback((sort: { sortBy: string; sortOrder: string }) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
      page: 1,
    }));
  }, []);

  const handleCreateProduct = async (data: any) => {
    await createMutation.mutateAsync({
      ...data,
      price: parseFloat(data.price).toString(),
      stockQuantity: parseInt(data.stockQuantity),
    });
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  const isLoading = productsLoading || categoriesLoading || createMutation.isPending || deleteMutation.isPending;

  const products = productsData?.items ?? [];
  const totalPages = productsData?.pages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Catálogo de Produtos</h1>
          <p className="text-gray-600 mt-2">Gerenciar e explorar produtos</p>
        </div>
        <ProductFormDialog
          categories={categoriesData}
          onSubmit={handleCreateProduct}
          isLoading={createMutation.isPending}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsData?.total ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoriesData.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Página</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filters.page} de {totalPages}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <ProductFilters
        onSearchChange={handleSearch}
        onMinPriceChange={handleMinPriceChange}
        onMaxPriceChange={handleMaxPriceChange}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        categories={categoriesData}
        isLoading={isLoading}
      />

      {/* Products Grid */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      )}

      {!isLoading && products.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-500">Tente ajustar seus filtros ou criar um novo produto</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && products.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Mostrando {(filters.page - 1) * filters.limit + 1} a{" "}
                    {Math.min(filters.page * filters.limit, productsData?.total ?? 0)} de{" "}
                    {productsData?.total ?? 0} produtos
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))
                      }
                      disabled={filters.page === 1 || isLoading}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          page: Math.min(totalPages, prev.page + 1),
                        }))
                      }
                      disabled={filters.page === totalPages || isLoading}
                    >
                      Próximo
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
