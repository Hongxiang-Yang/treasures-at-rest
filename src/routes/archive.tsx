import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { ItemGrid } from "@/components/item-grid";
import { useItems } from "@/lib/use-items";

export const Route = createFileRoute("/archive")({
  head: () => ({
    meta: [
      { title: "已归档 — 闲置小仓库" },
      { name: "description", content: "已售出或归档的物品。" },
    ],
  }),
  component: ArchivePage,
});

function ArchivePage() {
  const { items, update, remove } = useItems();
  const archived = useMemo(
    () => items.filter((i) => i.status === "archived" || i.status === "sold"),
    [items],
  );
  const active = items.filter((i) => i.status === "active" || i.status === "listed");
  const sold = items.filter((i) => i.status === "sold");
  
  const activeValue = active.reduce((sum, i) => sum + (i.expectedPrice || 0), 0);
  const soldValue = sold.reduce((sum, i) => sum + (i.expectedPrice || 0), 0);

  return (
    <div className="min-h-screen">
      <AppHeader activeValue={activeValue} soldValue={soldValue} activeCount={active.length} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl drop-shadow-md">
            归档箱
          </h1>
          <p className="mt-1 text-sm text-white/80 drop-shadow-sm">
            已售出或不再关注的闲置物品。随时可以还原。
          </p>
        </div>
        <ItemGrid
          items={archived}
          emptyTitle="这里空空如也"
          emptyHint="当你将物品标记为已售出或已归档时，它们会出现在这里。"
          onUpdate={update}
          onDelete={remove}
          showAddButton={false}
          showStatusFilter={false}
          defaultSort="recent"
        />
      </main>
    </div>
  );
}
