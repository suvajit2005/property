import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/config/business";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[oklch(0.65_0.18_152)] text-white shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[oklch(0.65_0.18_152_/_0.4)] md:h-16 md:w-16"
    >
      <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
      <span className="absolute right-full mr-3 hidden whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background md:block opacity-0 group-hover:opacity-100">
        Chat with us
      </span>
    </a>
  );
}
