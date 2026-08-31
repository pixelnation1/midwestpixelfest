"use client";

import { createContext, useContext } from "react";
import type { FieldErrors } from "@/lib/forms/validate";

const FormErrorContext = createContext<FieldErrors>({});

export function FormErrorProvider({
  errors,
  children,
}: {
  errors: FieldErrors;
  children: React.ReactNode;
}) {
  return (
    <FormErrorContext.Provider value={errors}>{children}</FormErrorContext.Provider>
  );
}

export function useFieldError(name: string, override?: string) {
  const errors = useContext(FormErrorContext);
  return override ?? errors[name];
}
