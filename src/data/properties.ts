export type PropertyType = "Residential" | "Commercial";
export type ListingType = "Sale" | "Rent";

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  listing: ListingType;
  price: number; // monthly for Rent, total for Sale
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // sq ft
  image: string;
  description: string;
  featured?: boolean;
}

export const PROPERTIES: Property[] = [
  {
    id: "p-001",
    title: "Modern Lakeside Villa",
    type: "Residential",
    listing: "Sale",
    price: 1250000,
    location: "Lakeview Heights",
    bedrooms: 5,
    bathrooms: 4,
    area: 4200,
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    description:
      "A breathtaking modern villa overlooking the lake, featuring floor-to-ceiling windows, a private infinity pool, and bespoke interiors.",
    featured: true,
  },
  {
    id: "p-002",
    title: "Downtown Penthouse Suite",
    type: "Residential",
    listing: "Sale",
    price: 985000,
    location: "Central District",
    bedrooms: 3,
    bathrooms: 3,
    area: 2400,
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    description:
      "An elegant penthouse with panoramic skyline views, marble finishes, and a private rooftop terrace in the heart of the city.",
    featured: true,
  },
  {
    id: "p-003",
    title: "Glass Tower Office Floor",
    type: "Commercial",
    listing: "Rent",
    price: 12500,
    location: "Financial Quarter",
    bedrooms: 0,
    bathrooms: 4,
    area: 6800,
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    description:
      "A full-floor Class-A office in a landmark glass tower. Open plan, floor-to-ceiling glazing, and dedicated parking.",
    featured: true,
  },
  {
    id: "p-004",
    title: "Garden Family Home",
    type: "Residential",
    listing: "Sale",
    price: 645000,
    location: "Maple Grove",
    bedrooms: 4,
    bathrooms: 3,
    area: 3100,
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
    description:
      "A warm family home with a sprawling garden, chef's kitchen, and large play areas in a quiet, sought-after neighborhood.",
  },
  {
    id: "p-005",
    title: "Boutique Retail Space",
    type: "Commercial",
    listing: "Rent",
    price: 4800,
    location: "Old Town Boulevard",
    bedrooms: 0,
    bathrooms: 1,
    area: 1400,
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    description:
      "A high-footfall boutique storefront with double-height ceilings, ideal for fashion, beauty, or specialty retail brands.",
  },
  {
    id: "p-006",
    title: "Cozy City Apartment",
    type: "Residential",
    listing: "Rent",
    price: 2200,
    location: "Riverside Quarter",
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    description:
      "A bright and airy two-bedroom apartment with a private balcony overlooking the river — perfectly walkable to cafes and parks.",
  },
  {
    id: "p-007",
    title: "Hillside Country Estate",
    type: "Residential",
    listing: "Sale",
    price: 2300000,
    location: "Vineyard Hills",
    bedrooms: 6,
    bathrooms: 5,
    area: 6500,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    description:
      "A timeless estate set on rolling vineyards, with a guest house, tennis court, and curated landscape gardens.",
  },
  {
    id: "p-008",
    title: "Industrial Warehouse",
    type: "Commercial",
    listing: "Sale",
    price: 1850000,
    location: "Port Industrial Park",
    bedrooms: 0,
    bathrooms: 2,
    area: 18000,
    image:
      "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1200&q=80",
    description:
      "A versatile warehouse with high-bay clearance, multiple loading docks, and direct port access — ideal for logistics and distribution.",
  },
  {
    id: "p-009",
    title: "Studio Loft in Arts District",
    type: "Residential",
    listing: "Rent",
    price: 1650,
    location: "Arts District",
    bedrooms: 1,
    bathrooms: 1,
    area: 720,
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    description:
      "An open-plan loft with exposed brick, polished concrete floors, and oversized windows — true urban living.",
  },
  {
    id: "p-010",
    title: "Coastal Beach House",
    type: "Residential",
    listing: "Sale",
    price: 1450000,
    location: "Seabreeze Cove",
    bedrooms: 4,
    bathrooms: 3,
    area: 2900,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    description:
      "A serene beach house with direct ocean access, sundeck, and a fully renovated open-concept interior.",
  },
];

export const formatPrice = (price: number, listing: ListingType) =>
  listing === "Rent"
    ? `$${price.toLocaleString()}/mo`
    : `$${price.toLocaleString()}`;
