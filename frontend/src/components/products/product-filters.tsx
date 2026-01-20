import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { FilterState } from "./products-page";

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  categories: string[];
}

export function ProductFilters({
  filters,
  onFiltersChange,
  categories,
}: ProductFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchName: value });
  };

  const handleMinPriceChange = (value: string) => {
    onFiltersChange({ ...filters, minPrice: value });
  };

  const handleMaxPriceChange = (value: string) => {
    onFiltersChange({ ...filters, maxPrice: value });
  };

  const handleCategoryChange = (value: string) => {
    onFiltersChange({ ...filters, category: value === "all" ? "" : value });
  };

  const handleSortChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      sortBy: value as FilterState["sortBy"] 
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filtros e Ordenação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-2">
            <Label htmlFor="search">Buscar por nome</Label>
            <Input
              id="search"
              placeholder="Nome do produto..."
              value={filters.searchName}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="min-price">Preço mínimo</Label>
            <Input
              id="min-price"
              type="number"
              placeholder="0.00"
              value={filters.minPrice}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              step="0.01"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-price">Preço máximo</Label>
            <Input
              id="max-price"
              type="number"
              placeholder="9999.99"
              value={filters.maxPrice}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              step="0.01"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select 
              value={filters.category || "all"} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Todas" />
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
            <Select 
              value={filters.sortBy} 
              onValueChange={handleSortChange}
            >
              <SelectTrigger id="sort-by">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nome (A-Z)</SelectItem>
                <SelectItem value="price-asc">Menor Preço</SelectItem>
                <SelectItem value="price-desc">Maior Preço</SelectItem>
                <SelectItem value="category">Categoria</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
