// Storage abstraction. Today: localStorage. Tomorrow: swap for Supabase.
import type { Item } from "./items";

const KEY = "idle-inventory.items.v1";
const SEEDED_KEY = "idle-inventory.seeded.v1";

export interface ItemStore {
  list(): Promise<Item[]>;
  save(items: Item[]): Promise<void>;
}

class LocalStore implements ItemStore {
  async list(): Promise<Item[]> {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Item[]) : [];
    } catch {
      return [];
    }
  }
  async save(items: Item[]): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(KEY, JSON.stringify(items));
  }
}

export const store: ItemStore = new LocalStore();

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const DEMO_ITEMS: Item[] = [
  {
    id: uid(),
    name: "Sony WH-1000XM4 Headphones",
    category: "Electronics",
    expectedPrice: 140,
    dateAdded: daysAgo(62),
    condition: "like-new",
    location: "Office drawer",
    notes: "Original box and cable included.",
    status: "active",
  },
  {
    id: uid(),
    name: "Vintage Leather Jacket",
    category: "Clothing",
    expectedPrice: 85,
    dateAdded: daysAgo(140),
    condition: "good",
    location: "Bedroom wardrobe",
    notes: "Worn a handful of times. Size M.",
    status: "active",
  },
  {
    id: uid(),
    name: "Kindle Paperwhite (10th gen)",
    category: "Electronics",
    expectedPrice: 55,
    dateAdded: daysAgo(28),
    condition: "good",
    location: "Bookshelf",
    status: "listed",
  },
  {
    id: uid(),
    name: "IKEA Poäng Armchair",
    category: "Furniture",
    expectedPrice: 60,
    dateAdded: daysAgo(9),
    condition: "good",
    location: "Living room",
    notes: "Pickup only.",
    status: "active",
  },
  {
    id: uid(),
    name: "Hardcover Novel Bundle (12 books)",
    category: "Books",
    expectedPrice: 40,
    dateAdded: daysAgo(220),
    condition: "good",
    status: "active",
  },
  {
    id: uid(),
    name: "Nintendo Switch Lite",
    category: "Electronics",
    expectedPrice: 110,
    dateAdded: daysAgo(310),
    condition: "fair",
    notes: "Sold to a coworker.",
    status: "sold",
  },
];

export async function ensureSeeded(): Promise<void> {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(SEEDED_KEY)) return;
  const existing = await store.list();
  if (existing.length === 0) {
    await store.save(DEMO_ITEMS);
  }
  window.localStorage.setItem(SEEDED_KEY, "1");
}
