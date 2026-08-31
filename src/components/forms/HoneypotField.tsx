import { HONEYPOT_FIELD } from "@/lib/forms/validate";

export function HoneypotField() {
  return (
    <div className="hidden" aria-hidden="true">
      <label htmlFor={HONEYPOT_FIELD}>Fax number</label>
      <input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
