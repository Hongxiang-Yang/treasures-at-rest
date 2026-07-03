import { useState, useRef, useEffect } from "react";
import { Copy, Download, Share, Check, Package, Sparkles, PenTool, Key, X } from "lucide-react";
import * as htmlToImage from "html-to-image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CONDITION_LABEL, idleLabel, type Item } from "@/lib/items";
import {
  generateXhsCopy,
  getApiKey,
  saveApiKey,
  removeApiKey,
  type XhsCopywriting,
} from "@/lib/gemini";
import { cn } from "@/lib/utils";

export function ShareModal({
  open,
  onOpenChange,
  item,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Item | null;
}) {
  const [copyData, setCopyData] = useState<XhsCopywriting | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [copiedAll, setCopiedAll] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  // Initialize API Key from storage
  useEffect(() => {
    if (open) {
      const stored = getApiKey();
      setApiKey(stored);
      if (stored && item && !copyData) {
        handleGenerate(stored);
      }
    } else {
      // Reset state on close
      setCopyData(null);
      setError(null);
    }
  }, [open, item]);

  const handleGenerate = async (keyToUse: string) => {
    if (!item) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateXhsCopy(item);
      setCopyData(result);
    } catch (e: unknown) {
      console.error(e);
      setError(e instanceof Error ? e.message : "生成失败，请检查 API Key 或网络环境。");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = () => {
    if (!inputKey.trim()) return;
    saveApiKey(inputKey.trim());
    setApiKey(inputKey.trim());
    handleGenerate(inputKey.trim());
  };

  const handleRemoveKey = () => {
    removeApiKey();
    setApiKey(null);
    setInputKey("");
    setCopyData(null);
  };

  const handleDownload = async () => {
    if (!posterRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(posterRef.current, {
        quality: 1,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `xiaohongshu-share-${item?.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
    }
  };

  const handleCopyAll = () => {
    if (!copyData) return;
    const text = `【${copyData.title}】\n\n${copyData.body}\n\n${copyData.tags}`;
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  if (!item) return null;

  const idleText = idleLabel(item.dateAdded).replace("已闲置 ", "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl p-0 gap-0">
        <DialogTitle className="sr-only">小红书分享文案</DialogTitle>

        <div className="flex flex-col md:flex-row h-full min-h-[600px]">
          {/* Left Panel: 3:4 Poster Preview */}
          <div className="w-full md:w-[40%] bg-muted/30 p-6 flex flex-col items-center justify-center border-r">
            <h3 className="font-display font-medium mb-4 text-muted-foreground self-start">
              海报预览 (3:4)
            </h3>
            <div
              ref={posterRef}
              className="relative flex aspect-[3/4] w-full flex-col overflow-hidden rounded-2xl shadow-sm ring-1 ring-border/50 bg-white"
            >
              {/* Top part: The Image (approx 65% height) */}
              <div className="relative w-full h-[65%] bg-[#f4f4f5] flex items-center justify-center overflow-hidden">
                {item.photo ? (
                  <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-16 h-16 text-muted-foreground/20" />
                )}
              </div>

              {/* Bottom part: The Content (approx 35% height) */}
              <div className="flex flex-col flex-1 p-6 justify-center bg-white z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-sm border border-border text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    {CONDITION_LABEL[item.condition]}
                  </span>
                </div>
                <h2 className="font-display text-3xl font-semibold leading-tight text-foreground line-clamp-2">
                  {item.name}
                </h2>
              </div>
            </div>

            <Button onClick={handleDownload} className="w-full mt-6" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              下载高清海报
            </Button>
          </div>

          {/* Right Panel: API Setup OR Copywriting */}
          <div className="w-full md:w-[60%] flex flex-col h-[600px] overflow-hidden">
            {!apiKey ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#f8f9fa]">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="font-display text-2xl font-medium mb-2">配置 Gemini AI</h2>
                <p className="text-muted-foreground text-sm max-w-sm mb-8">
                  连接 Gemini API，为你的一键生成专属的小红书爆款文案。
                </p>
                <div className="w-full max-w-sm space-y-4 text-left">
                  <div className="space-y-2">
                    <Label htmlFor="apikey">Google Gemini API Key</Label>
                    <Input
                      id="apikey"
                      type="password"
                      placeholder="AIzaSy..."
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSaveKey} className="w-full">
                    <Key className="w-4 h-4 mr-2" />
                    保存并开始生成
                  </Button>
                  <p className="text-[10px] text-muted-foreground text-center">
                    你的 Key 将安全地加密保存在浏览器本地，绝不上传任何服务器。
                  </p>
                </div>
              </div>
            ) : loading ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#f8f9fa]">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                <h3 className="font-display font-medium text-lg">AI 正在撰写文案...</h3>
                <p className="text-sm text-muted-foreground mt-2">马上就好...</p>
              </div>
            ) : error ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#f8f9fa]">
                <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
                  <X className="w-6 h-6" />
                </div>
                <h3 className="font-display font-medium text-lg text-destructive mb-2">生成失败</h3>
                <p className="text-sm text-muted-foreground mb-6 text-center">{error}</p>
                <div className="flex gap-4">
                  <Button onClick={() => handleGenerate(apiKey)} variant="outline">
                    重试
                  </Button>
                  <Button onClick={handleRemoveKey} variant="ghost">
                    重置 API Key
                  </Button>
                </div>
              </div>
            ) : copyData ? (
              <div className="flex-1 flex flex-col p-6 bg-[#f8f9fa] overflow-y-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center gap-2">
                    <PenTool className="w-5 h-5 text-primary" />
                    <h2 className="font-display text-xl font-medium">成片文案直出</h2>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleRemoveKey}>
                      重置 API Key
                    </Button>
                    <Button variant="secondary" size="sm" onClick={handleCopyAll}>
                      {copiedAll ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      {copiedAll ? "已复制" : "一键复制全部"}
                    </Button>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-border/50 space-y-4 mb-6">
                  <div>
                    <h4 className="text-xs font-mono uppercase text-muted-foreground tracking-wider mb-2">
                      小红书标题
                    </h4>
                    <p className="font-medium text-lg">{copyData.title}</p>
                  </div>
                  <div className="h-px w-full bg-border/50" />
                  <div>
                    <h4 className="text-xs font-mono uppercase text-muted-foreground tracking-wider mb-2">
                      正文
                    </h4>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{copyData.body}</p>
                  </div>
                  <div className="h-px w-full bg-border/50" />
                  <div>
                    <h4 className="text-xs font-mono uppercase text-muted-foreground tracking-wider mb-2">
                      标签
                    </h4>
                    <p className="text-sm text-primary">{copyData.tags}</p>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <h4 className="text-xs font-mono uppercase text-orange-600/70 tracking-wider mb-2">
                    互动诱饵 (首评引导)
                  </h4>
                  <p className="text-sm text-orange-900">{copyData.commentGuide}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
