import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Profile = {
  id: string;
  display_name: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  avatar_url: string | null;
  role: "buyer" | "seller" | "broker" | "admin";
  owner_type: "individual" | "broker" | null;
  city: string | null;
  bio: string | null;
  onboarded: boolean;
  preferences: Record<string, unknown>;
};

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .maybeSingle();
      if (error) {
        console.error("Failed to load profile:", error);
        setProfile(null);
      } else {
        setProfile(data as Profile | null);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
      setProfile(null);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        // Defer profile load to avoid deadlocks
        setTimeout(() => loadProfile(newSession.user.id), 0);
      } else {
        setProfile(null);
      }
    });

    supabase.auth.getSession()
      .then(({ data: { session: existingSession }, error }) => {
        if (error) {
          console.error("Failed to get session:", error);
          setSession(null);
          setUser(null);
        } else {
          setSession(existingSession ?? null);
          setUser(existingSession?.user ?? null);
          if (existingSession?.user) {
            loadProfile(existingSession.user.id);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to get session:", err);
        setSession(null);
        setUser(null);
        setLoading(false);
      });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) await loadProfile(user.id);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
