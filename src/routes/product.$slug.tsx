import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Bell, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { productsQuery } from "@/lib/catalog";
import { useI18n, loc } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { BrandTile } from "@/components/site/BrandTile";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ context, params }) => {
    const all = await context.queryClient.ensureQueryData(productsQuery);
    const p = all.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return { name: p.name_en, desc: p.desc_en };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };
    const title = `${loaderData.name} — Pesha Store`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.desc },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.desc },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(productsQuery);
  const p = data.find((x) => x.slug === slug)!;
  const { t, lang, price } = useI18n();
  const { add } = useCart();
  const [planId, setPlanId] = useState(p.plans.find((x) => x.in_stock)?.id ?? p.plans[0]?.id);
  const plan = p.plans.find((x) => x.id === planId);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-10 sm:px-6 lg:grid-cols-2">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="lg:sticky lg:top-28 lg:self-start">
        <BrandTile brand={p.brand} category={p.category} accent={p.accent} size="lg" />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
        <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground">← {t("back")}</Link>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">{loc(p, "name", lang)}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{loc(p, "desc", lang)}</p>

        <h2 className="mt-10 text-sm font-semibold text-muted-foreground">{t("choose_plan")}</h2>
        <div className="mt-3 grid gap-3">
          {p.plans.map((pl) => {
            const active = pl.id === planId;
            return (
              <button
                key={pl.id}
                onClick={() => setPlanId(pl.id)}
                className={`relative flex items-center justify-between rounded-2xl border p-4 text-start transition-colors ${active ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40"}`}
              >
                <span className="flex items-center gap-3">
                  <span className={`grid size-6 place-items-center rounded-full border ${active ? "border-primary bg-gold text-primary-foreground" : "border-border"}`}>
                    {active && <Check className="size-3.5" />}
                  </span>
                  <span>
                    <span className="block font-semibold">{loc(pl, "label", lang)}</span>
                    <span className={`text-xs ${pl.in_stock ? "text-success" : "text-destructive"}`}>{pl.in_stock ? t("in_stock") : t("out_stock")}</span>
                  </span>
                </span>
                <span className="text-end">
                  {pl.old_price_iqd && <span className="block text-xs text-muted-foreground line-through">{price(pl.old_price_iqd)}</span>}
                  <span className="font-bold text-gold">{price(pl.price_iqd)}</span>
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {plan && (
            <motion.div key={plan.id + String(plan.in_stock)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8">
              {plan.in_stock ? (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    add({ planId: plan.id, productSlug: p.slug });
                    toast.success(t("added"));
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gold py-4 text-lg font-bold text-primary-foreground shadow-glow"
                >
                  <ShoppingBag className="size-5" /> {t("add_cart")} · {price(plan.price_iqd)}
                </motion.button>
              ) : (
                <button onClick={() => toast(t("restock"))} className="flex w-full items-center justify-center gap-2 rounded-full border border-primary py-4 font-semibold text-primary">
                  <Bell className="size-5" /> {t("restock")}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
