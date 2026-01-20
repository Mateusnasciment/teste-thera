import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductFormDialog } from "~/components/products";

describe("ProductFormDialog", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the new product button", () => {
    render(
      <ProductFormDialog
        onSubmit={mockOnSubmit}
        categories={["Eletrônicos", "Livros"]}
      />
    );

    const button = screen.getByText(/novo produto/i);
    expect(button).toBeInTheDocument();
  });

  it("should open dialog when button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ProductFormDialog
        onSubmit={mockOnSubmit}
        categories={["Eletrônicos"]}
      />
    );

    const button = screen.getByText(/novo produto/i);
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/preencha os campos/i)).toBeInTheDocument();
    });
  });

  it("should submit form with valid data", async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <ProductFormDialog
        onSubmit={mockOnSubmit}
        categories={["Eletrônicos", "Livros"]}
      />
    );

    // Abrir dialog
    const button = screen.getByText(/novo produto/i);
    await user.click(button);

    // Preencher formulário
    const nameInput = screen.getByPlaceholderText("Nome do produto");
    const priceInput = screen.getByPlaceholderText("0.00");
    const createButton = screen.getByRole("button", { name: /criar/i });

    await user.type(nameInput, "Notebook Dell");
    await user.type(priceInput, "3499.99");

    // Submeter
    await user.click(createButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it("should show validation errors for invalid data", async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <ProductFormDialog
        onSubmit={mockOnSubmit}
        categories={["Eletrônicos"]}
      />
    );

    // Abrir dialog
    const button = screen.getByText(/novo produto/i);
    await user.click(button);

    // Tentar submeter sem dados
    const createButton = screen.getByRole("button", { name: /criar/i });
    await user.click(createButton);

    // Verificar se há mensagens de erro
    await waitFor(() => {
      expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
    });
  });
});
