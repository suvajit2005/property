import { Bed, Bath, Maximize, MapPin, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Property, formatPrice } from "@/data/properties";
import { whatsappLink } from "@/config/business";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/60 transition-all hover:shadow-[0_20px_50px_-20px_color-mix(in_oklab,var(--primary)_30%,transparent)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={property.image}
          alt={property.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge className="bg-primary text-primary-foreground hover:bg-primary">
            For {property.listing}
          </Badge>
          <Badge variant="secondary" className="bg-background/90 text-foreground">
            {property.type}
          </Badge>
        </div>
        <div className="absolute bottom-3 right-3 rounded-md bg-foreground/85 px-3 py-1.5 backdrop-blur-sm">
          <span className="font-display text-lg font-bold text-gold">
            {formatPrice(property.price, property.listing)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-tight">{property.title}</h3>
        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-gold" />
          <span>{property.location}</span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{property.description}</p>

        <div className="mt-4 flex items-center gap-4 border-t border-border/60 pt-4 text-xs text-muted-foreground">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bed className="h-4 w-4 text-primary" /> {property.bedrooms} Beds
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-primary" /> {property.bathrooms} Baths
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize className="h-4 w-4 text-primary" /> {property.area.toLocaleString()} ft²
          </span>
        </div>

        <div className="mt-5 flex gap-2">
          <Button asChild className="flex-1" size="sm">
            <a
              href={whatsappLink(`Hi! I'm interested in "${property.title}" (${property.location}).`)}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="h-4 w-4" /> Enquire
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
}
