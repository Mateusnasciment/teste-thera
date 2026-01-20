import React from "react";
import { render } from "@testing-library/react";
import { ProductCard } from "~/components/products";
import type { Product } from "~/components/products";

const mockProduct: Product = {
  id: "1",
  name: "Test Product",
  category: "Eletrônicos",
  description: "A test product description",
  price: "99.99",
  imageUrl: "https://example.com/image.jpg",
  stockQuantity: 10,
  createdAt: new Date("2024-01-20"),
  updatedAt: new Date("2024-01-20"),
};

describe("ProductCard Snapshot", () => {
  it("should match snapshot with full product info", () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    expect(container).toMatchSnapshot();
  });

  it("should match snapshot with product out of stock", () => {
    const outOfStockProduct = {
      ...mockProduct,
      stockQuantity: 0,
    };
    const { container } = render(<ProductCard product={outOfStockProduct} />);
    expect(container).toMatchSnapshot();
  });

  it("should match snapshot without image", () => {
    const noImageProduct = {
      ...mockProduct,
      imageUrl: null,
    };
    const { container } = render(<ProductCard product={noImageProduct} />);
    expect(container).toMatchSnapshot();
  });

  it("should match snapshot without description", () => {
    const noDescriptionProduct = {
      ...mockProduct,
      description: null,
    };
    const { container } = render(<ProductCard product={noDescriptionProduct} />);
    expect(container).toMatchSnapshot();
  });
});
