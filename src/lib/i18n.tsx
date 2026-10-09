import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ku" | "en" | "ar";
export const LANGS: { code: Lang; label: string; dir: "rtl" | "ltr"; html: string }[] = [
  { code: "ku", label: "کوردی", dir: "rtl", html: "ckb" },
  { code: "en", label: "English", dir: "ltr", html: "en" },
  { code: "ar", label: "العربية", dir: "rtl", html: "ar" },
];

const dict = {
  ku: {
    nav_home: "سەرەکی", nav_shop: "بەرهەمەکان", nav_cart: "سەبەتە", nav_account: "هەژمار", nav_signin: "چوونەژوورەوە",
    hero_badge: "فرۆشگای فەرمیی بەشداریکردنی دیجیتاڵ",
    hero_title_1: "هەموو بەشداریکردنەکانت،", hero_title_2: "لە یەک شوێن.",
    hero_sub: "نێتفلیکس، سپۆتیفای، ChatGPT و زیاتر — بە دینار، بە خێرایی و بە پشتیوانیی کوردی.",
    cta_shop: "بینینی بەرهەمەکان", cta_how: "چۆن کار دەکات",
    trust_1: "گەیاندنی خێرا", trust_1d: "زۆربەی داواکارییەکان لە ماوەی چەند خولەکێکدا",
    trust_2: "پارەدانی ناوخۆیی", trust_2d: "نرخەکان بە دیناری عێراقی",
    trust_3: "پشتیوانیی ٢٤/٧", trust_3d: "چاتی ڕاستەوخۆ بە کوردی",
    featured: "بەرهەمە دیارەکان", featured_sub: "بەناوبانگترین بەشداریکردنەکان لە کوردستان",
    all: "هەموو", streaming: "فیلم و ڤیدیۆ", music: "مۆسیقا", ai: "زیرەکی دەستکرد", gaming: "یاری", software: "نەرمەکاڵا",
    from: "لە", in_stock: "بەردەستە", out_stock: "نەماوە", add_cart: "زیادکردن بۆ سەبەتە", added: "زیادکرا بۆ سەبەتە",
    choose_plan: "ماوەیەک هەڵبژێرە", view: "بینین", search: "گەڕان بە دوای بەرهەم...",
    cart_empty: "سەبەتەکەت بەتاڵە", total: "کۆی گشتی", checkout: "تەواوکردنی داواکاری", remove: "لابردن",
    checkout_soon: "شێوازەکانی پارەدان بەم زووانە زیاد دەکرێن.",
    signin: "چوونەژوورەوە", signup: "دروستکردنی هەژمار", email: "ئیمەیڵ", password: "وشەی نهێنی", name: "ناوی تەواو",
    google: "بەردەوامبوون لەگەڵ Google", or: "یان", no_account: "هەژمارت نییە؟", have_account: "هەژمارت هەیە؟",
    check_email: "بۆ چالاککردنی هەژمارەکەت سەیری ئیمەیڵەکەت بکە.",
    signout: "چوونەدەرەوە", welcome: "بەخێربێیت", phone: "ژمارەی مۆبایل", save: "پاشەکەوتکردن", saved: "پاشەکەوت کرا",
    orders: "داواکارییەکانم", no_orders: "هێشتا هیچ داواکارییەکت نییە.",
    footer: "بەشداریکردنی دیجیتاڵی ڕەسەن بۆ کوردستان.", restock: "ئاگادارم بکەرەوە کاتێک بەردەست بوو", back: "گەڕانەوە",
    currency: "د.ع",
  },
  en: {
    nav_home: "Home", nav_shop: "Products", nav_cart: "Cart", nav_account: "Account", nav_signin: "Sign in",
    hero_badge: "Authorized digital subscription store",
    hero_title_1: "All your subscriptions,", hero_title_2: "in one place.",
    hero_sub: "Netflix, Spotify, ChatGPT and more — priced in dinar, delivered fast, supported locally.",
    cta_shop: "Browse products", cta_how: "How it works",
    trust_1: "Fast delivery", trust_1d: "Most orders fulfilled within minutes",
    trust_2: "Local payment", trust_2d: "Prices in Iraqi dinar",
    trust_3: "24/7 support", trust_3d: "Live chat in Kurdish, English and Arabic",
    featured: "Featured", featured_sub: "The most popular subscriptions in Kurdistan",
    all: "All", streaming: "Streaming", music: "Music", ai: "AI", gaming: "Gaming", software: "Software",
    from: "From", in_stock: "In stock", out_stock: "Out of stock", add_cart: "Add to cart", added: "Added to cart",
    choose_plan: "Choose a plan", view: "View", search: "Search products...",
    cart_empty: "Your cart is empty", total: "Total", checkout: "Checkout", remove: "Remove",
    checkout_soon: "Payment methods are coming soon.",
    signin: "Sign in", signup: "Create account", email: "Email", password: "Password", name: "Full name",
    google: "Continue with Google", or: "or", no_account: "No account yet?", have_account: "Already have an account?",
    check_email: "Check your email to confirm your account.",
    signout: "Sign out", welcome: "Welcome", phone: "Phone number", save: "Save", saved: "Saved",
    orders: "My orders", no_orders: "You have no orders yet.",
    footer: "Authentic digital subscriptions for Kurdistan.", restock: "Notify me when available", back: "Back",
    currency: "IQD",
  },
  ar: {
    nav_home: "الرئيسية", nav_shop: "المنتجات", nav_cart: "السلة", nav_account: "الحساب", nav_signin: "تسجيل الدخول",
    hero_badge: "متجر اشتراكات رقمية معتمد",
    hero_title_1: "كل اشتراكاتك،", hero_title_2: "في مكان واحد.",
    hero_sub: "نتفليكس، سبوتيفاي، ChatGPT والمزيد — بالدينار، بسرعة، ومع دعم محلي.",
    cta_shop: "تصفح المنتجات", cta_how: "كيف يعمل",
    trust_1: "تسليم سريع", trust_1d: "معظم الطلبات خلال دقائق",
    trust_2: "دفع محلي", trust_2d: "الأسعار بالدينار العراقي",
    trust_3: "دعم ٢٤/٧", trust_3d: "دردشة مباشرة بثلاث لغات",
    featured: "منتجات مميزة", featured_sub: "أشهر الاشتراكات في كردستان",
    all: "الكل", streaming: "بث", music: "موسيقى", ai: "ذكاء اصطناعي", gaming: "ألعاب", software: "برامج",
    from: "من", in_stock: "متوفر", out_stock: "نفد", add_cart: "أضف إلى السلة", added: "أضيف إلى السلة",
    choose_plan: "اختر المدة", view: "عرض", search: "ابحث عن منتج...",
    cart_empty: "سلتك فارغة", total: "المجموع", checkout: "إتمام الطلب", remove: "إزالة",
    checkout_soon: "طرق الدفع ستتوفر قريباً.",
    signin: "تسجيل الدخول", signup: "إنشاء حساب", email: "البريد الإلكتروني", password: "كلمة المرور", name: "الاسم الكامل",
    google: "المتابعة مع Google", or: "أو", no_account: "ليس لديك حساب؟", have_account: "لديك حساب؟",
    check_email: "تحقق من بريدك لتأكيد حسابك.",
    signout: "تسجيل الخروج", welcome: "مرحباً", phone: "رقم الهاتف", save: "حفظ", saved: "تم الحفظ",
    orders: "طلباتي", no_orders: "لا توجد طلبات بعد.",
    footer: "اشتراكات رقمية أصلية لكردستان.", restock: "نبهني عند التوفر", back: "رجوع",
    currency: "د.ع",
  },
} as const;

export type TKey = keyof typeof dict.en;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string; dir: "rtl" | "ltr"; price: (n: number) => string };
const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ku");
  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved && dict[saved]) setLangState(saved);
  }, []);
  const meta = LANGS.find((l) => l.code === lang)!;
  useEffect(() => {
    document.documentElement.lang = meta.html;
    document.documentElement.dir = meta.dir;
  }, [meta]);
  const setLang = (l: Lang) => {
    localStorage.setItem("lang", l);
    setLangState(l);
  };
  const t = (k: TKey) => dict[lang][k];
  const price = (n: number) => `${new Intl.NumberFormat("en-US").format(n)} ${dict[lang].currency}`;
  return <I18nContext.Provider value={{ lang, setLang, t, dir: meta.dir, price }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const c = useContext(I18nContext);
  if (!c) throw new Error("useI18n outside provider");
  return c;
}

/** Pick the localized field (e.g. name_ku / name_en / name_ar) from a record. */
export function loc<T extends Record<string, unknown>>(obj: T, field: string, lang: Lang): string {
  return String(obj[`${field}_${lang}`] ?? obj[`${field}_en`] ?? "");
}
