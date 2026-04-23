import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { BUSINESS } from "@/config/business";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({ meta: [{ title: `Profile — ${BUSINESS.name}` }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    display_name: "", phone: "", whatsapp: "", city: "", bio: "",
    role: "buyer" as "buyer" | "seller" | "broker" | "admin",
  });

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setForm({
        display_name: profile.display_name ?? "",
        phone: profile.phone ?? "",
        whatsapp: profile.whatsapp ?? "",
        city: profile.city ?? "",
        bio: profile.bio ?? "",
        role: profile.role,
      });
    }
  }, [profile]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      display_name: form.display_name.trim() || null,
      phone: form.phone.trim() || null,
      whatsapp: form.whatsapp.trim() || null,
      city: form.city.trim() || null,
      bio: form.bio.trim() || null,
      role: form.role,
      onboarded: true,
    }).eq("id", user.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    await refreshProfile();
    toast.success("Profile updated");
  };

  if (authLoading || !user) {
    return <div className="container mx-auto px-4 py-20 text-center md:px-6"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold md:text-3xl">Profile</h1>
            <p className="text-sm text-muted-foreground">Update your personal information.</p>
          </div>
        </div>

        <Card className="mt-6 p-6 md:p-8">
          <form onSubmit={save} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email ?? ""} disabled className="mt-1.5 bg-muted" />
            </div>
            <div>
              <Label htmlFor="dn">Display name</Label>
              <Input id="dn" value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} className="mt-1.5" maxLength={80} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="ph">Phone</Label>
                <Input id="ph" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1.5" maxLength={15} />
              </div>
              <div>
                <Label htmlFor="wa">WhatsApp</Label>
                <Input id="wa" type="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="mt-1.5" maxLength={15} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label>I am a…</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as typeof form.role })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">Buyer / Tenant</SelectItem>
                    <SelectItem value="seller">Seller / Landlord</SelectItem>
                    <SelectItem value="broker">Broker / Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="mt-1.5" rows={3} maxLength={500} />
            </div>
            <div className="flex justify-end gap-3 border-t border-border pt-5">
              <Button type="submit" disabled={saving}>
                {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <><Save className="h-4 w-4" /> Save changes</>}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
