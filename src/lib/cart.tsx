import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = { planId: string; productSlug: string; qty: number };
type Ctx = {
  items: CartItem[];
  add: (i: Omit<CartItem, "qty">) => void;
  remove: (planId: string) => void;
  setQty: (planId: string, qty: number) => void;
  count: number;
};
const CartContext = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem("cart") || "[]"));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem("cart", JSON.stringify(items));
  }, [items, ready]);

  const add: Ctx["add"] = (i) =>
    setItems((prev) => {
      const ex = prev.find((p) => p.planId === i.planId);
      if (ex) return prev.map((p) => (p.planId === i.planId ? { ...p, qty: Math.min(p.qty + 1, 10) } : p));
      return [...prev, { ...i, qty: 1 }];
    });
  const remove = (planId: string) => setItems((p) => p.filter((x) => x.planId !== planId));
  const setQty = (planId: string, qty: number) =>
    setItems((p) => p.map((x) => (x.planId === planId ? { ...x, qty: Math.max(1, Math.min(10, qty)) } : x)));
  const count = items.reduce((s, i) => s + i.qty, 0);
  return <CartContext.Provider value={{ items, add, remove, setQty, count }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart outside provider");
  return c;
}
