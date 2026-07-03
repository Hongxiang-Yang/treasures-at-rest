import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Currency = "¥" | "£";

interface CurrencyContextType {
  currency: Currency;
  toggleCurrency: () => void;
  formatPrice: (n: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

const EXCHANGE_RATE = 0.11; // 1 RMB = 0.11 GBP (approx)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("¥");

  useEffect(() => {
    const saved = localStorage.getItem("idle-currency") as Currency;
    if (saved === "¥" || saved === "£") {
      setCurrency(saved);
    }
  }, []);

  const toggleCurrency = () => {
    setCurrency((prev) => {
      const next = prev === "¥" ? "£" : "¥";
      localStorage.setItem("idle-currency", next);
      return next;
    });
  };

  const formatPrice = (n: number) => {
    if (currency === "¥") {
      return `¥${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    } else {
      const converted = n * EXCHANGE_RATE;
      return `£${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
