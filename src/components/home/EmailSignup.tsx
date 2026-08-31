"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

type EmailSignupProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function EmailSignup({
  eyebrow = "Stay in the loop",
  title = "Don't miss the next announcement",
  description = "Dates, guests, tickets, and applications will hit this list first. No spam — just the drops that matter.",
}: EmailSignupProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const fieldId = useId();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,45,149,0.16),transparent_60%)]" />
      <Container className="relative">
        <div className="border border-magenta/40 bg-panel px-6 py-12 sm:px-12">
          <SectionHeading
            align="center"
            eyebrow={eyebrow}
            title={title}
            description={description}
            tone="magenta"
          />

          {submitted ? (
            <p
              className="mx-auto mt-10 max-w-xl text-center font-display text-xl uppercase tracking-[0.14em] text-cyan"
              role="status"
            >
              You&apos;re on the list. We&apos;ll be in touch.
            </p>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mx-auto mt-10 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
            >
              <label htmlFor={fieldId} className="sr-only">
                Email Address
              </label>
              <input
                id={fieldId}
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email Address"
                className="min-h-12 flex-1 border border-line bg-ink px-4 text-paper placeholder:text-muted focus:border-cyan"
              />
              <Button type="submit" size="lg" className="sm:min-w-44">
                Join the List
              </Button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
