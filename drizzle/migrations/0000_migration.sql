create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  brand text not null,
  category text not null,
  accent text not null default '#e8b04b',
  name_ku text not null, name_en text not null, name_ar text not null,
  desc_ku text not null default '', desc_en text not null default '', desc_ar text not null default '',
  featured boolean not null default false,
  sort int not null default 0,
  created_at timestamptz not null default now()
);
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  months int not null,
  label_ku text not null, label_en text not null, label_ar text not null,
  price_iqd int not null,
  old_price_iqd int,
  in_stock boolean not null default true,
  sort int not null default 0
);
grant select on public.products, public.plans to anon, authenticated;
grant all on public.products, public.plans to service_role;
alter table public.products enable row level security;
alter table public.plans enable row level security;
create policy "public read products" on public.products for select to anon, authenticated using (true);
create policy "public read plans" on public.plans for select to anon, authenticated using (true);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data->>'full_name') on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

insert into public.products (slug, brand, category, accent, name_ku, name_en, name_ar, desc_ku, desc_en, desc_ar, featured, sort) values
('netflix','Netflix','streaming','#e50914','نێتفلیکس پریمیەم','Netflix Premium','نتفليكس بريميوم','فیلم و زنجیرەکان بە کوالیتی 4K','Films and series in 4K Ultra HD','أفلام ومسلسلات بدقة 4K',true,1),
('spotify','Spotify','music','#1db954','سپۆتیفای پریمیەم','Spotify Premium','سبوتيفاي بريميوم','مۆسیقای بێ ڕیکلام و داونلۆد','Ad-free music with offline downloads','موسيقى بلا إعلانات مع التنزيل',true,2),
('chatgpt','ChatGPT','ai','#10a37f','چات جی پی تی پلەس','ChatGPT Plus','تشات جي بي تي بلس','دەستگەیشتن بە باشترین مۆدێلەکانی AI','Access to the most capable AI models','الوصول إلى أقوى نماذج الذكاء الاصطناعي',true,3),
('xbox','Xbox','gaming','#107c10','ئێکسبۆکس گەیم پاس ئەڵتیمەیت','Xbox Game Pass Ultimate','إكس بوكس جيم باس ألتيميت','سەدان یاری بۆ کۆنسۆڵ و کۆمپیوتەر','Hundreds of games on console and PC','مئات الألعاب على الكونسول والكمبيوتر',true,4),
('youtube','YouTube','streaming','#ff0033','یوتیوب پریمیەم','YouTube Premium','يوتيوب بريميوم','ڤیدیۆی بێ ڕیکلام و پەخشی پاشبنەما','Ad-free videos and background play','فيديو بلا إعلانات وتشغيل بالخلفية',false,5),
('canva','Canva','software','#00c4cc','کانڤا پرۆ','Canva Pro','كانفا برو','دیزاین بە ئامرازە پرۆفیشناڵەکان','Design with professional tools','تصميم بأدوات احترافية',false,6),
('office','Microsoft 365','software','#d83b01','مایکرۆسۆفت ٣٦٥','Microsoft 365','مايكروسوفت 365','وۆرد، ئێکسڵ و ١ تێرابایت کڵاود','Word, Excel and 1 TB cloud storage','وورد وإكسل و1 تيرابايت تخزين',false,7),
('playstation','PlayStation','gaming','#0070d1','پلەیستەیشن پلەس','PlayStation Plus','بلايستيشن بلس','یاری ئۆنلاین و یاری مانگانە','Online play and monthly games','لعب أونلاين وألعاب شهرية',false,8);

insert into public.plans (product_id, months, label_ku, label_en, label_ar, price_iqd, old_price_iqd, in_stock, sort)
select p.id, v.months, v.lku, v.len, v.lar, v.price, v.old, v.stock, v.sort from public.products p
join (values
 ('netflix',1,'١ مانگ','1 month','شهر واحد',12000,null,true,1),
 ('netflix',3,'٣ مانگ','3 months','3 أشهر',33000,36000,true,2),
 ('netflix',12,'١ ساڵ','1 year','سنة',120000,144000,false,3),
 ('spotify',1,'١ مانگ','1 month','شهر واحد',6000,null,true,1),
 ('spotify',12,'١ ساڵ','1 year','سنة',60000,72000,true,2),
 ('chatgpt',1,'١ مانگ','1 month','شهر واحد',32000,null,true,1),
 ('chatgpt',3,'٣ مانگ','3 months','3 أشهر',92000,96000,true,2),
 ('xbox',1,'١ مانگ','1 month','شهر واحد',22000,null,true,1),
 ('xbox',3,'٣ مانگ','3 months','3 أشهر',60000,66000,false,2),
 ('youtube',1,'١ مانگ','1 month','شهر واحد',7000,null,true,1),
 ('youtube',12,'١ ساڵ','1 year','سنة',70000,84000,true,2),
 ('canva',12,'١ ساڵ','1 year','سنة',25000,40000,true,1),
 ('office',12,'١ ساڵ','1 year','سنة',55000,null,true,1),
 ('playstation',1,'١ مانگ','1 month','شهر واحد',15000,null,true,1),
 ('playstation',12,'١ ساڵ','1 year','سنة',110000,null,false,2)
) as v(slug,months,lku,len,lar,price,old,stock,sort) on v.slug = p.slug;