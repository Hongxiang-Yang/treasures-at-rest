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

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg bg-black/40 backdrop-blur-xl border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {initial ? "编辑物品" : "添加闲置物品"}
          </DialogTitle>
          <DialogDescription className="text-white/60">记录你吃灰已久、或许未来会卖掉的东西。</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label className="text-white/80">照片</Label>
            <div
              className="relative flex aspect-[4/3] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/20 bg-white/5 text-white/50 transition hover:bg-white/10"
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
                  <span>点击上传照片</span>
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
            <Label htmlFor="name" className="text-white/80">物品名称</Label>
            <Input
              id="name"
              value={draft.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="例如：索尼耳机"
              autoFocus
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:border-white/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label className="text-white/80">分类</Label>
              <Select
                value={draft.category}
                onValueChange={(v) => set("category", v as Draft["category"])}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price" className="text-white/80">预期价值 (¥)</Label>
              <Input
                id="price"
                type="number"
                min={0}
                value={Number.isFinite(draft.expectedPrice) ? draft.expectedPrice : 0}
                onChange={(e) => set("expectedPrice", Number(e.target.value) || 0)}
                className="bg-white/5 border-white/10 text-white focus-visible:border-white/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label className="text-white/80">成色</Label>
              <Select
                value={draft.condition}
                onValueChange={(v) => set("condition", v as ItemCondition)}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(CONDITION_LABEL) as ItemCondition[]).map((c) => (
                    <SelectItem key={c} value={c}>
                      {CONDITION_LABEL[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-white/80">状态</Label>
              <Select value={draft.status} onValueChange={(v) => set("status", v as ItemStatus)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(STATUS_LABEL) as ItemStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="date" className="text-white/80">添加日期</Label>
              <Input
                id="date"
                type="date"
                value={isoToDateInput(draft.dateAdded)}
                onChange={(e) => set("dateAdded", new Date(e.target.value).toISOString())}
                className="bg-white/5 border-white/10 text-white focus-visible:border-white/30"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="loc" className="text-white/80">存放位置</Label>
              <Input
                id="loc"
                value={draft.location ?? ""}
                onChange={(e) => set("location", e.target.value)}
                placeholder="例如：书房抽屉"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:border-white/30"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes" className="text-white/80">备注</Label>
            <Textarea
              id="notes"
              rows={3}
              value={draft.notes ?? ""}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="任何值得记录的信息…"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:border-white/30"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-white/70 hover:text-white hover:bg-white/10">
            取消
          </Button>
          <Button onClick={handleSave} disabled={!draft.name.trim()} className="bg-white/20 text-white hover:bg-white/30 border border-white/10">
            {initial ? "保存修改" : "添加物品"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
