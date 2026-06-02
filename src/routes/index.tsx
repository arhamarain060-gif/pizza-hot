import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  Phone, MapPin, Clock, Mail, ShoppingCart, X, Plus, Minus, Star,
  Flame, Truck, Sparkles, Facebook, MessageCircle, ChefHat, ShieldCheck,
  Menu as MenuIcon, Send, Bot, User as UserIcon, Award, Leaf,
} from "lucide-react";
import logo from "@/assets/logo.png";
import heroPizza from "@/assets/hero-pizza.jpg";
import imgSeekh from "@/assets/pizza-seekh.jpg";
import imgAfghani from "@/assets/pizza-afghani.jpg";
import imgTikka from "@/assets/pizza-tikka.jpg";
import imgFajita from "@/assets/pizza-fajita.jpg";
import imgSupreme from "@/assets/pizza-supreme.jpg";
import imgBurger from "@/assets/burger-zinger.jpg";
import imgShawarma from "@/assets/shawarma.jpg";
import imgWings from "@/assets/sides-wings.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    links: [
      { rel: "preload", as: "image", href: heroPizza, fetchpriority: "high" },
    ],
  }),
});

// ============ Config ============
const WHATSAPP = "923173821766";
const PHONE_1 = "+923173821766";
const PHONE_2 = "+923198315723";
const FACEBOOK = "https://www.facebook.com/p/Pizza-Hot-100067487342420/";
const MAPS = "https://www.google.com/maps/place/Pizza+hot/@27.8520306,69.1015385,17z";

type MenuItem = { id: string; cat: string; name: string; desc: string; img: string; prices: Record<string, number>; badge?: string };
const MENU: MenuItem[] = [
  // Pizzas
  { id: "p1", cat: "Pizza", name: "Seekh Kabab Pizza", desc: "Juicy seekh kabab chunks, onions, mozzarella & our signature sauce.", img: imgSeekh, prices: { Small: 500, Medium: 800, Large: 1100 }, badge: "Bestseller" },
  { id: "p2", cat: "Pizza", name: "Afghani Pizza", desc: "Smoky grilled chicken with green chillies and creamy white sauce.", img: imgAfghani, prices: { Small: 550, Medium: 850, Large: 1150 }, badge: "Signature" },
  { id: "p3", cat: "Pizza", name: "Chicken Tikka Pizza", desc: "Classic spicy tikka with capsicum, onions and bubbling cheese.", img: imgTikka, prices: { Small: 550, Medium: 850, Large: 1150 } },
  { id: "p4", cat: "Pizza", name: "Chicken Fajita Pizza", desc: "Mexican-spiced fajita chicken, bell peppers and onions.", img: imgFajita, prices: { Small: 550, Medium: 850, Large: 1150 } },
  { id: "p5", cat: "Pizza", name: "Super Supreme Pizza", desc: "Loaded with every premium topping. The ultimate pizza experience.", img: imgSupreme, prices: { Small: 650, Medium: 950, Large: 1300 }, badge: "Loaded" },
  { id: "p6", cat: "Pizza", name: "Peri Peri Pizza", desc: "Fiery peri peri chicken with extra cheese and a smoky kick.", img: imgTikka, prices: { Small: 600, Medium: 900, Large: 1200 } },
  { id: "p7", cat: "Pizza", name: "Tandoori Pizza", desc: "Charcoal-grilled tandoori chicken with onions and coriander.", img: imgAfghani, prices: { Small: 600, Medium: 900, Large: 1200 } },
  { id: "p8", cat: "Pizza", name: "Creamy Stuffed Crust", desc: "Top-ordered! Creamy filling stuffed inside a golden crust.", img: imgSupreme, prices: { Medium: 1100, Large: 1450 }, badge: "Top Order" },

  // Burgers
  { id: "b1", cat: "Burgers", name: "Mighty Zinger Burger", desc: "Double crispy chicken fillet, fresh lettuce, cheese & spicy mayo.", img: imgBurger, prices: { Single: 350, "With Fries+Drink": 550 }, badge: "Hot" },
  { id: "b2", cat: "Burgers", name: "Zinger Burger", desc: "Crispy fried chicken fillet with creamy sauce in a soft bun.", img: imgBurger, prices: { Single: 250, "With Fries+Drink": 450 } },
  { id: "b3", cat: "Burgers", name: "Tower Burger", desc: "Towering crispy chicken with hash brown, cheese & jalapeños.", img: imgBurger, prices: { Single: 450, "With Fries+Drink": 650 } },
  { id: "b4", cat: "Burgers", name: "Chicken Patty Burger", desc: "Grilled chicken patty with cheese and fresh garden veggies.", img: imgBurger, prices: { Single: 220, "With Fries+Drink": 400 } },

  // Shawarma & Rolls
  { id: "s1", cat: "Shawarma & Rolls", name: "Zinger Shawarma", desc: "Crispy zinger strips wrapped with garlic mayo and fresh veggies.", img: imgShawarma, prices: { Small: 200, Large: 350 } },
  { id: "s2", cat: "Shawarma & Rolls", name: "Cheese Shawarma", desc: "Loaded with melted cheese and grilled chicken.", img: imgShawarma, prices: { Small: 220, Large: 380 }, badge: "Bestseller" },
  { id: "s3", cat: "Shawarma & Rolls", name: "Jalapeno Shawarma", desc: "Spicy jalapeño kick with grilled chicken and creamy sauce.", img: imgShawarma, prices: { Small: 230, Large: 390 } },
  { id: "s4", cat: "Shawarma & Rolls", name: "Paratha Roll", desc: "Flaky paratha rolled with grilled chicken, onions and chutney.", img: imgShawarma, prices: { Single: 180, Double: 320 } },

  // Sides
  { id: "x1", cat: "Sides", name: "Hot Shots", desc: "Crispy spicy chicken bites — perfect for sharing.", img: imgWings, prices: { Regular: 250, Large: 400 } },
  { id: "x2", cat: "Sides", name: "French Fries", desc: "Golden crispy fries with our signature seasoning.", img: imgWings, prices: { Regular: 150, Large: 250 } },
  { id: "x3", cat: "Sides", name: "Crispy Wings", desc: "Juicy chicken wings, fried to crispy perfection.", img: imgWings, prices: { "6 pcs": 350, "12 pcs": 650 } },
  { id: "x4", cat: "Sides", name: "Soft Drink", desc: "Chilled 345ml can of your favourite soft drink.", img: imgWings, prices: { Can: 80, "1.5L Bottle": 220 } },
];

const CATEGORIES = ["Pizza", "Burgers", "Shawarma & Rolls", "Sides"] as const;

type CartItem = { id: string; name: string; size: string; price: number; qty: number };

// ============ Helpers ============
const waLink = (msg: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const add = (it: CartItem) =>
    setItems((p) => {
      const key = it.id + it.size;
      const ex = p.find((x) => x.id + x.size === key);
      return ex ? p.map((x) => (x.id + x.size === key ? { ...x, qty: x.qty + 1 } : x)) : [...p, it];
    });
  const remove = (key: string) => setItems((p) => p.filter((x) => x.id + x.size !== key));
  const inc = (key: string) => setItems((p) => p.map((x) => (x.id + x.size === key ? { ...x, qty: x.qty + 1 } : x)));
  const dec = (key: string) =>
    setItems((p) =>
      p.flatMap((x) => (x.id + x.size === key ? (x.qty > 1 ? [{ ...x, qty: x.qty - 1 }] : []) : [x])),
    );
  const total = items.reduce((s, x) => s + x.price * x.qty, 0);
  const count = items.reduce((s, x) => s + x.qty, 0);
  return { items, add, remove, inc, dec, total, count, clear: () => setItems([]) };
}

// ============ Components ============
function Navbar({ count, onCart }: { count: number; onCart: () => void }) {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#menu", label: "Menu" },
    { href: "#deals", label: "Deals" },
    { href: "#about", label: "About" },
    { href: "#story", label: "Our Story" },
    { href: "#contact", label: "Contact" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3" aria-label="Pizza Hot Pano Aqil home">
          <img src={logo} alt="Pizza Hot Pano Aqil logo" width={44} height={44} className="h-11 w-11 rounded-full object-cover ring-2 ring-brand-red/40" />
          <div className="leading-tight">
            <div className="text-lg font-extrabold tracking-tight">Pizza Hot</div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Pano Aqil</div>
          </div>
        </a>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-foreground/90 transition hover:text-brand-red">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <a href={`tel:${PHONE_1}`} className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-foreground/90 hover:text-brand-red sm:inline-flex">
            <Phone className="h-4 w-4" /> 0317 3821766
          </a>
          <button
            onClick={onCart}
            aria-label={`Open cart with ${count} item${count === 1 ? "" : "s"}`}
            className="relative inline-flex items-center gap-2 rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-red/30 transition hover:brightness-110"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span aria-hidden="true" className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-yellow px-1 text-[11px] font-bold text-black">
                {count}
              </span>
            )}
          </button>
          <button onClick={() => setOpen((v) => !v)} className="rounded-md p-2 lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                {l.label}
              </a>
            ))}
            <a href={`tel:${PHONE_1}`} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">📞 0317 3821766</a>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img src={heroPizza} alt="Freshly baked supreme pizza with melted mozzarella, pepperoni and basil" width={1920} height={1280} fetchPriority="high" decoding="async" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="max-w-2xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-black">
            <Flame className="h-3.5 w-3.5" /> Pano Aqil's #1 Pizzeria
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Authentic Wood-Fired Pizza,{" "}
            <span className="text-brand-yellow">Delivered Hot</span> in Pano Aqil.
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/90 sm:text-lg">
            Hand-stretched dough, premium mozzarella, and our signature Afghani &amp; Seekh Kabab pizzas — freshly fired and at your door in 30 minutes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#menu" className="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-brand-red/30 transition hover:brightness-110">
              View Full Menu
            </a>
            <a href={`tel:${PHONE_1}`} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/10">
              <Phone className="h-4 w-4" /> Call: 0317 3821766
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex" aria-label="Rated 5 out of 5 stars">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-brand-yellow text-brand-yellow" />)}</div>
              <span><b>5.0</b> <span className="text-white/70">Google rated</span></span>
            </div>
            <div className="flex items-center gap-2"><Flame className="h-4 w-4 text-brand-yellow" /><span><b>10,000+</b> <span className="text-white/70">happy customers</span></span></div>
            <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-brand-yellow" /><span><b>Free</b> <span className="text-white/70">delivery in Pano Aqil</span></span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Ticker() {
  const items = ["🍕 Seekh Kabab Pizza", "🔥 Afghani Special", "🍔 Mighty Zinger Burger", "🌯 Cheese Shawarma", "🍗 Crispy Wings", "✨ Free Delivery in Pano Aqil"];
  const row = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-y border-border bg-brand-yellow py-3 text-black">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap px-4 text-sm font-bold uppercase tracking-wider">
        {row.map((t, i) => <span key={i} className="flex items-center gap-2">{t} <span className="opacity-40">•</span></span>)}
      </div>
    </div>
  );
}

function MenuCard({ item, onAdd }: { item: MenuItem; onAdd: (c: CartItem) => void }) {
  const sizes = Object.keys(item.prices);
  const [size, setSize] = useState(sizes[0]);
  const price = (item.prices as Record<string, number>)[size];
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:border-brand-red/50 hover:shadow-2xl hover:shadow-brand-red/10">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={item.img} alt={item.name} loading="lazy" width={1024} height={768} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
        {item.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-red px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg">
            {item.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold">{item.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
        <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label={`${item.name} size options`}>
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              aria-pressed={size === s}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                size === s ? "bg-brand-yellow text-black" : "bg-muted text-foreground/80 hover:bg-muted/70"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="mt-auto flex items-end justify-between pt-5">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Price</div>
            <div className="text-xl font-extrabold text-brand-yellow">PKR {price}</div>
          </div>
          <button
            onClick={() => onAdd({ id: item.id, name: item.name, size, price, qty: 1 })}
            aria-label={`Add ${item.name} (${size}) to cart`}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-red/30 transition hover:brightness-110"
          >
            <Plus className="h-4 w-4" aria-hidden="true" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuSection({ onAdd }: { onAdd: (c: CartItem) => void }) {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("Pizza");
  const items = useMemo(() => MENU.filter((m) => m.cat === cat), [cat]);
  return (
    <section id="menu" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-red">Our Menu</span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">Crafted with Fire &amp; Love</h2>
        <p className="mt-4 text-muted-foreground">Every pizza hand-stretched, every burger fresh-fried. Choose your favourite below.</p>
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Menu categories">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            role="tab"
            aria-selected={cat === c}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              cat === c ? "bg-brand-red text-white shadow-lg shadow-brand-red/30" : "bg-card text-foreground/90 hover:bg-muted"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => <MenuCard key={it.id} item={it} onAdd={onAdd} />)}
      </div>
    </section>
  );
}

function Deals() {
  const deals = [
    { title: "Pizza Hot Combo", desc: "Medium Pizza + Zinger Burger + French Fries + Drink.", tag: "PKR 1,499", save: "Save Rs. 250", msg: "Hi! I want to order the Pizza Hot Combo (PKR 1,499)." },
    { title: "Family Feast", desc: "Large Pizza + 2 Zinger Burgers + 4 Soft Drinks + Fries.", tag: "PKR 2,299", save: "Save Rs. 400", msg: "Hi! I want to order the Family Feast (PKR 2,299)." },
    { title: "Student Saver", desc: "Small Pizza + Zinger Burger + Drink — perfect lunch deal.", tag: "PKR 799", save: "Save Rs. 150", msg: "Hi! I want to order the Student Saver (PKR 799)." },
  ];
  return (
    <section id="deals" className="border-y border-border bg-gradient-to-br from-brand-red via-brand-red to-[oklch(0.45_0.18_25)] py-20 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
            <Flame className="h-3.5 w-3.5" /> Signature Combos
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">Bigger Bites. Better Prices.</h2>
          <p className="mt-4 text-white/90">Curated combos for every craving — built to share, priced to love.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {deals.map((d) => (
            <div key={d.title} className="rounded-2xl border border-white/15 bg-black/25 p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-black/35">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-yellow">● Available Now</div>
              <h3 className="mt-3 text-xl font-extrabold">{d.title}</h3>
              <p className="mt-2 text-sm text-white/90">{d.desc}</p>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-white/70">Only</div>
                  <div className="text-2xl font-extrabold text-brand-yellow">{d.tag}</div>
                  {d.save && <div className="text-xs font-semibold text-white/90">{d.save}</div>}
                </div>
                <a
                  href={waLink(d.msg)} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-black hover:bg-white/90"
                >
                  <MessageCircle className="h-4 w-4" /> Order
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  const features = [
    { icon: ChefHat, title: "Fresh Ingredients", desc: "Premium dough, imported mozzarella and locally-sourced toppings — never frozen, always fresh." },
    { icon: Truck, title: "30-Minute Delivery", desc: "Steaming hot to your door anywhere across Pano Aqil — guaranteed fast." },
    { icon: ShieldCheck, title: "Hygienic Kitchen", desc: "Spotless prep stations, gloved hands and quality checks on every single order." },
    { icon: Award, title: "5-Star Rated", desc: "Trusted by 10,000+ customers with consistent 5-star Google and Facebook reviews." },
    { icon: Leaf, title: "Halal Certified", desc: "100% halal meat, sourced from certified suppliers. Quality you can trust." },
    { icon: Flame, title: "Wood-Fired Crust", desc: "Hand-stretched, slow-fermented dough — fired to perfection in our stone oven." },
  ];
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-red">Why Choose Us</span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">Crafted Better. Tasted Better.</h2>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-2xl border border-border bg-card p-7 transition hover:border-brand-red/50 hover:-translate-y-1">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-red/15 text-brand-red">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Story() {
  const stats = [
    { v: "10K+", l: "Happy Customers" },
    { v: "5.0★", l: "Google Rating" },
    { v: "30 Min", l: "Avg Prep Time" },
    { v: "100%", l: "Halal Certified" },
  ];
  return (
    <section id="story" className="border-y border-border bg-card/40 py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-red">Our Story</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">A taste of passion, baked into every slice.</h2>
          <p className="mt-5 text-foreground/90">
            Born in the heart of Pano Aqil at Baiji Chowk, Pizza Hot started with one mission — bring world-class pizza to our community at prices everyone can enjoy.
          </p>
          <p className="mt-4 text-foreground/85">
            From hand-stretched dough to locally sourced ingredients and our signature seekh kabab topping, every order is made fresh, hot, and unforgettable. Dine in with family, take it home, or order on WhatsApp — the experience is always premium.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((s) => (
            <div key={s.l} className="rounded-2xl border border-border bg-background/60 p-6 text-center">
              <div className="text-3xl font-extrabold text-brand-yellow sm:text-4xl">{s.v}</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    { src: "Google", name: "Ahmed K.", text: "The Zinger burger is OUTCLASS! Best fast food spot at Baiji Chowk. Always fresh." },
    { src: "Google", name: "Sana M.", text: "Best pizza in Pano Aqil. Always fresh and served piping hot. Family loves it!" },
    { src: "Facebook", name: "Bilal Ahmed", text: "Amazing service, fast WhatsApp delivery. Cheese shawarma is heavenly. 5 stars!" },
    { src: "Google", name: "Fatima R.", text: "Their Seekh Kabab pizza is unmatched in flavor. Affordable and very generous portions." },
    { src: "Facebook", name: "Usman Ali", text: "Ordered the Family Feast for Eid — everyone loved it. Highly recommended in Pano Aqil." },
    { src: "Google", name: "Hina Khan", text: "Hygienic, hot, and quick. The Afghani pizza is my new favourite. Will order again!" },
    { src: "Facebook", name: "Zaid M.", text: "Crispy wings + zinger combo is unbeatable. Pizza Hot never disappoints." },
    { src: "Google", name: "Ayesha N.", text: "Late night cravings sorted! They deliver hot and on time. Great taste, great prices." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-red">Customer Love</span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">What Our Customers Say</h2>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          <div className="flex" aria-label="Rated 5 out of 5 stars">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-brand-yellow text-brand-yellow" />)}</div>
          <span><b>5.0</b> · <span className="text-muted-foreground">Google &amp; Facebook reviews</span></span>
        </div>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {reviews.map((r, i) => (
          <div key={i} className="flex flex-col rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-red">{r.src}</span>
              <div className="flex" aria-label="5 stars">{[...Array(5)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-brand-yellow text-brand-yellow" />)}</div>
            </div>
            <p className="mt-3 flex-1 text-sm text-foreground/90">"{r.text}"</p>
            <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-red/20 text-sm font-bold text-brand-red" aria-hidden="true">
                {r.name[0]}
              </div>
              <div>
                <div className="text-sm font-semibold">{r.name}</div>
                <div className="text-[11px] text-muted-foreground">Verified Customer</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="border-t border-border bg-card/40 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-red">Visit Us</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">Find Pizza Hot</h2>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="grid gap-4">
            {[
              { icon: MapPin, title: "Our Location", body: "Baiji Chowk, Near Motorway Office, Pano Aqil, Sindh 65120", link: { href: MAPS, label: "Open in Google Maps →" } },
              { icon: Phone, title: "Order on Call / WhatsApp", body: <>Order Line 1: <a className="text-brand-yellow hover:underline" href={`tel:${PHONE_1}`}>0317 3821766</a><br/>Order Line 2: <a className="text-brand-yellow hover:underline" href={`tel:${PHONE_2}`}>0319 8315723</a></> },
              { icon: Mail, title: "Email", body: <a className="text-brand-yellow hover:underline" href="mailto:pizzahotpanoaqil@gmail.com">pizzahotpanoaqil@gmail.com</a> },
              { icon: Clock, title: "Opening Hours", body: "Open Daily • 12:00 PM – 1:00 AM" },
            ].map((c, i) => (
              <div key={i} className="flex gap-4 rounded-2xl border border-border bg-background/60 p-5">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-red/15 text-brand-red">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold">{c.title}</div>
                  <div className="mt-1 text-sm text-foreground/90">{c.body}</div>
                  {"link" in c && c.link && (
                    <a href={c.link.href} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-semibold text-brand-yellow hover:underline">
                      {c.link.label}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-background">
            <iframe
              title="Pizza Hot Pano Aqil location on Google Maps"
              src="https://www.google.com/maps?q=Pizza+Hot+Pano+Aqil+Baiji+Chowk&output=embed"
              className="h-full min-h-[380px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="" width={40} height={40} className="h-10 w-10 rounded-full" />
            <div>
              <div className="font-extrabold">Pizza Hot</div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Pano Aqil</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Pano Aqil's #1 pizzeria. Fresh pizzas, burgers, shawarmas &amp; combos — delivered hot to your door.
          </p>
        </div>
        <div>
          <div className="text-sm font-bold uppercase tracking-widest text-brand-red">Quick Links</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#menu" className="hover:text-brand-yellow">Our Menu</a></li>
            <li><a href="#deals" className="hover:text-brand-yellow">Special Deals</a></li>
            <li><a href="#about" className="hover:text-brand-yellow">About Us</a></li>
            <li><a href="#contact" className="hover:text-brand-yellow">Contact</a></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-bold uppercase tracking-widest text-brand-red">Follow Us</div>
          <div className="mt-4 flex gap-3">
            <a href={FACEBOOK} target="_blank" rel="noreferrer" aria-label="Pizza Hot on Facebook" className="grid h-10 w-10 place-items-center rounded-full bg-card hover:bg-brand-red hover:text-white">
              <Facebook className="h-5 w-5" />
            </a>
            <a href={waLink("Hi Pizza Hot Pano Aqil!")} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="grid h-10 w-10 place-items-center rounded-full bg-card hover:bg-brand-red hover:text-white">
              <MessageCircle className="h-5 w-5" />
            </a>
            <a href={MAPS} target="_blank" rel="noreferrer" aria-label="Find us on Google Maps" className="grid h-10 w-10 place-items-center rounded-full bg-card hover:bg-brand-red hover:text-white">
              <MapPin className="h-5 w-5" />
            </a>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">© <span suppressHydrationWarning>{new Date().getFullYear()}</span> Pizza Hot Pano Aqil. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ============ Cart Drawer with Checkout ============
type Customer = { name: string; phone: string; email: string; address: string; notes: string };

function CartDrawer({
  open, onClose, items, total, inc, dec, remove, clear,
}: {
  open: boolean; onClose: () => void; items: CartItem[]; total: number;
  inc: (k: string) => void; dec: (k: string) => void; remove: (k: string) => void; clear: () => void;
}) {
  const [step, setStep] = useState<"cart" | "details">("cart");
  const [cust, setCust] = useState<Customer>({ name: "", phone: "", email: "", address: "", notes: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>({});

  useEffect(() => { if (!open) setStep("cart"); }, [open]);

  const validate = () => {
    const e: Partial<Record<keyof Customer, string>> = {};
    if (!cust.name.trim() || cust.name.trim().length < 2) e.name = "Please enter your full name";
    if (!/^[0-9+\s-]{10,15}$/.test(cust.phone.trim())) e.phone = "Enter a valid phone number";
    if (cust.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cust.email.trim())) e.email = "Enter a valid email";
    if (!cust.address.trim() || cust.address.trim().length < 5) e.address = "Please enter your delivery address";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const orderMsg = useMemo(() => {
    if (!items.length) return "";
    const lines = items.map((x) => `• ${x.name} (${x.size}) x${x.qty} — PKR ${x.price * x.qty}`);
    return [
      `Hi Pizza Hot Pano Aqil! 🍕 I'd like to place an order:`,
      ``,
      ...lines,
      ``,
      `*Total: PKR ${total}*`,
      ``,
      `*Customer Details*`,
      `Name: ${cust.name}`,
      `Phone: ${cust.phone}`,
      cust.email ? `Email: ${cust.email}` : null,
      `Address: ${cust.address}`,
      cust.notes ? `Notes: ${cust.notes}` : null,
      `Payment: Cash on Delivery`,
    ].filter(Boolean).join("\n");
  }, [items, total, cust]);

  const send = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!validate()) { e.preventDefault(); return; }
  };

  return (
    <div className={`fixed inset-0 z-50 transition ${open ? "pointer-events-auto" : "pointer-events-none"}`} role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div onClick={onClose} className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition ${open ? "opacity-100" : "opacity-0"}`} />
      <aside className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-2xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-border bg-card/40 px-5 py-4">
          <div className="flex items-center gap-2 font-bold">
            <ShoppingCart className="h-5 w-5 text-brand-red" />
            {step === "cart" ? "Your Order" : "Delivery Details"}
          </div>
          <button onClick={onClose} aria-label="Close cart" className="rounded-md p-2 hover:bg-muted"><X className="h-5 w-5" /></button>
        </div>

        {/* Stepper */}
        {items.length > 0 && (
          <div className="flex border-b border-border bg-card/20">
            {(["cart", "details"] as const).map((s, i) => (
              <button
                key={s}
                onClick={() => items.length && setStep(s)}
                className={`flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                  step === s ? "border-b-2 border-brand-red text-brand-red" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {i + 1}. {s === "cart" ? "Cart" : "Checkout"}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="grid h-full place-items-center text-center text-muted-foreground">
              <div>
                <ShoppingCart className="mx-auto h-12 w-12 opacity-40" />
                <p className="mt-3 text-sm">Your cart is empty.<br />Add something delicious!</p>
              </div>
            </div>
          ) : step === "cart" ? (
            <ul className="space-y-3">
              {items.map((x) => {
                const k = x.id + x.size;
                return (
                  <li key={k} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{x.name}</div>
                      <div className="text-xs text-muted-foreground">{x.size} · PKR {x.price}</div>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-muted px-1">
                      <button onClick={() => dec(k)} aria-label={`Decrease quantity of ${x.name}`} className="grid h-7 w-7 place-items-center rounded-full hover:bg-background"><Minus className="h-3.5 w-3.5" aria-hidden="true" /></button>
                      <span aria-label={`Quantity ${x.qty}`} className="w-6 text-center text-sm font-bold">{x.qty}</span>
                      <button onClick={() => inc(k)} aria-label={`Increase quantity of ${x.name}`} className="grid h-7 w-7 place-items-center rounded-full hover:bg-background"><Plus className="h-3.5 w-3.5" aria-hidden="true" /></button>
                    </div>
                    <button onClick={() => remove(k)} aria-label={`Remove ${x.name} from cart`} className="text-muted-foreground hover:text-brand-red"><X className="h-4 w-4" aria-hidden="true" /></button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <Field label="Full Name *" value={cust.name} onChange={(v) => setCust({ ...cust, name: v })} error={errors.name} placeholder="e.g. Ahmed Khan" />
              <Field label="Phone Number *" value={cust.phone} onChange={(v) => setCust({ ...cust, phone: v })} error={errors.phone} placeholder="03XX XXXXXXX" type="tel" maxLength={15} />
              <Field label="Email (optional)" value={cust.email} onChange={(v) => setCust({ ...cust, email: v })} error={errors.email} placeholder="you@example.com" type="email" maxLength={120} />
              <Field label="Delivery Address *" value={cust.address} onChange={(v) => setCust({ ...cust, address: v })} error={errors.address} placeholder="House #, Street, Area, Pano Aqil" multiline maxLength={250} />
              <Field label="Order Notes (optional)" value={cust.notes} onChange={(v) => setCust({ ...cust, notes: v })} placeholder="e.g. extra cheese, no onions" multiline maxLength={250} />
              <div className="flex items-center gap-2 rounded-lg bg-brand-yellow/10 p-3 text-xs text-foreground/80">
                <ShieldCheck className="h-4 w-4 shrink-0 text-brand-yellow" />
                <span>Your details go directly to our WhatsApp — we never store them.</span>
              </div>
            </form>
          )}
        </div>

        <div className="border-t border-border bg-card/40 px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="text-2xl font-extrabold text-brand-yellow">PKR {total}</span>
          </div>
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-muted/50 p-2 text-xs text-muted-foreground">
            <Truck className="h-4 w-4 text-brand-yellow" /> Free delivery within Pano Aqil • Cash on Delivery
          </div>
          {step === "cart" ? (
            <button
              onClick={() => items.length && setStep("details")}
              disabled={!items.length}
              className={`flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition ${
                items.length ? "bg-brand-red text-white hover:brightness-110" : "cursor-not-allowed bg-muted text-muted-foreground"
              }`}
            >
              Continue to Checkout →
            </button>
          ) : (
            <div className="space-y-2">
              <a
                href={items.length ? waLink(orderMsg) : undefined}
                target="_blank" rel="noreferrer"
                onClick={send}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white hover:brightness-110"
              >
                <MessageCircle className="h-5 w-5" /> Confirm Order on WhatsApp
              </a>
              <button onClick={() => setStep("cart")} className="w-full text-xs text-muted-foreground hover:text-foreground">← Back to cart</button>
            </div>
          )}
          {items.length > 0 && step === "cart" && (
            <button onClick={clear} className="mt-2 w-full text-xs text-muted-foreground hover:text-brand-red">Clear cart</button>
          )}
        </div>
      </aside>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, error, type = "text", multiline, maxLength,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  error?: string; type?: string; multiline?: boolean; maxLength?: number;
}) {
  const id = label.replace(/\W/g, "-").toLowerCase();
  const common = "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-brand-red focus:ring-2 focus:ring-brand-red/30";
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-foreground/90">{label}</label>
      {multiline ? (
        <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} rows={2} className={common} aria-invalid={!!error} />
      ) : (
        <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} className={common} aria-invalid={!!error} />
      )}
      {error && <p className="mt-1 text-xs text-brand-red" role="alert">{error}</p>}
    </div>
  );
}

// ============ AI Assistant ============
type ChatMsg = { role: "bot" | "user"; text: string };

const QUICK_QS = [
  "What are your bestsellers?",
  "Do you deliver to my area?",
  "What are your opening hours?",
  "Show me deals & combos",
  "How can I order?",
];

function botReply(q: string): string {
  const t = q.toLowerCase();
  if (/(hour|open|close|timing)/.test(t)) return "We're open daily from 12:00 PM to 1:00 AM. Come visit us at Baiji Chowk, Pano Aqil!";
  if (/(deliver|area|location|where|address)/.test(t)) return "Yes! We offer free delivery anywhere within Pano Aqil. Just place your order and we'll bring it hot to your door in ~30 minutes.";
  if (/(deal|combo|offer|discount|saving|price)/.test(t)) return "Our top combos:\n• Pizza Hot Combo — PKR 1,499 (Save Rs.250)\n• Family Feast — PKR 2,299 (Save Rs.400)\n• Student Saver — PKR 799\nScroll to our Deals section to order!";
  if (/(bestseller|popular|recommend|best|signature)/.test(t)) return "Our bestsellers: Seekh Kabab Pizza 🍕, Afghani Pizza, Mighty Zinger Burger 🍔, and Cheese Shawarma 🌯. All 5-star rated by our customers!";
  if (/(order|whatsapp|how|book)/.test(t)) return "Easy! Tap any item to add to cart, then checkout via WhatsApp. Or call us directly: 0317 3821766.";
  if (/(halal|meat)/.test(t)) return "100% halal certified. We source all meat from certified halal suppliers.";
  if (/(veg|vegetarian)/.test(t)) return "We have vegetarian pizza options. Try our Margherita or any pizza without the meat topping — just mention it in your order notes!";
  if (/(pay|cash|card)/.test(t)) return "We accept Cash on Delivery for all orders. Quick, safe and simple.";
  if (/(phone|call|number|contact)/.test(t)) return "Call or WhatsApp us:\n📞 0317 3821766\n📞 0319 8315723";
  if (/(menu|food|pizza|burger|shawarma)/.test(t)) return "Our menu has 4 categories: Pizza, Burgers, Shawarma & Rolls, and Sides. Scroll to the Menu section to browse and add to cart!";
  if (/(hi|hello|hey|salam|assalam)/.test(t)) return "Hello! 👋 Welcome to Pizza Hot Pano Aqil. I'm here to help — ask me about our menu, deals, delivery or hours!";
  return "I'd love to help! For specific questions, please call us at 0317 3821766 or message us on WhatsApp. You can also browse our full menu above.";
}

function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { role: "bot", text: "Hi! I'm Hot Chef 🧑‍🍳 — your Pizza Hot assistant. Ask me anything about our menu, deals, or delivery!" },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  const ask = (q: string) => {
    if (!q.trim()) return;
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "bot", text: botReply(q) }]);
    }, 450);
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Open Pizza Hot assistant"}
        className="fixed bottom-24 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-brand-red to-[oklch(0.45_0.18_25)] text-white shadow-2xl shadow-black/40 transition hover:scale-110"
      >
        {open ? <X className="h-6 w-6" /> : <><Bot className="h-7 w-7" /><span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-brand-yellow text-[10px] font-bold text-black"><Sparkles className="h-3 w-3" /></span></>}
      </button>

      {open && (
        <div className="fixed bottom-44 right-5 z-30 flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl shadow-black/50">
          <div className="flex items-center gap-3 border-b border-border bg-gradient-to-r from-brand-red to-[oklch(0.45_0.18_25)] px-4 py-3 text-white">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-white/20"><Bot className="h-5 w-5" /></div>
            <div className="flex-1">
              <div className="text-sm font-bold">Hot Chef Assistant</div>
              <div className="flex items-center gap-1.5 text-[11px] text-white/85"><span className="h-1.5 w-1.5 rounded-full bg-green-400" /> Online now</div>
            </div>
          </div>
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-card/30 px-3 py-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${m.role === "bot" ? "bg-brand-red text-white" : "bg-brand-yellow text-black"}`}>
                  {m.role === "bot" ? <Bot className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-line ${m.role === "bot" ? "bg-card text-foreground" : "bg-brand-red text-white"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {msgs.length <= 2 && (
              <div className="mt-3 flex flex-wrap gap-1.5 pl-9">
                {QUICK_QS.map((q) => (
                  <button key={q} onClick={() => ask(q)} className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium hover:border-brand-red hover:text-brand-red">
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="flex items-center gap-2 border-t border-border bg-background p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Hot Chef…"
              aria-label="Message Hot Chef"
              className="flex-1 rounded-full border border-border bg-card px-4 py-2 text-sm outline-none focus:border-brand-red"
              maxLength={200}
            />
            <button type="submit" aria-label="Send message" className="grid h-9 w-9 place-items-center rounded-full bg-brand-red text-white hover:brightness-110">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function FloatingWhatsApp() {
  return (
    <a
      href={waLink("Hi Pizza Hot Pano Aqil! 🍕 I'd like to place an order.")}
      target="_blank" rel="noreferrer"
      aria-label="Order on WhatsApp"
      className="fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-black/40 transition hover:scale-110"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}

// ============ Page ============
function Index() {
  const cart = useCart();
  const [open, setOpen] = useState(false);
  useEffect(() => { document.documentElement.classList.add("dark"); }, []);
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar count={cart.count} onCart={() => setOpen(true)} />
      <main id="main">
        <Hero />
        <Ticker />
        <MenuSection onAdd={(c) => { cart.add(c); setOpen(true); }} />
        <Deals />
        <About />
        <Story />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <CartDrawer
        open={open} onClose={() => setOpen(false)}
        items={cart.items} total={cart.total}
        inc={cart.inc} dec={cart.dec} remove={cart.remove} clear={cart.clear}
      />
      <ChatAssistant />
      <FloatingWhatsApp />
    </div>
  );
}
