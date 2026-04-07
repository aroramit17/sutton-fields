"use client";

import { useAuth } from "@/context/AuthContext";
import { Icon } from "./Icon";
import { Button } from "./Button";

interface ContentGateProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function ContentGate({ title, description, children }: ContentGateProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="bg-surface-container-low rounded-3xl p-12 animate-pulse" />;
  }

  if (user && profile?.is_approved) {
    return <>{children}</>;
  }

  return (
    <div className="bg-surface-container-low rounded-3xl p-8 md:p-12 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
        <Icon name="lock" className="text-3xl" />
      </div>
      <h3 className="text-2xl font-headline italic mb-3">{title}</h3>
      <p className="text-on-surface-variant max-w-md mx-auto mb-8">
        {description}
      </p>
      <div className="flex justify-center gap-4">
        <Button variant="primary" href="/login">
          <Icon name="login" className="text-sm" />
          Resident Login
        </Button>
        <Button variant="secondary" href="/join">
          Request Access
        </Button>
      </div>
    </div>
  );
}
