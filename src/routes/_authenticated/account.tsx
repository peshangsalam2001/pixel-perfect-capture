import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { LogOut, Package } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "My account — Pesha Store" },
      { name: "description", content: "Manage your Pesha Store profile and orders." },
      { property: "og:title", content: "My account — Pesha Store" },
      { property: "og:description", content: "Manage your profile and orders." },
    ],
  }),
  component: Account,
});

function Account() {
  const { t } = useI18n();
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: profile } = useQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => (await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()).data,
  });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  useEffect(() => {
    if (profile) {
      setName(profile.full_name ?? "");
      setPhone(profile.phone ?? "");
    }
  }, [profile]);

  async function save() {
    const { error } = await supabase.from("profiles").upsert({ id: user.id, full_name: name.trim().slice(0, 100), phone: phone.trim().slice(0, 20) });
    if (error) { toast.error(error.message); return; }
    toast.success(t("saved"));
  }
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const input = "w-full rounded-xl border border-input bg-background/60 px-4 py-3 outline-none focus:border-primary";
  return (
    <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">{t("welcome")}</p>
          <h1 className="text-4xl font-black">{name || user.email}</h1>
        </div>
        <button onClick={signOut} className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary">
          <LogOut className="size-4" /> {t("signout")}
        </button>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-surface p-6 ring-1 ring-border">
          <h2 className="font-bold">{t("nav_account")}</h2>
          <div className="mt-4 space-y-3">
            <input className={input} value={user.email ?? ""} disabled dir="ltr" />
            <input className={input} placeholder={t("name")} value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
            <input className={input} placeholder={t("phone")} value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} dir="ltr" />
            <button onClick={save} className="rounded-full bg-gold px-6 py-2.5 font-semibold text-primary-foreground">{t("save")}</button>
          </div>
        </motion.section>
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-3xl bg-surface p-6 ring-1 ring-border">
          <h2 className="font-bold">{t("orders")}</h2>
          <div className="mt-8 flex flex-col items-center text-center text-muted-foreground">
            <Package className="size-10" />
            <p className="mt-3 text-sm">{t("no_orders")}</p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
