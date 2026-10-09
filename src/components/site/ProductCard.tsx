import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useI18n, loc } from "@/lib/i18n";
import type { Product } from "@/lib/catalog.functions";
import { BrandTile } from "./BrandTile";

export function ProductCard({ p, i = 0 }: { p: Product; i?: number }) {
  const { lang, t, price } = useI18n();
  const prices = p.plans.map((x) => x.price_iqd);
  const min = prices.length ? Math.min(...prices) : 0;
  const anyStock = p.plans.some((x) => x.in_stock);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
    >
      <Link
        to="/product/$slug"
        params={{ slug: p.slug }}
        className="group block rounded-3xl bg-surface p-3 shadow-card ring-1 ring-border transition-shadow hover:shadow-glow"
      >
        <BrandTile brand={p.brand} category={p.category} accent={p.accent} />
        <div className="flex items-end justify-between gap-3 px-2 pb-2 pt-4">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold">{loc(p, "name", lang)}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("from")} <span className="font-semibold text-gold">{price(min)}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs ${anyStock ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
              {anyStock ? t("in_stock") : t("out_stock")}
            </span>
            <span className="grid size-9 place-items-center rounded-full bg-secondary transition-all group-hover:bg-gold group-hover:text-primary-foreground rtl:-scale-x-100">
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
