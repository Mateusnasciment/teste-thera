import ProductsPage from "~/components/products/products-page";

export const metadata = {
  title: "Gerenciamento de Produtos",
  description: "Sistema de gerenciamento de produtos",
};

export default function Home() {
  return <ProductsPage />;
}