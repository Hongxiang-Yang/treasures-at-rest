import { Link, useRouterState } from "@tanstack/react-router";
import { Archive, Package, PoundSterling, JapaneseYen } from "lucide-react";
import { useCurrency } from "@/lib/currency-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function AppHeader({
  activeValue,
  soldValue,
  activeCount,
}: {
  activeValue: number;
  soldValue: number;
  activeCount: number;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { currency, toggleCurrency, formatPrice } = useCurrency();
  const GBP_RATE = 0.11;

  const navLink = (to: string, label: string, icon: React.ReactNode) => {
    const active = pathname === to;
    return (
      <Link
        to={to}
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors ${
          active ? "bg-white/20 text-white shadow-sm" : "text-white/60 hover:text-white"
        }`}
      >
        {icon}
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-white/5 backdrop-blur-2xl text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-white">
            <div className="h-8 w-8 overflow-hidden rounded-lg border border-white/10 shadow-sm">
              <img src="/logo.png" alt="闲置小仓库" className="h-full w-full object-cover" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">闲置小仓库</span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {navLink("/", "物品列表", <Package className="h-3.5 w-3.5" />)}
            {navLink("/archive", "已归档", <Archive className="h-3.5 w-3.5" />)}
          </nav>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md px-4 py-2 shadow-sm text-white">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-white/60">
              闲置中物品
            </div>
            <div className="font-display text-xl font-semibold leading-tight">{activeCount}</div>
          </div>
          <div className="text-right border-l border-white/20 pl-3">
            <div className="text-[10px] uppercase tracking-wider text-white/60">
              当前潜在收益
            </div>
            <div className="font-display text-xl font-semibold leading-tight">
              {formatPrice(activeValue)}{" "}
              <span className="text-sm text-white/70 font-normal">
                (约 {currency === "¥" ? `£${Math.round(activeValue * GBP_RATE)}` : `¥${Math.round(activeValue)}`})
              </span>
            </div>
          </div>
          <div className="text-right border-l border-white/20 pl-3">
            <div className="text-[10px] uppercase tracking-wider text-white/60">
              已售出总价值
            </div>
            <div className="font-display text-xl font-semibold leading-tight">
              {formatPrice(soldValue)}{" "}
              <span className="text-sm text-white/70 font-normal">
                (约 {currency === "¥" ? `£${Math.round(soldValue * GBP_RATE)}` : `¥${Math.round(soldValue)}`})
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 border-l border-white/20 pl-3 ml-1">
            <button
              onClick={toggleCurrency}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white shadow-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              title="切换货币"
            >
              {currency === "¥" ? (
                <PoundSterling className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <JapaneseYen className="h-[1.2rem] w-[1.2rem]" />
              )}
              <span className="sr-only">Toggle Currency</span>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <nav className="flex items-center gap-1 border-t border-border/60 px-4 py-2 sm:hidden">
        {navLink("/", "物品列表", <Package className="h-3.5 w-3.5" />)}
        {navLink("/archive", "已归档", <Archive className="h-3.5 w-3.5" />)}
      </nav>
    </header>
  );
}
