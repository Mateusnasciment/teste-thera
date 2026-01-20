import React from "react";
import { render } from "@testing-library/react";
import { ProductCard } from "~/components/products";
import type { Product } from "~/components/products";

const mockProduct: Product = {
  id: 1,
  name: "Notebook Dell Inspiron 15",
  category: "Eletrônicos",
  description: "Notebook Dell Inspiron 15 com Intel Core i7, 16GB RAM, SSD 512GB",
  price: 3500,
  image: "https://via.placeholder.com/300x200?text=Notebook+Dell",
};

describe("ProductCard Snapshot", () => {
  it("should match snapshot with full product info", () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    expect(container).toMatchSnapshot();
  });

  it("should match snapshot with different product", () => {
    const anotherProduct: Product = {
      id: 2,
      name: "Mouse Logitech MX Master 3",
      category: "Acessórios",
      description: "Mouse sem fio Logitech MX Master 3 com precisão profissional",
      price: 450,
      image: "https://via.placeholder.com/300x200?text=Mouse",
    };
    const { container } = render(<ProductCard product={anotherProduct} />);
    expect(container).toMatchSnapshot();
  });

  it("should render product name and price", () => {
    const { getByText } = render(<ProductCard product={mockProduct} />);
    expect(getByText("Notebook Dell Inspiron 15")).toBeInTheDocument();
    expect(getByText("Eletrônicos")).toBeInTheDocument();
  });
});

