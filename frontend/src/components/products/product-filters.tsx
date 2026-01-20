"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface ProductFiltersProps {
  onSearchChange: (search: string) => void;
  onMinPriceChange: (price: number | undefined) => void;
  onMaxPriceChange: (price: number | undefined) => void;
  onCategoryChange: (category: string | undefined) => void;
  onSortChange: (sort: { sortBy: string; sortOrder: string }) => void;
  categories: string[];
  isLoading?: boolean;
}

export function ProductFilters({
  onSearchChange,
  onMinPriceChange,
  onMaxPriceChange,
  onCategoryChange,
  onSortChange,
  categories,
  isLoading = false,
}: ProductFiltersProps) {
  const [searchValue, setSearchValue] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearchChange(value);
  };

  const handleMinPrice = (value: string) => {
    setMinPrice(value);
    onMinPriceChange(value ? parseFloat(value) : undefined);
  };

  const handleMaxPrice = (value: string) => {
    setMaxPrice(value);
    onMaxPriceChange(value ? parseFloat(value) : undefined);
  };

  const handleCategory = (value: string) => {
    const newValue = value === "all" ? undefined : value;
    setSelectedCategory(value);
    onCategoryChange(newValue);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    onSortChange({ sortBy: value, sortOrder });
  };

  const handleSortOrder = (value: string) => {
    setSortOrder(value);
    onSortChange({ sortBy, sortOrder: value });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
        <CardDescription>Pesquise e filtre os produtos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="search">Buscar por nome</Label>
            <Input
              id="search"
              placeholder="Nome do produto..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="min-price">Preço mínimo</Label>
            <Input
              id="min-price"
              type="number"
              placeholder="0.00"
              value={minPrice}
              onChange={(e) => handleMinPrice(e.target.value)}
              disabled={isLoading}
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-price">Preço máximo</Label>
            <Input
              id="max-price"
              type="number"
              placeholder="999.99"
              value={maxPrice}
              onChange={(e) => handleMaxPrice(e.target.value)}
              disabled={isLoading}
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={selectedCategory} onValueChange={handleCategory} disabled={isLoading}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort-by">Ordenar por</Label>
            <Select value={sortBy} onValueChange={handleSort} disabled={isLoading}>
              <SelectTrigger id="sort-by">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Mais recentes</SelectItem>
                <SelectItem value="name">Nome (A-Z)</SelectItem>
                <SelectItem value="price">Preço</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort-order">Ordem</Label>
            <Select value={sortOrder} onValueChange={handleSortOrder} disabled={isLoading}>
              <SelectTrigger id="sort-order">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Crescente</SelectItem>
                <SelectItem value="desc">Decrescente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
