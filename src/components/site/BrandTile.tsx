import { Clapperboard, Music2, Sparkles, Gamepad2, AppWindow } from "lucide-react";

const icons = { streaming: Clapperboard, music: Music2, ai: Sparkles, gaming: Gamepad2, software: AppWindow } as const;

export function BrandTile({ brand, category, accent, size = "md" }: { brand: string; category: string; accent: string; size?: "md" | "lg" }) {
  const Icon = icons[category as keyof typeof icons] ?? Sparkles;
  const big = size === "lg";
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border ${big ? "aspect-[4/3]" : "aspect-[16/10]"}`}
      style={{ background: `radial-gradient(120% 90% at 20% 10%, ${accent}55, transparent 60%), linear-gradient(160deg, ${accent}22, transparent)` }}
    >
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:14px_14px] text-foreground/20" />
      <Icon className={`absolute end-4 top-4 text-foreground/70 ${big ? "size-8" : "size-5"}`} />
      <span className={`absolute bottom-4 start-5 font-display font-extrabold tracking-tight text-foreground ${big ? "text-5xl" : "text-2xl"}`} dir="ltr">
        {brand}
      </span>
    </div>
  );
}
