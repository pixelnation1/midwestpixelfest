import { randomBytes } from "node:crypto";

/** Non-sequential public reference. Not a database id. */
export function createSponsorReference(): string {
  return `MPF-S-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export function isSponsorReference(value: string): boolean {
  return /^MPF-S-[0-9A-F]{6}$/.test(value);
}
