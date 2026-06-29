import { Archive, CheckCircle2, MoreHorizontal, Package, Tag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CONDITION_LABEL,
  STATUS_LABEL,
  formatPrice,
  idleLabel,
  type Item,
} from "@/lib/items";

const statusStyles: Record<Item["status"], string> = {
  active: "bg-success/15 text-success border-success/20",
  listed: "bg-info/15 text-info border-info/20",
  sold: "bg-accent text-accent-foreground border-transparent",
  archived: "bg-muted text-muted-foreground border-transparent",
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
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
      <button
        type="button"
        onClick={() => onEdit(item)}
        className="relative aspect-[4/3] w-full overflow-hidden bg-muted text-left"
      >
        {item.photo ? (
          <img
            src={item.photo}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-muted">
            <Package className="h-10 w-10 text-muted-foreground/50" />
          </div>
        )}
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusStyles[item.status]}`}
        >
          {STATUS_LABEL[item.status]}
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-semibold">{item.name}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {item.category} · {CONDITION_LABEL[item.condition]}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-1 h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onEdit(item)}>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              {item.status !== "listed" && (
                <DropdownMenuItem onClick={() => onStatusChange(item, "listed")}>
                  <Tag className="mr-2 h-4 w-4" /> Mark as listed
                </DropdownMenuItem>
              )}
              {item.status !== "sold" && (
                <DropdownMenuItem onClick={() => onStatusChange(item, "sold")}>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as sold
                </DropdownMenuItem>
              )}
              {item.status !== "active" && item.status !== "archived" && (
                <DropdownMenuItem onClick={() => onStatusChange(item, "active")}>
                  Move to active
                </DropdownMenuItem>
              )}
              {item.status !== "archived" ? (
                <DropdownMenuItem onClick={() => onStatusChange(item, "archived")}>
                  <Archive className="mr-2 h-4 w-4" /> Archive
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => onStatusChange(item, "active")}>
                  Restore
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(item)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-border/60 pt-3">
          <div>
            <div className="font-display text-lg font-semibold">
              {formatPrice(item.expectedPrice)}
            </div>
            <div className="text-[11px] text-muted-foreground">expected</div>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            {idleLabel(item.dateAdded)}
          </div>
        </div>
      </div>
    </article>
  );
}
