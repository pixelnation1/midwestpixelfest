"use client";

import { useFieldError } from "@/components/forms/FormContext";

type RadioGroupProps = {
  legend: string;
  name: string;
  options: readonly string[];
  required?: boolean;
  hint?: string;
  error?: string;
  onValueChange?: (value: string) => void;
};

export function RadioGroup({
  legend,
  name,
  options,
  required = true,
  hint,
  error,
  onValueChange,
}: RadioGroupProps) {
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
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap">
        {options.map((option) => (
          <label
            key={option}
            className="flex min-h-11 min-w-0 items-center gap-3 border border-line bg-ink px-4 py-2 text-sm text-muted sm:min-w-40"
          >
            <input
              type="radio"
              name={name}
              value={option}
              required={required}
              onChange={
                onValueChange ? () => onValueChange(option) : undefined
              }
              className="h-5 min-h-5 w-5 min-w-5 shrink-0 accent-magenta"
            />
            <span className="min-w-0 break-words">{option}</span>
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
