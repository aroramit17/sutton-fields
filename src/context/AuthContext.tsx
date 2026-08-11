"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useUser } from "@clerk/nextjs";
import { getMyProfile } from "@/actions/profile";
import type { Profile } from "@/types/database";

interface AuthContextType {
  user: { id: string } | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth identity/session lives entirely in Clerk now (ClerkProvider in
// layout.tsx). This context only adds the app-specific `profiles` row
// (resident verification, admin flag) on top, so ContentGate and every
// board's form/card keep working against the same { user, profile, loading }
// shape they used with Supabase.
export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  async function refreshProfile() {
    if (!clerkUser) {
      setProfile(null);
      return;
    }
    const p = await getMyProfile();
    setProfile(p);
  }

  useEffect(() => {
    if (!isLoaded) return;
    if (!clerkUser) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    getMyProfile()
      .then(setProfile)
      .finally(() => setProfileLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, clerkUser?.id]);

  return (
    <AuthContext.Provider
      value={{
        user: clerkUser ? { id: clerkUser.id } : null,
        profile,
        loading: !isLoaded || profileLoading,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
