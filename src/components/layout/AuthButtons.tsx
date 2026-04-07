"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function AuthButtons() {
  const { user, profile, loading, signOut } = useAuth();

  if (loading) {
    return <div className="w-20 h-8 bg-surface-container-high rounded-xl animate-pulse" />;
  }

  if (user) {
    if (profile && !profile.is_approved) {
      return (
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-tertiary bg-tertiary-fixed px-3 py-1 rounded-full">
            Pending Approval
          </span>
          <button
            onClick={() => signOut()}
            className="text-on-surface-variant text-sm hover:text-primary transition-colors"
          >
            Sign Out
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-on-surface">
          {profile ? `${profile.first_name}` : "Resident"}
        </span>
        <button
          onClick={() => signOut()}
          className="text-on-surface-variant text-sm hover:text-primary transition-colors"
        >
          <Icon name="logout" className="text-lg" />
        </button>
      </div>
    );
  }

  return (
    <>
      <Button variant="ghost" href="/login">
        Login
      </Button>
      <Button variant="primary" href="/join">
        Join Us
      </Button>
    </>
  );
}
