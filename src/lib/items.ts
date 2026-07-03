export type ItemStatus = "active" | "listed" | "sold" | "archived";

export type ItemCondition = "new" | "like-new" | "good" | "fair" | "worn";

export const CATEGORIES = [
  "电子产品",
  "服装配饰",
  "书籍",
  "家具",
  "家居用品",
  "运动器材",
  "玩具",
  "其他",
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
  new: "全新",
  "like-new": "99新",
  good: "良好",
  fair: "一般",
  worn: "战损版",
};

export const STATUS_LABEL: Record<ItemStatus, string> = {
  active: "闲置中",
  listed: "已上架",
  sold: "已售出",
  archived: "已归档",
};

export function daysSince(iso: string): number {
  const then = new Date(iso).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((now - then) / (1000 * 60 * 60 * 24)));
}

export function idleLabel(iso: string): string {
  const d = daysSince(iso);
  if (d === 0) return "今天刚添加";
  if (d === 1) return "闲置 1 天";
  if (d < 30) return `闲置 ${d} 天`;
  const months = Math.floor(d / 30);
  if (months < 12) return `闲置 ${months} 个月`;
  const years = Math.floor(months / 12);
  return `闲置 ${years} 年`;
}

export function formatPrice(n: number, currency = "¥"): string {
  return `${currency}${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}
