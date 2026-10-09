import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { productsQuery } from "@/lib/catalog";
import { useI18n, loc } from "@/lib/i18n";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — Pesha Store" },
      { name: "description", content: "Review your selected subscriptions before checkout." },
      { property: "og:title", content: "Your cart — Pesha Store" },
      { property: "og:description", content: "Review your selected subscriptions." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: CartPage,
});

function CartPage() {
  const { t, lang, price } = useI18n();
  const { data } = useSuspenseQuery(productsQuery);
  const { items, remove, setQty } = useCart();
  const rows = items
    .map((i) => {
      const product = data.find((p) => p.slug === i.productSlug);
      const plan = product?.plans.find((pl) => pl.id === i.planId);
      return product && plan ? { ...i, product, plan } : null;
    })
    .filter((r) => r !== null);
  const total = rows.reduce((s, r) => s + r.plan.price_iqd * r.qty, 0);

  if (!rows.length)
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 pt-24 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-secondary"><ShoppingBag className="size-8 text-muted-foreground" /></span>
        <h1 className="mt-6 text-2xl font-bold">{t("cart_empty")}</h1>
        <Link to="/shop" className="mt-6 rounded-full bg-gold px-6 py-3 font-semibold text-primary-foreground">{t("cta_shop")}</Link>
      </div>
    );

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 pt-10 sm:px-6 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="text-4xl font-black">{t("nav_cart")}</h1>
        <ul className="mt-8 space-y-3">
          <AnimatePresence>
            {rows.map((r) => (
              <motion.li key={r.planId} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 40 }} className="flex items-center gap-4 rounded-2xl bg-surface p-4 ring-1 ring-border">
                <span className="grid size-14 shrink-0 place-items-center rounded-xl font-display text-sm font-extrabold" style={{ background: `${r.product.accent}33` }} dir="ltr">
                  {r.product.brand.slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{loc(r.product, "name", lang)}</p>
                  <p className="text-sm text-muted-foreground">{loc(r.plan, "label", lang)}</p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-secondary p-1">
                  <button onClick={() => setQty(r.planId, r.qty - 1)} className="grid size-7 place-items-center rounded-full hover:bg-accent"><Minus className="size-3" /></button>
                  <span className="w-6 text-center text-sm">{r.qty}</span>
                  <button onClick={() => setQty(r.planId, r.qty + 1)} className="grid size-7 place-items-center rounded-full hover:bg-accent"><Plus className="size-3" /></button>
                </div>
                <span className="hidden w-28 text-end font-bold sm:block">{price(r.plan.price_iqd * r.qty)}</span>
                <button onClick={() => remove(r.planId)} aria-label={t("remove")} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <aside className="glass h-fit rounded-3xl p-6 lg:sticky lg:top-28 lg:mt-20">
        <div className="flex items-center justify-between text-lg">
          <span className="text-muted-foreground">{t("total")}</span>
          <span className="font-black text-gold">{price(total)}</span>
        </div>
        <button onClick={() => toast(t("checkout_soon"))} className="mt-6 w-full rounded-full bg-gold py-3.5 font-bold text-primary-foreground shadow-glow">
          {t("checkout")}
        </button>
        <p className="mt-3 text-center text-xs text-muted-foreground">{t("checkout_soon")}</p>
      </aside>
    </div>
  );
}
