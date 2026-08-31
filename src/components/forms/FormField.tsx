import { cn } from "@/lib/cn";

type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
};

export function FormField({
  id,
  label,
  required,
  hint,
  error,
  children,
}: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-display text-sm uppercase tracking-[0.14em]">
        {label}
        {required ? (
          <>
            <span className="text-magenta" aria-hidden="true">
              {" "}
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        ) : (
          <span className="ml-2 font-sans text-xs normal-case tracking-normal text-muted">
            optional
          </span>
        )}
      </label>
      {children}
      {hint ? (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm text-gold" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const inputClassName =
  "min-h-12 w-full border bg-ink px-4 text-paper placeholder:text-muted focus:border-cyan";

export function inputBorder(error?: string) {
  return cn(inputClassName, error ? "border-gold" : "border-line");
}
