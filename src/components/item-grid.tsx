import { useMemo, useState } from "react";
import type { Item } from "@/lib/items";
import { ItemCard } from "@/components/item-card";
import { ItemFormDialog } from "@/components/item-form-dialog";
import { ItemToolbar, type SortKey } from "@/components/item-toolbar";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Package, Plus } from "lucide-react";

export function ItemGrid({
  items,
  emptyTitle,
  emptyHint,
  onCreate,
  onUpdate,
  onDelete,
  onClearAll,
  showStatusFilter = true,
  showAddButton = true,
  defaultSort = "idle",
}: {
  items: Item[];
  emptyTitle: string;
  emptyHint: string;
  onCreate?: (data: Omit<Item, "id">) => void;
  onUpdate: (id: string, patch: Partial<Item>) => void;
  onDelete: (id: string) => void;
  onClearAll?: () => void;
  showStatusFilter?: boolean;
  showAddButton?: boolean;
  defaultSort?: SortKey;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<SortKey>(defaultSort);
  const [editing, setEditing] = useState<Item | null>(null);
  const [open, setOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered = useMemo(() => {
    let list = items.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.notes ?? "").toLowerCase().includes(q) ||
          (i.location ?? "").toLowerCase().includes(q),
      );
    }
    if (category !== "all") list = list.filter((i) => i.category === category);
    if (status !== "all") list = list.filter((i) => i.status === status);
    list.sort((a, b) => {
      // Sold items always go to the very end
      if (a.status === "sold" && b.status !== "sold") return 1;
      if (b.status === "sold" && a.status !== "sold") return -1;

      if (sort === "price") return b.expectedPrice - a.expectedPrice;
      if (sort === "recent")
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
    });
    return list;
  }, [items, query, category, status, sort]);

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };

  return (
    <div className="space-y-4">
      <ItemToolbar
        query={query}
        onQuery={setQuery}
        category={category}
        onCategory={setCategory}
        status={status}
        onStatus={setStatus}
        sort={sort}
        onSort={setSort}
        onAdd={showAddButton && onCreate ? openNew : undefined}
        onClearAll={onClearAll ? () => setConfirmClear(true) : undefined}
        showStatusFilter={showStatusFilter}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-card/50 py-20 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-muted">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">{emptyTitle}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{emptyHint}</p>
          </div>
          {showAddButton && onCreate && (
            <Button onClick={openNew} className="mt-2 gap-1.5">
              <Plus className="h-4 w-4" /> Add your first item
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={(it) => {
                setEditing(it);
                setOpen(true);
              }}
              onStatusChange={(it, s) => onUpdate(it.id, { status: s })}
              onDelete={(it) => onDelete(it.id)}
            />
          ))}
        </div>
      )}

      <ItemFormDialog
        open={open}
        onOpenChange={setOpen}
        initial={editing}
        onSubmit={(data, id) => {
          if (id) onUpdate(id, data);
          else if (onCreate) onCreate(data);
        }}
      />

      <AlertDialog open={confirmClear} onOpenChange={setConfirmClear}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>清空所有物品？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将删除所有物品记录，且无法撤销。你确定要继续吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmClear(false)}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onClearAll?.();
                setConfirmClear(false);
              }}
            >
              确认清空
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
