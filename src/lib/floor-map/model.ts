export const FLOOR_PIN_CATEGORIES = [
  { value: "entrance", label: "Entrances & Check-in", short: "Entry", emoji: "↪" },
  { value: "information", label: "Information & Help", short: "Info", emoji: "?" },
  { value: "accessibility", label: "Accessibility & Services", short: "Access", emoji: "♿" },
  { value: "restroom", label: "Restrooms", short: "Restrooms", emoji: "WC" },
  { value: "vendor", label: "Vendor Hall", short: "Vendors", emoji: "V" },
  { value: "artist", label: "Artist Alley", short: "Artists", emoji: "A" },
  { value: "gaming", label: "Video Games & Arcades", short: "Gaming", emoji: "G" },
  { value: "tabletop", label: "Tabletop & TCG", short: "Tabletop", emoji: "D20" },
  { value: "cosplay", label: "Cosplay Activities", short: "Cosplay", emoji: "C" },
  { value: "panels", label: "Panels & Workshops", short: "Panels", emoji: "P" },
  { value: "guests", label: "Featured Guests", short: "Guests", emoji: "★" },
  { value: "food", label: "Food & Drink", short: "Food", emoji: "F" },
  { value: "exit", label: "Exits", short: "Exit", emoji: "←" },
  { value: "other", label: "Other Location", short: "Other", emoji: "●" },
] as const;

export type FloorPinCategory = (typeof FLOOR_PIN_CATEGORIES)[number]["value"];

export type FloorMapRecord = {
  id: string;
  map_key: string;
  title: string;
  description: string;
  alt_text: string;
  image_path: string | null;
  is_published: boolean;
  sort_order: number;
  updated_at: string;
};

export type FloorPinRecord = {
  id: string;
  map_id: string;
  label: string;
  category: FloorPinCategory;
  description: string;
  x_pct: number;
  y_pct: number;
  booth_label: string | null;
  exhibitor_id: string | null;
  is_visible: boolean;
  sort_order: number;
};

export type PublicFloorPin = FloorPinRecord & {
  exhibitor_name: string | null;
  exhibitor_url: string | null;
};

export type PublicFloorMap = Pick<
  FloorMapRecord, "id" | "title" | "description" | "alt_text" | "updated_at"
> & {
  image_url: string;
  pins: PublicFloorPin[];
};

export const floorPinLabel = (category: FloorPinCategory) =>
  FLOOR_PIN_CATEGORIES.find(item => item.value === category)?.label || "Other Location";

export function floorPinType(value: string): value is FloorPinCategory {
  return FLOOR_PIN_CATEGORIES.some(item => item.value === value);
}

export function parsePercent(value: string): number | null {
  if (!/^\d{1,3}(?:\.\d{1,2})?$/.test(value)) return null;
  const n=Number(value);
  return Number.isFinite(n) && n>=0 && n<=100 ? n : null;
}

export function validMapKey(value: string): boolean {
  return /^[a-z0-9][a-z0-9-]{1,48}$/.test(value);
}

export function validMapUpload(file: File): string | null {
  if (file.size <= 0 || file.size > 3*1024*1024) return "Choose an image under 3 MB.";
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    return "Upload a PNG, JPG or WebP image.";
  }
  return null;
}
