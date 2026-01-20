import React from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface FormFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

/**
 * Campo de formulário reutilizável com label, input e tratamento de erros
 * Melhora consistência visual e acessibilidade
 */
export function FormField({
  label,
  name,
  error,
  helperText,
  required = false,
  className,
  ...props
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        {...props}
        className={`${error ? "border-red-500 focus-visible:ring-red-500" : ""} ${
          className || ""
        }`}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
      />
      {error && (
        <p id={`${name}-error`} className="text-sm text-red-500 font-medium">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${name}-helper`} className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
