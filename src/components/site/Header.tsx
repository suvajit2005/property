import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, Building2, Plus, LogOut, User as UserIcon, LayoutDashboard, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/config/business";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Properties" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const initial = (profile?.display_name || user?.email || "?").charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <Building2 className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight">
            Purulia <span className="text-orange">Properties</span>
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

          <Button asChild size="sm" variant="outline" className="ml-2 border-orange/50 text-orange hover:bg-orange hover:text-orange-foreground">
            <Link to="/post-property"><Plus className="h-4 w-4" /> Post Property</Link>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-2 flex items-center gap-2 rounded-full p-1 hover:bg-muted">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url ?? undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initial}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">{profile?.display_name || user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/dashboard"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/dashboard/saved"><Heart className="h-4 w-4" /> Saved</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/dashboard/profile"><UserIcon className="h-4 w-4" /> Profile</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}><LogOut className="h-4 w-4" /> Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="ml-2">
              <Link to="/auth">Login</Link>
            </Button>
          )}
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
          open ? "max-h-[32rem]" : "max-h-0",
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
          <Button asChild size="sm" variant="outline" className="mt-2 border-orange/50 text-orange hover:bg-orange hover:text-orange-foreground">
            <Link to="/post-property" onClick={() => setOpen(false)}><Plus className="h-4 w-4" /> Post Property</Link>
          </Button>
          {user ? (
            <>
              <Button asChild size="sm" variant="outline" className="mt-2">
                <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
              </Button>
              <Button size="sm" variant="ghost" className="mt-1" onClick={() => { setOpen(false); handleSignOut(); }}>
                Sign out
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="mt-2">
              <Link to="/auth" onClick={() => setOpen(false)}>Login / Sign up</Link>
            </Button>
          )}
        </nav>
      </div>

      <p className="hidden text-xs text-muted-foreground border-t border-border/40 py-1.5 text-center md:block">
        {BUSINESS.tagline}
      </p>
    </header>
  );
}
