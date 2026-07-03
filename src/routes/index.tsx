import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { ItemGrid } from "@/components/item-grid";
import { useItems } from "@/lib/use-items";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "闲置记录 — Idle" },
      { name: "description", content: "追踪你的闲置物品及其预期价值。" },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  const { items, create, update, remove } = useItems();
  const visible = useMemo(() => items.filter((i) => i.status !== "archived"), [items]);
  const active = useMemo(
    () => visible.filter((i) => i.status === "active" || i.status === "listed"),
    [visible],
  );
  const sold = useMemo(() => items.filter((i) => i.status === "sold"), [items]);
  
  const activeValue = active.reduce((sum, i) => sum + (i.expectedPrice || 0), 0);
  const soldValue = sold.reduce((sum, i) => sum + (i.expectedPrice || 0), 0);

  return (
    <div className="min-h-screen">
      <AppHeader activeValue={activeValue} soldValue={soldValue} activeCount={active.length} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl drop-shadow-md">
            你的闲置物品
          </h1>
          <p className="mt-1 text-sm text-white/80 drop-shadow-sm">给你的闲置物品找个新家。</p>
        </div>
        <ItemGrid
          items={visible}
          emptyTitle="空空如也"
          emptyHint="添加第一件物品，开始记录它的闲置时间。"
          onCreate={create}
          onUpdate={update}
          onDelete={remove}
        />
      </main>
    </div>
  );
}
