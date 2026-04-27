import { supabase } from "./client";
import type { Tables, TablesInsert, TablesUpdate } from "./types";

export type ProfileRow = Tables<"profiles">;
export type ProfileInsert = TablesInsert<"profiles">;
export type ProfileUpdate = TablesUpdate<"profiles">;

export type PropertyRow = Tables<"properties">;
export type PropertyInsert = TablesInsert<"properties">;
export type PropertyUpdate = TablesUpdate<"properties">;

export type SavedPropertyRow = Tables<"saved_properties">;
export type SavedPropertyInsert = TablesInsert<"saved_properties">;

export async function getProfileById(userId: string) {
  return supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
}

export async function upsertProfile(profile: ProfileInsert) {
  return supabase.from("profiles").upsert(profile).select("*").single();
}

export async function updateProfile(userId: string, update: ProfileUpdate) {
  return supabase.from("profiles").update(update).eq("id", userId).select("*").single();
}

export async function createProperty(payload: PropertyInsert) {
  try {
    console.log("Creating property with payload:", payload);

    const { data, error } = await supabase
      .from("properties")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      console.error("Property creation error:", error);
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    console.log("Property created successfully:", data);
    return { data, error: null };
  } catch (error) {
    console.error("Failed to create property:", error);
    return { data: null, error };
  }
}

export async function getPropertiesByOwner(ownerId: string) {
  return supabase
    .from("properties")
    .select(
      "id,title,price,listing_type,property_type,city,locality,images,status,views,is_featured,created_at",
    )
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });
}

export async function getSavedPropertiesCount(userId: string) {
  return supabase
    .from("saved_properties")
    .select("property_id", { count: "exact", head: true })
    .eq("user_id", userId);
}

export async function deletePropertyById(id: string) {
  return supabase.from("properties").delete().eq("id", id);
}
