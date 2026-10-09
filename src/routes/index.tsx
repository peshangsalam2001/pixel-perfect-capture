import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowLeft, Zap, Wallet, MessageCircle } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { productsQuery } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pesha Store — Netflix, Spotify, ChatGPT in Kurdistan" },
      { name: "description", content: "Buy Netflix, Spotify, ChatGPT, Xbox Game Pass and more in Iraqi dinar. Fast delivery and Kurdish support." },
      { property: "og:title", content: "Pesha Store — Digital subscriptions for Kurdistan" },
      { property: "og:description", content: "Premium digital subscriptions priced in IQD with fast delivery." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: Home,
});

const ease = [0.22, 1, 0.36, 1] as const;

function Home() {
  const { t } = useI18n();
  const { data } = useSuspenseQuery(productsQuery);
  const featured = data.filter((p) => p.featured);
  const brands = data.map((p) => p.brand);

  return (
    <div>
      <section className="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border shadow-card">
          <motion.img
            src={hero}
            alt=""
            width={1600}
            height={1008}
            initial={{ scale: 1.12, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />
          <div className="relative flex min-h-[78vh] flex-col justify-end p-6 sm:p-12 lg:p-16">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease }}
              className="glass mb-6 w-fit rounded-full px-4 py-1.5 text-xs text-primary"
            >
              ✦ {t("hero_badge")}
            </motion.span>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.15] tracking-tight sm:text-7xl">
              {[t("hero_title_1"), t("hero_title_2")].map((line, i) => (
                <motion.span
                  key={line}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.15, duration: 0.8, ease }}
                  className={`block ${i === 1 ? "text-gold" : ""}`}
                >
                  {line}
                </motion.span>
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="mt-6 max-w-xl text-lg text-muted-foreground"
            >
              {t("hero_sub")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.6, ease }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link to="/shop" className="group flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]">
                {t("cta_shop")}
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="relative mt-10 overflow-hidden py-4 [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]" dir="ltr">
        <motion.div
          className="flex w-max gap-14 font-display text-3xl font-extrabold text-muted-foreground/40"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...brands, ...brands, ...brands, ...brands].map((b, i) => (
            <span key={i}>{b}</span>
          ))}
        </motion.div>
      </div>

      <section className="mx-auto mt-14 grid max-w-7xl gap-4 px-4 sm:grid-cols-3 sm:px-6">
        {[
          { icon: Zap, title: t("trust_1"), d: t("trust_1d") },
          { icon: Wallet, title: t("trust_2"), d: t("trust_2d") },
          { icon: MessageCircle, title: t("trust_3"), d: t("trust_3d") },
        ].map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5, ease }}
            className="rounded-3xl bg-surface p-6 ring-1 ring-border"
          >
            <span className="grid size-11 place-items-center rounded-2xl bg-primary/15 text-primary">
              <f.icon className="size-5" />
            </span>
            <h3 className="mt-4 font-bold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
          </motion.div>
        ))}
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black sm:text-4xl">{t("featured")}</h2>
            <p className="mt-2 text-muted-foreground">{t("featured_sub")}</p>
          </div>
          <Link to="/shop" className="text-sm text-primary hover:underline">{t("nav_shop")} ←</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
