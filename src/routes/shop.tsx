import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { productsQuery, CATEGORIES } from "@/lib/catalog";
import { useI18n, loc } from "@/lib/i18n";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "All products — Pesha Store" },
      { name: "description", content: "Browse streaming, music, AI, gaming and software subscriptions priced in IQD." },
      { property: "og:title", content: "All products — Pesha Store" },
      { property: "og:description", content: "Streaming, music, AI, gaming and software subscriptions in Kurdistan." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: Shop,
});

function Shop() {
  const { t, lang } = useI18n();
  const { data } = useSuspenseQuery(productsQuery);
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("all");
  const [q, setQ] = useState("");
  const list = data.filter(
    (p) =>
      (cat === "all" || p.category === cat) &&
      (!q || `${p.brand} ${loc(p, "name", lang)}`.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
      <h1 className="text-4xl font-black sm:text-5xl">{t("nav_shop")}</h1>
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCat(c)} className="relative rounded-full px-4 py-2 text-sm">
              {cat === c && (
                <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-gold" transition={{ type: "spring", bounce: 0.25, duration: 0.5 }} />
              )}
              <span className={`relative ${cat === c ? "font-semibold text-primary-foreground" : "text-muted-foreground"}`}>{t(c)}</span>
            </button>
          ))}
        </div>
        <label className="glass flex items-center gap-2 rounded-full px-4 py-2.5 md:w-80">
          <Search className="size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")} maxLength={60} className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </label>
      </div>
      <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p, i) => (
          <ProductCard key={p.id} p={p} i={i} />
        ))}
      </motion.div>
    </div>
  );
}
