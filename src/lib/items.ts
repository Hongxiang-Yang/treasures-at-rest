export type ItemStatus = "active" | "listed" | "sold" | "archived";

export type ItemCondition = "new" | "like-new" | "good" | "fair" | "worn";

export const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Books",
  "Furniture",
  "Home",
  "Sports",
  "Toys",
  "Accessories",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Item {
  id: string;
  name: string;
  category: Category;
  expectedPrice: number;
  dateAdded: string; // ISO
  photo?: string; // data URL
  condition: ItemCondition;
  location?: string;
  notes?: string;
  status: ItemStatus;
}

export const CONDITION_LABEL: Record<ItemCondition, string> = {
  new: "New",
  "like-new": "Like new",
  good: "Good",
  fair: "Fair",
  worn: "Worn",
};

export const STATUS_LABEL: Record<ItemStatus, string> = {
  active: "Active",
  listed: "Listed",
  sold: "Sold",
  archived: "Archived",
};

export function daysSince(iso: string): number {
  const then = new Date(iso).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((now - then) / (1000 * 60 * 60 * 24)));
}

export function idleLabel(iso: string): string {
  const d = daysSince(iso);
  if (d === 0) return "Added today";
  if (d === 1) return "Idle for 1 day";
  if (d < 30) return `Idle for ${d} days`;
  const months = Math.floor(d / 30);
  if (months < 12) return `Idle for ${months} mo`;
  const years = Math.floor(months / 12);
  return `Idle for ${years} yr`;
}

export function formatPrice(n: number, currency = "£"): string {
  return `${currency}${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}
