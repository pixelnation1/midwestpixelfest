"use client";

import Link from "next/link";
import { Checkbox } from "@/components/forms/Checkbox";

type ConsentCheckboxProps = {
  label?: React.ReactNode;
};

export function ConsentCheckbox({ label }: ConsentCheckboxProps) {
  return (
    <Checkbox
      id="contactConsent"
      name="contactConsent"
      required
      label={
        label ?? (
          <>
            By submitting this form, you agree that Midwest Pixel Fest may contact
            you regarding this inquiry. Read our{" "}
            <Link href="/privacy" className="text-cyan underline-offset-2 hover:underline">
              Privacy
            </Link>{" "}
            page for how we handle this information.
          </>
        )
      }
    />
  );
}
