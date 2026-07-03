import { useState } from "react";
import { Archive, CheckCircle2, MoreHorizontal, Package, Tag, Trash2, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ShareModal } from "@/components/share-modal";
import { CONDITION_LABEL, STATUS_LABEL, idleLabel, type Item } from "@/lib/items";
import { useCurrency } from "@/lib/currency-context";

const statusStyles: Record<Item["status"], string> = {
  active: "bg-background/95 backdrop-blur-md text-success border-border/50 shadow-sm",
  listed: "bg-background/95 backdrop-blur-md text-info border-border/50 shadow-sm",
  sold: "bg-background/95 backdrop-blur-md text-accent-foreground border-border/50 shadow-sm",
  archived: "bg-background/95 backdrop-blur-md text-muted-foreground border-border/50 shadow-sm",
};

export function ItemCard({
  item,
  onEdit,
  onStatusChange,
  onDelete,
}: {
  item: Item;
  onEdit: (item: Item) => void;
  onStatusChange: (item: Item, status: Item["status"]) => void;
  onDelete: (item: Item) => void;
}) {
  const [shareOpen, setShareOpen] = useState(false);
  const { formatPrice } = useCurrency();

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg text-white">
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="relative aspect-[4/3] w-full overflow-hidden bg-white/5 text-left"
            >
              {item.photo ? (
                <img
                  src={item.photo}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/5">
                  <Package className="h-10 w-10 text-white/30" />
                </div>
              )}
              {item.status !== "sold" && (
                <span
                  className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusStyles[item.status]}`}
                >
                  {STATUS_LABEL[item.status]}
                </span>
              )}
              {item.status === "sold" && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                  <div className="rotate-[-15deg] rounded-lg border-4 border-white/60 px-6 py-2 text-3xl font-black tracking-widest text-white/80 drop-shadow-sm">
                    已售出
                  </div>
                </div>
              )}
            </button>

            <div className="flex flex-1 flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-display text-base font-semibold">{item.name}</h3>
                  <p className="mt-0.5 text-xs text-white/60">
                    {item.category} · {CONDITION_LABEL[item.condition]}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShareOpen(true);
                    }}
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-auto flex items-end justify-between border-t border-white/10 pt-3">
                <div>
                  <div className="font-display text-lg font-semibold">
                    {formatPrice(item.expectedPrice)}
                  </div>
                  <div className="text-[11px] text-white/60">预期价值</div>
                </div>
                <div className="text-right text-xs text-white/60">
                  {idleLabel(item.dateAdded)}
                </div>
              </div>
            </div>
          </article>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-44">
          <ContextMenuItem onClick={() => onEdit(item)}>编辑</ContextMenuItem>
          <ContextMenuSeparator />
          {item.status !== "listed" && (
            <ContextMenuItem onClick={() => onStatusChange(item, "listed")}>
              <Tag className="mr-2 h-4 w-4" /> 标记为已上架
            </ContextMenuItem>
          )}
          {item.status !== "sold" && (
            <ContextMenuItem onClick={() => onStatusChange(item, "sold")}>
              <CheckCircle2 className="mr-2 h-4 w-4" /> 标记为已售出
            </ContextMenuItem>
          )}
          {item.status !== "active" && item.status !== "archived" && (
            <ContextMenuItem onClick={() => onStatusChange(item, "active")}>
              恢复闲置中
            </ContextMenuItem>
          )}
          {item.status !== "archived" ? (
            <ContextMenuItem onClick={() => onStatusChange(item, "archived")}>
              <Archive className="mr-2 h-4 w-4" /> 归档
            </ContextMenuItem>
          ) : (
            <ContextMenuItem onClick={() => onStatusChange(item, "active")}>还原</ContextMenuItem>
          )}
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => onDelete(item)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" /> 删除
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <ShareModal open={shareOpen} onOpenChange={setShareOpen} item={item} />
    </>
  );
}
