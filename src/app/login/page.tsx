import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-4xl font-headline italic text-on-surface mb-2">
        Welcome Back
      </h1>
      <p className="text-on-surface-variant mb-8">
        Sign in to your Sutton Fields resident account.
      </p>

      <SignIn
        routing="hash"
        fallbackRedirectUrl="/"
        signUpUrl="/join"
      />
    </div>
  );
}
