import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Pesha Store" },
      { name: "description", content: "Sign in or create your Pesha Store account." },
      { property: "og:title", content: "Sign in — Pesha Store" },
      { property: "og:description", content: "Access your Pesha Store account." },
    ],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72),
  name: z.string().trim().max(100).optional(),
});

function AuthPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setBusy(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
      setBusy(false);
      if (error) return toast.error(error.message);
      navigate({ to: "/account" });
    } else {
      const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: { emailRedirectTo: `${window.location.origin}/account`, data: { full_name: parsed.data.name } },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success(t("check_email"));
    }
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) return toast.error(String(r.error.message ?? r.error));
    if (r.redirected) return;
    navigate({ to: "/account" });
  }

  const input = "w-full rounded-xl border border-input bg-background/60 px-4 py-3 outline-none transition-colors focus:border-primary";
  return (
    <div className="mx-auto max-w-md px-4 pt-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-8 shadow-card">
        <h1 className="text-3xl font-black">{mode === "in" ? t("signin") : t("signup")}</h1>
        <button onClick={google} className="mt-6 w-full rounded-xl border border-border bg-secondary py-3 font-semibold transition-colors hover:bg-accent">
          {t("google")}
        </button>
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />{t("or")}<span className="h-px flex-1 bg-border" /></div>
        <form onSubmit={submit} className="space-y-3">
          {mode === "up" && <input className={input} placeholder={t("name")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} />}
          <input className={input} type="email" placeholder={t("email")} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required dir="ltr" />
          <input className={input} type="password" placeholder={t("password")} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} dir="ltr" />
          <button disabled={busy} className="w-full rounded-xl bg-gold py-3 font-bold text-primary-foreground disabled:opacity-60">
            {mode === "in" ? t("signin") : t("signup")}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          {mode === "in" ? t("no_account") : t("have_account")}{" "}
          <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="font-semibold text-primary">
            {mode === "in" ? t("signup") : t("signin")}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
