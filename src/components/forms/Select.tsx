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
  defaultValue?: string;
  onValueChange?: (value: string) => void;
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
  defaultValue,
  onValueChange,
}: SelectProps) {
  const fieldError = useFieldError(name, error);
  const describedBy =
    [hint ? `${id}-hint` : null, fieldError ? `${id}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;
  const selected =
    defaultValue && options.includes(defaultValue) ? defaultValue : "";

  return (
    <FormField id={id} label={label} required={required} hint={hint} error={fieldError}>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue={selected}
        onChange={onValueChange ? (event) => onValueChange(event.target.value) : undefined}
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
