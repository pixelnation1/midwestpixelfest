"use client";

import { useFieldError } from "@/components/forms/FormContext";

type CheckboxProps = {
  id: string;
  name: string;
  label: React.ReactNode;
  error?: string;
  required?: boolean;
};

export function Checkbox({ id, name, label, error, required }: CheckboxProps) {
  const fieldError = useFieldError(name, error);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex min-h-11 items-start gap-3 text-sm leading-relaxed text-muted">
        <input
          id={id}
          name={name}
          type="checkbox"
          value="on"
          required={required}
          aria-invalid={fieldError ? true : undefined}
          aria-describedby={fieldError ? `${id}-error` : undefined}
          className="mt-1 h-5 min-h-5 w-5 min-w-5 shrink-0 accent-magenta"
        />
        <span>{label}</span>
      </label>
      {fieldError ? (
        <p id={`${id}-error`} className="text-sm text-gold" role="alert">
          {fieldError}
        </p>
      ) : null}
    </div>
  );
}

type CheckboxGroupProps = {
  legend: string;
  name: string;
  options: readonly string[];
  error?: string;
  required?: boolean;
  hint?: string;
  onToggle?: (value: string, checked: boolean) => void;
};

export function CheckboxGroup({
  legend,
  name,
  options,
  error,
  required = true,
  hint,
  onToggle,
}: CheckboxGroupProps) {
  const fieldError = useFieldError(name, error);
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = fieldError ? `${name}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <fieldset aria-describedby={describedBy} className="flex flex-col gap-3">
      <legend className="font-display text-sm uppercase tracking-[0.14em]">
        {legend}
        {required ? (
          <>
            <span className="text-magenta" aria-hidden="true">
              {" "}
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        ) : (
          <span className="ml-2 font-sans text-xs font-normal normal-case tracking-normal text-muted">
            optional
          </span>
        )}
      </legend>
      {hint ? (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label key={option} className="flex min-h-11 items-center gap-3 text-sm text-muted">
            <input
              type="checkbox"
              name={name}
              value={option}
              onChange={
                onToggle
                  ? (event) => onToggle(option, event.target.checked)
                  : undefined
              }
              className="h-5 min-h-5 w-5 min-w-5 shrink-0 accent-magenta"
            />
            {option}
          </label>
        ))}
      </div>
      {fieldError ? (
        <p id={errorId} className="text-sm text-gold" role="alert">
          {fieldError}
        </p>
      ) : null}
    </fieldset>
  );
}
