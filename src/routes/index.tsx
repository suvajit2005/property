import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, ArrowRight, Award, Users, Building2, Star, ShoppingBag, Key, TrendingUp, Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyCard } from "@/components/site/PropertyCard";
import { PROPERTIES } from "@/data/properties";
import { BUSINESS } from "@/config/business";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${BUSINESS.name} — Find Your Dream Property Today` },
      { name: "description", content: `${BUSINESS.tagline}. Buy, sell, and rent residential & commercial properties with expert brokerage support in ${BUSINESS.location}.` },
      { property: "og:title", content: `${BUSINESS.name} — Find Your Dream Property Today` },
      { property: "og:description", content: BUSINESS.tagline },
      { property: "og:image", content: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80" },
    ],
  }),
  component: HomePage,
});

const SERVICES = [
  { icon: HomeIcon, title: "Buying", desc: "Find your dream home with expert guidance." },
  { icon: Key, title: "Selling", desc: "List smart, sell fast, at the right price." },
  { icon: ShoppingBag, title: "Renting", desc: "Curated rentals for every lifestyle." },
  { icon: TrendingUp, title: "Investment", desc: "Build wealth through smart property choices." },
];

const TESTIMONIALS = [
  { name: "Sarah M.", role: "Home Buyer", text: "They found us our perfect family home in three weeks. Patient, professional, and never pushy." },
  { name: "James K.", role: "Investor", text: "Their market insight helped me build a portfolio that's now my best-performing asset." },
  { name: "Priya R.", role: "Seller", text: "Sold above asking in nine days. The marketing and staging advice were spot on." },
];

function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ location: "", type: "any", listing: "any" });
  const featured = PROPERTIES.filter((p) => p.featured);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/properties",
      search: {
        q: search.location || undefined,
        type: search.type === "any" ? undefined : (search.type as "Residential" | "Commercial"),
        listing: search.listing === "any" ? undefined : (search.listing as "Sale" | "Rent"),
      },
    });
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/75 to-[oklch(0.18_0.08_262)/0.85]" />
        <div className="relative container mx-auto px-4 pt-20 pb-32 md:px-6 md:pt-32 md:pb-44">
          <div className="max-w-3xl text-primary-foreground animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="inline-block rounded-full bg-gold/20 border border-gold/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
              {BUSINESS.tagline}
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
              Find Your Dream <span className="text-gold">Property</span> Today
            </h1>
            <p className="mt-5 max-w-xl text-base text-primary-foreground/85 md:text-lg">
              From cozy apartments to landmark commercial spaces, we connect you with properties that match your vision and ambitions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                <Link to="/properties">View Listings <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-background/10 border-primary-foreground/30 text-primary-foreground hover:bg-background/20 hover:text-primary-foreground">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Search bar overlapping hero */}
        <div className="relative container mx-auto px-4 -mb-8 md:-mb-10 md:px-6">
          <form
            onSubmit={handleSearch}
            className="relative -mt-16 md:-mt-20 grid gap-3 rounded-xl border border-border bg-card p-4 shadow-[0_20px_50px_-20px_color-mix(in_oklab,var(--primary)_30%,transparent)] sm:grid-cols-2 md:grid-cols-4 md:p-5"
          >
            <div className="md:col-span-1">
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Location</label>
              <Input
                placeholder="City, neighborhood…"
                value={search.location}
                onChange={(e) => setSearch((s) => ({ ...s, location: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Type</label>
              <Select value={search.type} onValueChange={(v) => setSearch((s) => ({ ...s, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any type</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Looking for</label>
              <Select value={search.listing} onValueChange={(v) => setSearch((s) => ({ ...s, listing: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Buy or rent</SelectItem>
                  <SelectItem value="Sale">For Sale</SelectItem>
                  <SelectItem value="Rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button type="submit" size="lg" className="w-full">
                <Search className="h-4 w-4" /> Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 pt-24 pb-16 md:px-6">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gold">Handpicked</span>
            <h2 className="mt-1 font-display text-3xl font-bold md:text-4xl">Featured Properties</h2>
          </div>
          <Button asChild variant="outline" className="hidden md:inline-flex">
            <Link to="/properties">View all <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => <PropertyCard key={p.id} property={p} />)}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Button asChild variant="outline">
            <Link to="/properties">View all properties <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Services teaser */}
      <section className="bg-secondary/40 py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold">What we do</span>
            <h2 className="mt-1 font-display text-3xl font-bold md:text-4xl">Full-service property expertise</h2>
            <p className="mt-3 text-muted-foreground">From first viewing to final signature — we handle every detail.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map(({ icon: Icon, title, desc }) => (
              <Link key={title} to="/services" className="group">
                <Card className="h-full p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Why */}
      <section className="container mx-auto px-4 py-20 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gold">Why choose us</span>
            <h2 className="mt-1 font-display text-3xl font-bold md:text-4xl">A name {BUSINESS.location} trusts</h2>
            <p className="mt-4 text-muted-foreground">
              For over a decade, we've helped families, professionals, and investors close deals with confidence. Our local expertise, transparent process, and tireless advocacy set us apart.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div>
                <div className="font-display text-3xl font-bold text-primary">{BUSINESS.stats.yearsExperience}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Years</div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-primary">{BUSINESS.stats.propertiesSold}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Properties</div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-primary">{BUSINESS.stats.happyClients}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Clients</div>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Award, title: "Trusted Expertise", desc: "Decades of combined market experience." },
              { icon: Users, title: "Client First", desc: "Every decision serves your goals." },
              { icon: Building2, title: "Wide Portfolio", desc: "Residential & commercial covered." },
              { icon: TrendingUp, title: "Investment Insight", desc: "Data-backed property strategy." },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="p-5">
                <Icon className="mb-3 h-8 w-8 text-gold" />
                <h3 className="font-display font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/40 py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold">Testimonials</span>
            <h2 className="mt-1 font-display text-3xl font-bold md:text-4xl">What clients say</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="p-6">
                <div className="mb-3 flex gap-1 text-gold">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-sm leading-relaxed text-foreground/80">"{t.text}"</p>
                <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 md:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.30_0.14_262)] p-10 md:p-16 text-center text-primary-foreground">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Ready to find your next property?</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
            Let's talk about your goals. A short conversation can change where you live or invest next.
          </p>
          <Button asChild size="lg" className="mt-7 bg-gold text-gold-foreground hover:bg-gold/90">
            <Link to="/contact">Get in Touch <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
