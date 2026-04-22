import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phone: z.string().trim().min(1, "Phone is required").max(30),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

export const submitContactForm = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("contact_submissions")
      .insert({
        name: data.name,
        phone: data.phone,
        email: data.email,
        message: data.message,
      });

    if (error) {
      console.error("Contact submission failed:", error);
      return { success: false, error: "We couldn't send your message. Please try again or call us directly." };
    }

    return { success: true, error: null };
  });
