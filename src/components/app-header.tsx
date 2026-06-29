import { Link, useRouterState } from "@tanstack/react-router";
import { Archive, Package } from "lucide-react";

export function AppHeader({ totalValue, activeCount }: { totalValue: number; activeCount: number }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navLink = (to: string, label: string, icon: React.ReactNode) => {
    const active = pathname === to;
    return (
      <Link
        to={to}
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors ${
          active
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {icon}
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Package className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">Idle</span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {navLink("/", "Inventory", <Package className="h-3.5 w-3.5" />)}
            {navLink("/archive", "Archive", <Archive className="h-3.5 w-3.5" />)}
          </nav>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-2 shadow-[var(--shadow-soft)]">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Total expected value
            </div>
            <div className="font-display text-xl font-semibold leading-tight">
              £{totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="h-9 w-px bg-border" />
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Active items
            </div>
            <div className="font-display text-xl font-semibold leading-tight">{activeCount}</div>
          </div>
        </div>
      </div>

      <nav className="flex items-center gap-1 border-t border-border/60 px-4 py-2 sm:hidden">
        {navLink("/", "Inventory", <Package className="h-3.5 w-3.5" />)}
        {navLink("/archive", "Archive", <Archive className="h-3.5 w-3.5" />)}
      </nav>
    </header>
  );
}
