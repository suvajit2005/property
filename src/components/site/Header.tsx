import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/config/business";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Properties" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <Home className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            {BUSINESS.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-3">
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "md:hidden overflow-hidden border-t border-border/60 bg-background transition-[max-height] duration-300",
          open ? "max-h-96" : "max-h-0",
        )}
      >
        <nav className="container mx-auto flex flex-col gap-1 px-4 py-3">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-primary"
              activeProps={{ className: "text-primary bg-muted" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm" className="mt-2">
            <Link to="/contact" onClick={() => setOpen(false)}>
              Get in Touch
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
