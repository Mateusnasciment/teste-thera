import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductFilters } from "~/components/products";

describe("ProductFilters", () => {
  const mockHandlers = {
    onSearchChange: jest.fn(),
    onMinPriceChange: jest.fn(),
    onMaxPriceChange: jest.fn(),
    onCategoryChange: jest.fn(),
    onSortChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render all filter fields", () => {
    render(
      <ProductFilters
        {...mockHandlers}
        categories={["Eletrônicos", "Livros"]}
      />
    );

    expect(screen.getByPlaceholderText("Nome do produto...")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("0.00")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("999.99")).toBeInTheDocument();
  });

  it("should call onSearchChange when search input changes", async () => {
    const user = userEvent.setup();
    render(
      <ProductFilters
        {...mockHandlers}
        categories={["Eletrônicos"]}
      />
    );

    const searchInput = screen.getByPlaceholderText("Nome do produto...");
    await user.type(searchInput, "Test Product");

    expect(mockHandlers.onSearchChange).toHaveBeenCalledWith("Test Product");
  });

  it("should call onMinPriceChange when min price changes", async () => {
    const user = userEvent.setup();
    render(
      <ProductFilters
        {...mockHandlers}
        categories={["Eletrônicos"]}
      />
    );

    const minPriceInput = screen.getByPlaceholderText("0.00");
    await user.type(minPriceInput, "50");

    expect(mockHandlers.onMinPriceChange).toHaveBeenCalledWith(50);
  });

  it("should disable filters when loading", () => {
    render(
      <ProductFilters
        {...mockHandlers}
        categories={["Eletrônicos"]}
        isLoading={true}
      />
    );

    const searchInput = screen.getByPlaceholderText("Nome do produto...");
    expect(searchInput).toBeDisabled();
  });
});
