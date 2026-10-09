import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Globe, ShoppingBag, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useI18n, LANGS } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const { t, setLang, lang } = useI18n();
  const { count } = useCart();
  const [signedIn, setSignedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => {
      sub.subscription.unsubscribe();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const link = "rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground";
  return (
    <header className={`sticky top-0 z-40 transition-all ${scrolled ? "py-2" : "py-4"}`}>
      <div className={`mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full px-4 py-2 sm:px-6 ${scrolled ? "glass mx-3 shadow-card sm:mx-auto" : ""}`}>
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-gold font-display text-lg font-black text-primary-foreground">P</span>
          <span className="font-display text-lg font-bold tracking-tight" dir="ltr">Pesha<span className="text-gold"> Store</span></span>
        </Link>
        <nav className="hidden items-center md:flex">
          <Link to="/" className={link} activeProps={{ className: "text-foreground" }} activeOptions={{ exact: true }}>{t("nav_home")}</Link>
          <Link to="/shop" className={link} activeProps={{ className: "text-foreground" }}>{t("nav_shop")}</Link>
        </nav>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger className="grid size-10 place-items-center rounded-full hover:bg-secondary" aria-label="Language">
              <Globe className="size-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {LANGS.map((l) => (
                <DropdownMenuItem key={l.code} onClick={() => setLang(l.code)} className={lang === l.code ? "text-primary" : ""}>
                  {l.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/cart" className="relative grid size-10 place-items-center rounded-full hover:bg-secondary" aria-label={t("nav_cart")}>
            <ShoppingBag className="size-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -end-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-gold text-[11px] font-bold text-primary-foreground"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <Link
            to={signedIn ? "/account" : "/auth"}
            className="ms-1 flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            <User className="size-4" />
            <span className="hidden sm:inline">{signedIn ? t("nav_account") : t("nav_signin")}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-10 text-sm text-muted-foreground sm:flex-row">
        <span className="font-display font-bold text-foreground" dir="ltr">Pesha Store</span>
        <span>{t("footer")}</span>
        <span dir="ltr">© 2026</span>
      </div>
    </footer>
  );
}
