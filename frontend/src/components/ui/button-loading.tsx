import React from "react";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";

interface ButtonLoadingProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

/**
 * Botão reutilizável com estado de carregamento
 * Mostra spinner e texto customizável durante loading
 */
export function ButtonLoading({
  isLoading = false,
  loadingText = "Carregando...",
  disabled,
  children,
  ...props
}: ButtonLoadingProps) {
  return (
    <Button disabled={isLoading || disabled} {...props}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading ? loadingText : children}
    </Button>
  );
}
