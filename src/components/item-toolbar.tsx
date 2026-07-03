import { Plus, Search, Trash2 } from "lucide-react";
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
  onClearAll,
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
  onClearAll?: () => void;
  showStatusFilter?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md p-2 shadow-sm text-white">
      <div className="relative min-w-[180px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
        <Input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="搜索物品…"
          className="border-transparent bg-transparent pl-9 shadow-none focus-visible:border-white/20 text-white placeholder:text-white/50"
        />
      </div>

      <Select value={category} onValueChange={onCategory}>
        <SelectTrigger className="w-[140px] border-white/10 bg-white/5 text-white shadow-sm hover:bg-white/10 transition-colors">
          <SelectValue placeholder="分类" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部分类</SelectItem>
          {CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showStatusFilter && (
        <Select value={status} onValueChange={onStatus}>
          <SelectTrigger className="w-[130px] border-white/10 bg-white/5 text-white shadow-sm hover:bg-white/10 transition-colors">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            {(Object.keys(STATUS_LABEL) as ItemStatus[])
              .filter((s) => s !== "archived")
              .map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABEL[s]}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      )}

      <Select value={sort} onValueChange={(v) => onSort(v as SortKey)}>
        <SelectTrigger className="w-[130px] border-white/10 bg-white/5 text-white shadow-sm hover:bg-white/10 transition-colors">
          <SelectValue placeholder="排序" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="idle">闲置最久</SelectItem>
          <SelectItem value="price">价值最高</SelectItem>
          <SelectItem value="recent">最近添加</SelectItem>
        </SelectContent>
      </Select>

      <div className="ml-auto flex items-center gap-2">
        {onClearAll && (
          <Button
            onClick={onClearAll}
            variant="ghost"
            className="rounded-full text-white/70 hover:text-white hover:bg-white/10"
            title="清空所有物品"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">清空所有</span>
          </Button>
        )}
        {onAdd && (
          <Button
            onClick={onAdd}
            className="rounded-full bg-white/20 text-white shadow-sm hover:bg-white/30 border border-white/10 font-medium"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            添加物品
          </Button>
        )}
      </div>
    </div>
  );
}
