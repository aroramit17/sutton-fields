"use client";

import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";

export function AuthButtons() {
  const { profile } = useAuth();
  // Signed in but no profile row yet (didn't finish the address step) or
  // still pending admin approval — surface a way back to /join instead of
  // making people remember/re-find that URL themselves.
  const needsVerification = !profile || !profile.is_approved;

  return (
    <>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <Button variant="ghost">Login</Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button variant="primary">Join Us</Button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton>
          {needsVerification && (
            <UserButton.MenuItems>
              <UserButton.Link
                label={profile ? "Account Pending Approval" : "Verify Address"}
                href="/join"
                labelIcon={<Icon name="verified_user" className="!text-base" />}
              />
            </UserButton.MenuItems>
          )}
        </UserButton>
      </Show>
    </>
  );
}
