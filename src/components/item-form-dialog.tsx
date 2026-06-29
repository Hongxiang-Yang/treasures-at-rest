import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORIES,
  CONDITION_LABEL,
  STATUS_LABEL,
  type Item,
  type ItemCondition,
  type ItemStatus,
} from "@/lib/items";

type Draft = Omit<Item, "id">;

function todayISO() {
  return new Date().toISOString();
}

function isoToDateInput(iso: string) {
  return new Date(iso).toISOString().slice(0, 10);
}

const emptyDraft = (): Draft => ({
  name: "",
  category: "Electronics",
  expectedPrice: 0,
  dateAdded: todayISO(),
  condition: "good",
  location: "",
  notes: "",
  status: "active",
});

export function ItemFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Item | null;
  onSubmit: (data: Draft, id?: string) => void;
}) {
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setDraft(initial ? { ...initial } : emptyDraft());
    }
  }, [open, initial]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const handlePhoto = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("photo", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!draft.name.trim()) return;
    onSubmit(draft, initial?.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {initial ? "Edit item" : "Add an item"}
          </DialogTitle>
          <DialogDescription>
            Track something you own but might sell later.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Photo</Label>
            <div
              className="relative flex aspect-[4/3] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/40 text-muted-foreground transition hover:bg-muted"
              onClick={() => fileRef.current?.click()}
            >
              {draft.photo ? (
                <>
                  <img src={draft.photo} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      set("photo", undefined);
                    }}
                    className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-background/90 text-foreground shadow"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-sm">
                  <ImagePlus className="h-6 w-6" />
                  <span>Click to upload a photo</span>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhoto(e.target.files?.[0])}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Item name</Label>
            <Input
              id="name"
              value={draft.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Sony Headphones"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select
                value={draft.category}
                onValueChange={(v) => set("category", v as Draft["category"])}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Expected price (£)</Label>
              <Input
                id="price"
                type="number"
                min={0}
                value={Number.isFinite(draft.expectedPrice) ? draft.expectedPrice : 0}
                onChange={(e) => set("expectedPrice", Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Condition</Label>
              <Select
                value={draft.condition}
                onValueChange={(v) => set("condition", v as ItemCondition)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(CONDITION_LABEL) as ItemCondition[]).map((c) => (
                    <SelectItem key={c} value={c}>{CONDITION_LABEL[c]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={draft.status}
                onValueChange={(v) => set("status", v as ItemStatus)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(STATUS_LABEL) as ItemStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="date">Date added</Label>
              <Input
                id="date"
                type="date"
                value={isoToDateInput(draft.dateAdded)}
                onChange={(e) =>
                  set("dateAdded", new Date(e.target.value).toISOString())
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="loc">Location</Label>
              <Input
                id="loc"
                value={draft.location ?? ""}
                onChange={(e) => set("location", e.target.value)}
                placeholder="e.g. Office drawer"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={3}
              value={draft.notes ?? ""}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Anything worth remembering…"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!draft.name.trim()}>
            {initial ? "Save changes" : "Add item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
