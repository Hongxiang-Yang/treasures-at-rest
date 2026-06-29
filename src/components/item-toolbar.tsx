import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, STATUS_LABEL, type ItemStatus } from "@/lib/items";

export type SortKey = "idle" | "price" | "recent";

export function ItemToolbar({
  query,
  onQuery,
  category,
  onCategory,
  status,
  onStatus,
  sort,
  onSort,
  onAdd,
  showStatusFilter = true,
}: {
  query: string;
  onQuery: (v: string) => void;
  category: string;
  onCategory: (v: string) => void;
  status: string;
  onStatus: (v: string) => void;
  sort: SortKey;
  onSort: (v: SortKey) => void;
  onAdd?: () => void;
  showStatusFilter?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-card p-2 shadow-[var(--shadow-soft)]">
      <div className="relative min-w-[180px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search items…"
          className="border-transparent bg-transparent pl-9 shadow-none focus-visible:border-border"
        />
      </div>

      <Select value={category} onValueChange={onCategory}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showStatusFilter && (
        <Select value={status} onValueChange={onStatus}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(Object.keys(STATUS_LABEL) as ItemStatus[])
              .filter((s) => s !== "archived")
              .map((s) => (
                <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
              ))}
          </SelectContent>
        </Select>
      )}

      <Select value={sort} onValueChange={(v) => onSort(v as SortKey)}>
        <SelectTrigger className="w-[170px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="idle">Longest idle</SelectItem>
          <SelectItem value="price">Highest price</SelectItem>
          <SelectItem value="recent">Recently added</SelectItem>
        </SelectContent>
      </Select>

      {onAdd && (
        <Button onClick={onAdd} className="ml-auto gap-1.5">
          <Plus className="h-4 w-4" /> Add item
        </Button>
      )}
    </div>
  );
}
