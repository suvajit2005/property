import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building2, ChevronLeft, ChevronRight, ImagePlus, Loader2, MapPin, X, Check, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { BUSINESS } from "@/config/business";
import { useAuth } from "@/lib/auth";
import { createProperty } from "@/integrations/supabase/database";
import { uploadPropertyImages } from "@/integrations/supabase/storage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/post-property")({
  head: () => ({
    meta: [
      { title: `Post a Property — ${BUSINESS.name}` },
      { name: "description", content: "List your property for sale or rent on Purulia Properties — fast, free, and verified." },
    ],
  }),
  component: PostPropertyPage,
});

const RES_AMENITIES = ["Parking", "Lift", "Power Backup", "Security", "Garden", "Water Supply", "Gym", "Swimming Pool", "Park", "CCTV"];
const COM_AMENITIES = ["Parking", "Lift", "Power Backup", "Security", "Conference Room", "Reception", "Pantry", "AC", "CCTV", "Internet"];

type FormState = {
  // Step 1
  ownerType: "individual" | "broker" | null;
  // Step 2
  propertyType: "residential" | "commercial" | null;
  listingType: "sale" | "rent" | null;
  // Step 3
  title: string;
  description: string;
  category: string;
  bedrooms: string;
  bathrooms: string;
  furnishing: string;
  floorNumber: string;
  totalFloors: string;
  areaSqft: string;
  amenities: string[];
  // Step 4
  city: string;
  locality: string;
  address: string;
  pincode: string;
  latitude: string;
  longitude: string;
  // Step 5
  price: string;
  contactPhone: string;
  contactWhatsapp: string;
  // Step 6
  images: { file: File; url: string }[];
};

const STEPS = ["You", "Property", "Details", "Location", "Pricing", "Photos"];

function PostPropertyPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
    ownerType: null,
    propertyType: null,
    listingType: null,
    title: "",
    description: "",
    category: "",
    bedrooms: "",
    bathrooms: "",
    furnishing: "",
    floorNumber: "",
    totalFloors: "",
    areaSqft: "",
    amenities: [],
    city: "Purulia",
    locality: "",
    address: "",
    pincode: "",
    latitude: "",
    longitude: "",
    price: "",
    contactPhone: "",
    contactWhatsapp: "",
    images: [],
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please log in to post a property");
      navigate({ to: "/auth" });
    }
  }, [user, authLoading, navigate]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const detectLocation = () => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        set("latitude", pos.coords.latitude.toFixed(6));
        set("longitude", pos.coords.longitude.toFixed(6));
        toast.success("Location detected");
      },
      () => toast.error("Could not detect location"),
    );
  };

  const handleFiles = (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, 10 - form.images.length);
    const next = arr.map((file) => ({ file, url: URL.createObjectURL(file) }));
    set("images", [...form.images, ...next]);
  };

  const removeImage = (idx: number) => {
    URL.revokeObjectURL(form.images[idx].url);
    set("images", form.images.filter((_, i) => i !== idx));
  };

  const validateStep = (): string | null => {
    if (step === 0 && !form.ownerType) return "Please choose owner type";
    if (step === 1 && (!form.propertyType || !form.listingType)) return "Choose property type and listing";
    if (step === 2) {
      if (!form.title.trim()) return "Title is required";
      if (form.title.trim().length < 10) return "Title must be at least 10 characters";
      if (!form.description.trim() || form.description.trim().length < 30) return "Description must be at least 30 characters";
      if (!form.areaSqft || Number(form.areaSqft) <= 0) return "Area is required";
      if (form.propertyType === "residential" && (!form.bedrooms || !form.bathrooms)) return "Bedrooms & bathrooms required";
    }
    if (step === 3 && !form.locality.trim()) return "Locality is required";
    if (step === 4) {
      if (!form.price || Number(form.price) <= 0) return "Price is required";
      if (!form.contactPhone || form.contactPhone.length < 10) return "Valid contact phone required";
    }
    if (step === 5 && form.images.length === 0) return "Please add at least one photo";
    return null;
  };

  const next = () => {
    const err = validateStep();
    if (err) { toast.error(err); return; }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    console.log("🚀 SUBMIT BUTTON CLICKED!");
    console.log("Current step:", step);
    console.log("Total steps:", STEPS.length);
    console.log("Is final step?", step === STEPS.length - 1);
    console.log("Form data:", form);
    console.log("Submitting state:", submitting);

    // Check if we're on the final step
    if (step !== STEPS.length - 1) {
      console.log("❌ Not on final step, cannot submit");
      toast.error("Please complete all steps before submitting");
      return;
    }

    const err = validateStep();
    console.log("Validation error:", err);
    if (err) {
      console.log("❌ Validation failed:", err);
      toast.error(err);
      return;
    }

    console.log("✅ Validation passed, proceeding with submission...");
    if (!user) {
      console.error("No user found - user is null");
      toast.error("You must be logged in to post a property");
      return;
    }

    console.log("User object:", user);
    console.log("User ID:", user.id);

    // Check if user session is valid
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Session error:", sessionError);
        toast.error("Your session has expired. Please log in again.");
        return;
      }
      if (!session) {
        console.error("No active session");
        toast.error("You must be logged in to post a property");
        return;
      }
      console.log("Session is valid:", session.user.id);
    } catch (sessionCheckError) {
      console.error("Session check failed:", sessionCheckError);
      toast.error("Authentication check failed. Please try again.");
      return;
    }

    setSubmitting(true);
    try {
      console.log("Starting property submission...");
      console.log("Form data:", form);

      // Upload images first to storage
      console.log("Uploading images...");
      const { urls: imageUrls, error: uploadError } = await uploadPropertyImages(
        crypto.randomUUID(), // temporary ID for organizing uploads
        form.images.map((image) => image.file),
      );

      if (uploadError || imageUrls.length === 0) {
        console.error("Image upload failed:", uploadError);
        throw new Error("Image upload failed. Please try again.");
      }

      console.log("Images uploaded successfully:", imageUrls);

      // Create property with image URLs
      const propertyPayload = {
        owner_id: user.id,
        owner_type: form.ownerType!,
        property_type: form.propertyType!,
        listing_type: form.listingType!,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category || null,
        price: Number(form.price),
        city: form.city.trim() || "Purulia",
        state: "West Bengal",
        locality: form.locality.trim() || null,
        address: form.address.trim() || null,
        pincode: form.pincode.trim() || null,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        area_sqft: form.areaSqft ? Number(form.areaSqft) : null,
        furnishing: form.furnishing || null,
        floor_number: form.floorNumber ? Number(form.floorNumber) : null,
        total_floors: form.totalFloors ? Number(form.totalFloors) : null,
        amenities: form.amenities,
        images: imageUrls,
        contact_phone: form.contactPhone.trim(),
        contact_whatsapp: form.contactWhatsapp.trim() || form.contactPhone.trim(),
        status: "active",
      };

      console.log("Property payload:", propertyPayload);

      const { data, error } = await createProperty(propertyPayload);

      if (error) {
        console.error("Property creation error:", error);
        throw error;
      }

      if (!data) {
        console.error("No data returned from property creation");
        throw new Error("Property creation failed - no data returned");
      }

      console.log("Property created successfully:", data);
      toast.success("Property posted successfully!");
      navigate({ to: "/properties/$id", params: { id: data.id } });
    } catch (e) {
      console.error("Submit error:", e);
      toast.error(e instanceof Error ? e.message : "Failed to post property");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return <div className="container mx-auto px-4 py-20 text-center md:px-6"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></div>;
  }

  const amenityList = form.propertyType === "commercial" ? COM_AMENITIES : RES_AMENITIES;
  const suggestedPrice = form.areaSqft && form.listingType
    ? form.listingType === "sale"
      ? Number(form.areaSqft) * 3500
      : Number(form.areaSqft) * 18
    : null;

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange/10 text-orange">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold md:text-3xl">Post Your Property</h1>
            <p className="text-sm text-muted-foreground">It's free and takes just a few minutes.</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-6 hidden md:flex items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition",
                i < step ? "bg-success text-success-foreground" :
                i === step ? "bg-primary text-primary-foreground" :
                "bg-muted text-muted-foreground"
              )}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn("text-xs font-medium", i === step ? "text-foreground" : "text-muted-foreground")}>{label}</span>
              {i < STEPS.length - 1 && <div className={cn("h-px flex-1", i < step ? "bg-success" : "bg-border")} />}
            </div>
          ))}
        </div>
        <div className="mb-6 md:hidden">
          <div className="flex items-center justify-between text-xs text-muted-foreground"><span>Step {step + 1} of {STEPS.length}</span><span>{STEPS[step]}</span></div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>
        </div>

        <Card className="p-6 md:p-8">
          {/* Step 0: Owner type */}
          {step === 0 && (
            <div>
              <h2 className="font-display text-xl font-semibold">Are you posting as…</h2>
              <p className="mt-1 text-sm text-muted-foreground">This helps us tag your listing correctly.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {(["individual", "broker"] as const).map((t) => (
                  <button key={t} onClick={() => set("ownerType", t)}
                    className={cn(
                      "rounded-xl border-2 p-5 text-left transition",
                      form.ownerType === t ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                    )}>
                    <div className="font-display text-lg font-semibold capitalize">{t === "individual" ? "Individual Owner" : "Broker / Agent"}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{t === "individual" ? "I own this property" : "I'm representing the owner"}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Property + listing type */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-semibold">What kind of property?</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {(["residential", "commercial"] as const).map((t) => (
                    <button key={t} onClick={() => set("propertyType", t)}
                      className={cn("rounded-xl border-2 p-4 text-left transition",
                        form.propertyType === t ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>
                      <div className="font-display font-semibold capitalize">{t}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{t === "residential" ? "House, apartment, plot, villa" : "Office, shop, warehouse"}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold">Listing type</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {(["sale", "rent"] as const).map((t) => (
                    <button key={t} onClick={() => set("listingType", t)}
                      className={cn("rounded-xl border-2 p-4 text-left transition",
                        form.listingType === t ? "border-orange bg-orange/5" : "border-border hover:border-orange/50")}>
                      <div className="font-display font-semibold capitalize">For {t}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-semibold">Property details</h2>
              <div>
                <Label htmlFor="title">Listing title *</Label>
                <Input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} className="mt-1.5"
                  placeholder={form.propertyType === "commercial" ? "e.g. Prime shop on Saheed Khudiram Road" : "e.g. Spacious 3 BHK in Bhatbandh"}
                  maxLength={120} />
                <p className="mt-1 text-xs text-muted-foreground">{form.title.length}/120</p>
              </div>
              <div>
                <Label htmlFor="desc">Description *</Label>
                <Textarea id="desc" rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} className="mt-1.5" maxLength={2000}
                  placeholder="Tell buyers what makes this property special — neighbourhood, schools nearby, recent renovations…" />
                <p className="mt-1 text-xs text-muted-foreground">{form.description.length}/2000</p>
              </div>

              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => set("category", v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {form.propertyType === "commercial" ? (
                      <>
                        <SelectItem value="office">Office</SelectItem>
                        <SelectItem value="shop">Shop / Showroom</SelectItem>
                        <SelectItem value="warehouse">Warehouse</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="apartment">Apartment / Flat</SelectItem>
                        <SelectItem value="house">House / Villa</SelectItem>
                        <SelectItem value="plot">Plot / Land</SelectItem>
                        <SelectItem value="pg">PG / Hostel</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {form.propertyType === "residential" && (
                  <>
                    <div>
                      <Label htmlFor="beds">Bedrooms *</Label>
                      <Input id="beds" type="number" min={0} value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="baths">Bathrooms *</Label>
                      <Input id="baths" type="number" min={0} value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} className="mt-1.5" />
                    </div>
                  </>
                )}
                <div>
                  <Label htmlFor="area">Area (sq ft) *</Label>
                  <Input id="area" type="number" min={0} value={form.areaSqft} onChange={(e) => set("areaSqft", e.target.value)} className="mt-1.5" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label>Furnishing</Label>
                  <Select value={form.furnishing} onValueChange={(v) => set("furnishing", v)}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="furnished">Furnished</SelectItem>
                      <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
                      <SelectItem value="unfurnished">Unfurnished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="floor">Floor number</Label>
                  <Input id="floor" type="number" min={0} value={form.floorNumber} onChange={(e) => set("floorNumber", e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="tfloor">Total floors</Label>
                  <Input id="tfloor" type="number" min={0} value={form.totalFloors} onChange={(e) => set("totalFloors", e.target.value)} className="mt-1.5" />
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Amenities</Label>
                <div className="flex flex-wrap gap-2">
                  {amenityList.map((a) => {
                    const on = form.amenities.includes(a);
                    return (
                      <button key={a} type="button" onClick={() => set("amenities", on ? form.amenities.filter((x) => x !== a) : [...form.amenities, a])}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                          on ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50",
                        )}>
                        {on && <Check className="h-3 w-3" />} {a}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-semibold">Where is the property?</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={form.city} onChange={(e) => set("city", e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="loc">Locality / Area *</Label>
                  <Input id="loc" value={form.locality} onChange={(e) => set("locality", e.target.value)} className="mt-1.5" placeholder="e.g. Bhatbandh, Hatuara…" />
                </div>
              </div>
              <div>
                <Label htmlFor="addr">Full address</Label>
                <Textarea id="addr" rows={2} value={form.address} onChange={(e) => set("address", e.target.value)} className="mt-1.5" placeholder="Street, landmark, building name…" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="pin">Pincode</Label>
                  <Input id="pin" value={form.pincode} onChange={(e) => set("pincode", e.target.value)} className="mt-1.5" maxLength={6} />
                </div>
                <div>
                  <Label htmlFor="lat">Latitude</Label>
                  <Input id="lat" value={form.latitude} onChange={(e) => set("latitude", e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="lng">Longitude</Label>
                  <Input id="lng" value={form.longitude} onChange={(e) => set("longitude", e.target.value)} className="mt-1.5" />
                </div>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={detectLocation}>
                <MapPin className="h-4 w-4" /> Detect my location
              </Button>
            </div>
          )}

          {/* Step 4: Pricing & Contact */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-semibold">Pricing & contact</h2>
              <div>
                <Label htmlFor="price">{form.listingType === "rent" ? "Monthly rent (₹) *" : "Price (₹) *"}</Label>
                <Input id="price" type="number" min={0} value={form.price} onChange={(e) => set("price", e.target.value)} className="mt-1.5" />
                {suggestedPrice && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-orange" />
                    Suggested: ₹{suggestedPrice.toLocaleString("en-IN")} {form.listingType === "rent" ? "/month" : ""} (based on local averages)
                  </p>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="cphone">Contact phone *</Label>
                  <Input id="cphone" type="tel" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} className="mt-1.5" placeholder="10-digit number" maxLength={15} />
                </div>
                <div>
                  <Label htmlFor="cwa">WhatsApp (optional)</Label>
                  <Input id="cwa" type="tel" value={form.contactWhatsapp} onChange={(e) => set("contactWhatsapp", e.target.value)} className="mt-1.5" placeholder="If different from phone" maxLength={15} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={!!form.contactPhone && form.contactWhatsapp === form.contactPhone} onCheckedChange={(c) => set("contactWhatsapp", c ? form.contactPhone : "")} />
                Use the same number for WhatsApp
              </label>
            </div>
          )}

          {/* Step 5: Photos */}
          {step === 5 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-semibold">Add photos</h2>
              <p className="text-sm text-muted-foreground">High-quality photos get up to 5x more enquiries. Add up to 10 images.</p>

              <label
                onDragOver={(e) => { e.preventDefault(); }}
                onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files) handleFiles(e.dataTransfer.files); }}
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center transition hover:border-primary hover:bg-primary/5"
              >
                <ImagePlus className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">Drag and drop images here, or click to browse</p>
                <p className="mt-1 text-xs text-muted-foreground">JPG, PNG up to 10MB each</p>
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
              </label>

              {form.images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {form.images.map((img, i) => (
                    <div key={img.url} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                      <img src={img.url} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
                      <button onClick={() => removeImage(i)} type="button"
                        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition group-hover:opacity-100">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      {i === 0 && <span className="absolute bottom-1.5 left-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">Cover</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* Preview */}
              <Card className="bg-secondary/50 p-4">
                <h3 className="font-display font-semibold text-sm">Preview</h3>
                <div className="mt-2 text-sm">
                  <div className="font-medium">{form.title || "Untitled"}</div>
                  <div className="text-xs text-muted-foreground">{[form.locality, form.city].filter(Boolean).join(", ")}</div>
                  <div className="mt-1 font-display font-bold text-orange">
                    ₹{Number(form.price || 0).toLocaleString("en-IN")}{form.listingType === "rent" ? "/mo" : ""}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Nav buttons */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
            <Button variant="ghost" size="sm" onClick={back} disabled={step === 0}>
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={next}>Next <ChevronRight className="h-4 w-4" /></Button>
            ) : (
              <Button onClick={() => { console.log("Button clicked!"); submit(); }} disabled={submitting} className="bg-orange text-orange-foreground hover:bg-orange/90">
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Posting…</> : <><Check className="h-4 w-4" /> Post Property</>}
              </Button>
            )}
          </div>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By posting, you agree to our terms and confirm the information is accurate. <Link to="/contact" className="text-primary hover:underline">Need help?</Link>
        </p>
      </div>
    </div>
  );
}
