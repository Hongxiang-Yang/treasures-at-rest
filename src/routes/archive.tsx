import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { ItemGrid } from "@/components/item-grid";
import { useItems } from "@/lib/use-items";

export const Route = createFileRoute("/archive")({
  head: () => ({
    meta: [
      { title: "Archive — Idle" },
      { name: "description", content: "Previously sold or archived items." },
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
  const totalValue = active.reduce((sum, i) => sum + (i.expectedPrice || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader totalValue={totalValue} activeCount={active.length} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Archive
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Items you've sold or set aside. Restore any of them anytime.
          </p>
        </div>
        <ItemGrid
          items={archived}
          emptyTitle="Nothing archived yet"
          emptyHint="When you mark items as sold or archived, they'll appear here."
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
