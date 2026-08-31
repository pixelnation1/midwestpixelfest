"use client";

import { FormField, inputBorder } from "@/components/forms/FormField";
import { useFieldError } from "@/components/forms/FormContext";

type TextAreaProps = {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  rows?: number;
  error?: string;
  hint?: string;
  maxLength?: number;
};

export function TextArea({
  id,
  name,
  label,
  required,
  rows = 6,
  error,
  hint,
  maxLength,
}: TextAreaProps) {
  const fieldError = useFieldError(name, error);
  const describedBy =
    [hint ? `${id}-hint` : null, fieldError ? `${id}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <FormField id={id} label={label} required={required} hint={hint} error={fieldError}>
      <textarea
        id={id}
        name={name}
        required={required}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={fieldError ? true : undefined}
        aria-describedby={describedBy}
        className={`${inputBorder(fieldError)} max-h-80 resize-y py-3`}
      />
    </FormField>
  );
}
