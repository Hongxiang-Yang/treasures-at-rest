import { useCallback, useEffect, useState } from "react";
import type { Item } from "./items";
import { store, ensureSeeded, uid } from "./storage";

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const list = await store.list();
    setItems(list);
  }, []);

  useEffect(() => {
    (async () => {
      await ensureSeeded();
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  const persist = useCallback(async (next: Item[]) => {
    setItems(next);
    await store.save(next);
  }, []);

  const create = useCallback(
    async (data: Omit<Item, "id">) => {
      const next = [{ ...data, id: uid() }, ...items];
      await persist(next);
    },
    [items, persist],
  );

  const update = useCallback(
    async (id: string, patch: Partial<Item>) => {
      const next = items.map((it) => (it.id === id ? { ...it, ...patch } : it));
      await persist(next);
    },
    [items, persist],
  );

  const remove = useCallback(
    async (id: string) => {
      await persist(items.filter((it) => it.id !== id));
    },
    [items, persist],
  );

  return { items, loading, create, update, remove, refresh };
}
