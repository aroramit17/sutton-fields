"use client";

import { Button } from "@/components/ui/Button";

export function AuthButtons() {
  // Future: replace with auth-gated components
  // const { user } = useSession();
  // if (user) return <UserMenu user={user} />;
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
