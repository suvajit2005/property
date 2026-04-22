import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyCard } from "@/components/site/PropertyCard";
import { PROPERTIES } from "@/data/properties";
import { BUSINESS } from "@/config/business";

const propertiesSearchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  type: fallback(z.enum(["Residential", "Commercial"]).optional(), undefined),
  listing: fallback(z.enum(["Sale", "Rent"]).optional(), undefined),
  beds: fallback(z.number().int().min(0), 0).default(0),
  sort: fallback(z.enum(["newest", "price-asc", "price-desc"]), "newest").default("newest"),
});

export const Route = createFileRoute("/properties")({
  validateSearch: zodValidator(propertiesSearchSchema),
  head: () => ({
    meta: [
      { title: `Properties for Sale & Rent — ${BUSINESS.name}` },
      { name: "description", content: `Browse our curated catalog of residential and commercial properties for sale and rent in ${BUSINESS.location}.` },
      { property: "og:title", content: `Properties — ${BUSINESS.name}` },
      { property: "og:description", content: "Find your next home or commercial space." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80" },
    ],
  }),
  component: PropertiesPage,
});

function PropertiesPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const filtered = PROPERTIES.filter((p) => {
    if (search.q && !`${p.title} ${p.location} ${p.description}`.toLowerCase().includes(search.q.toLowerCase())) return false;
    if (search.type && p.type !== search.type) return false;
    if (search.listing && p.listing !== search.listing) return false;
    if (search.beds > 0 && p.bedrooms < search.beds) return false;
    return true;
  }).sort((a, b) => {
    if (search.sort === "price-asc") return a.price - b.price;
    if (search.sort === "price-desc") return b.price - a.price;
    return 0;
  });

  const update = (patch: Partial<typeof search>) => {
    navigate({ search: (prev: typeof search) => ({ ...prev, ...patch }) });
  };

  const hasFilters = search.q || search.type || search.listing || search.beds > 0;

  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-[oklch(0.25_0.10_262)] text-primary-foreground">
        <div className="container mx-auto px-4 py-14 md:px-6 md:py-20">
          <span className="text-xs font-semibold uppercase tracking-wider text-gold">Properties</span>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Discover your next address</h1>
          <p className="mt-3 max-w-xl text-primary-foreground/85">
            {filtered.length} {filtered.length === 1 ? "property" : "properties"} matching your search.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 md:px-6">
        {/* Filter bar */}
        <div className="mb-8 rounded-xl border border-border bg-card p-4 shadow-sm md:p-5">
          <div className="grid gap-3 md:grid-cols-5">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Title, location…"
                  value={search.q}
                  onChange={(e) => update({ q: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Type</label>
              <Select value={search.type ?? "any"} onValueChange={(v) => update({ type: v === "any" ? undefined : (v as "Residential" | "Commercial") })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Listing</label>
              <Select value={search.listing ?? "any"} onValueChange={(v) => update({ listing: v === "any" ? undefined : (v as "Sale" | "Rent") })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="Sale">For Sale</SelectItem>
                  <SelectItem value="Rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Min Beds</label>
              <Select value={String(search.beds)} onValueChange={(v) => update({ beds: Number(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Sort by</span>
              <Select value={search.sort} onValueChange={(v) => update({ sort: v as "newest" | "price-asc" | "price-desc" })}>
                <SelectTrigger className="h-8 w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: low to high</SelectItem>
                  <SelectItem value="price-desc">Price: high to low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ search: { q: "", type: undefined, listing: undefined, beds: 0, sort: "newest" } })}
              >
                <X className="h-4 w-4" /> Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-20 text-center">
            <h3 className="font-display text-xl font-semibold">No matches</h3>
            <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters or clearing them.</p>
            <Button asChild variant="outline" className="mt-5">
              <Link to="/contact">Tell us what you're looking for</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
