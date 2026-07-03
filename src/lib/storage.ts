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
    name: "Sony WH-1000XM4 头戴式耳机",
    category: "电子产品",
    expectedPrice: 980,
    dateAdded: daysAgo(62),
    condition: "like-new",
    location: "办公桌抽屉",
    notes: "原盒和数据线齐全。",
    status: "active",
  },
  {
    id: uid(),
    name: "复古皮夹克",
    category: "服装配饰",
    expectedPrice: 580,
    dateAdded: daysAgo(140),
    condition: "good",
    location: "卧室衣柜",
    notes: "只穿过几次，尺码 M。",
    status: "active",
  },
  {
    id: uid(),
    name: "Kindle Paperwhite (第 10 代)",
    category: "电子产品",
    expectedPrice: 380,
    dateAdded: daysAgo(28),
    condition: "good",
    location: "书架",
    status: "listed",
  },
  {
    id: uid(),
    name: "IKEA Poäng 扶手椅",
    category: "家具",
    expectedPrice: 420,
    dateAdded: daysAgo(9),
    condition: "good",
    location: "客厅",
    notes: "仅限自提。",
    status: "active",
  },
  {
    id: uid(),
    name: "精装小说合集 (12 本)",
    category: "书籍",
    expectedPrice: 260,
    dateAdded: daysAgo(220),
    condition: "good",
    status: "active",
  },
  {
    id: uid(),
    name: "Nintendo Switch Lite",
    category: "电子产品",
    expectedPrice: 760,
    dateAdded: daysAgo(310),
    condition: "fair",
    notes: "已卖给同事。",
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
