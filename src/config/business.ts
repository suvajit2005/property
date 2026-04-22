/**
 * Business configuration — edit this file to customize the website.
 * All placeholder values are clearly marked with brackets.
 */

export const BUSINESS = {
  name: "[Your Business Name]",
  shortName: "[Brand]",
  tagline: "Your Trusted Property Partner",
  location: "[City, State]",
  fullAddress: "[123 Main Street, City, State 00000]",
  phone: "+1 (555) 000-0000",
  phoneRaw: "15550000000",
  email: "contact@yourdomain.com",
  // International format, digits only — used for wa.me links
  whatsapp: "15550000000",
  whatsappMessage: "Hi! I'd like to know more about your properties.",
  // Replace with real social URLs
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
  },
  // Stats shown on Home & About
  stats: {
    yearsExperience: "15+",
    propertiesSold: "500+",
    happyClients: "1,200+",
    citiesServed: "8",
  },
  // Google Maps embed — replace with your actual location's embed URL
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.0!2d-74.006!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjEiTiA3NMKwMDAnMjEuNiJX!5e0!3m2!1sen!2sus!4v1700000000000",
} as const;

export const whatsappLink = (msg?: string) =>
  `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(msg ?? BUSINESS.whatsappMessage)}`;
