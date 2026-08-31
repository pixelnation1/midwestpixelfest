"use client";

import { FormField, inputBorder } from "@/components/forms/FormField";
import { useFieldError } from "@/components/forms/FormContext";

type SelectProps = {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  options: readonly string[];
  placeholder?: string;
  error?: string;
  hint?: string;
};

export function Select({
  id,
  name,
  label,
  required,
  options,
  placeholder = "Select one",
  error,
  hint,
}: SelectProps) {
  const fieldError = useFieldError(name, error);
  const describedBy =
    [hint ? `${id}-hint` : null, fieldError ? `${id}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <FormField id={id} label={label} required={required} hint={hint} error={fieldError}>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue=""
        aria-invalid={fieldError ? true : undefined}
        aria-describedby={describedBy}
        className={inputBorder(fieldError)}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FormField>
  );
}
