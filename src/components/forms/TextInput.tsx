"use client";

import { FormField, inputBorder } from "@/components/forms/FormField";
import { useFieldError } from "@/components/forms/FormContext";

type TextInputProps = {
  id: string;
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "url";
  required?: boolean;
  autoComplete?: string;
  error?: string;
  hint?: string;
  defaultValue?: string;
  maxLength?: number;
};

export function TextInput({
  id,
  name,
  label,
  type = "text",
  required,
  autoComplete,
  error,
  hint,
  defaultValue,
  maxLength,
}: TextInputProps) {
  const fieldError = useFieldError(name, error);
  const describedBy =
    [hint ? `${id}-hint` : null, fieldError ? `${id}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <FormField id={id} label={label} required={required} hint={hint} error={fieldError}>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        maxLength={maxLength}
        aria-invalid={fieldError ? true : undefined}
        aria-describedby={describedBy}
        className={inputBorder(fieldError)}
      />
    </FormField>
  );
}
