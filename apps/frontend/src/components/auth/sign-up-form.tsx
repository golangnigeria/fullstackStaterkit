"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Loader2, AlertCircle } from "lucide-react";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signUp.credential({
        email: email.trim(),
        password,
        firstname: firstName.trim() || undefined,
        lastname: lastName.trim() || undefined,
      });
      router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to create account. Please try again.");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-foreground text-3xl font-bold tracking-tight">
          Create an account
        </h2>
        <p className="text-muted-foreground text-sm">
          Start your organized tutoring journey with TutorlinkNG.
        </p>
      </div>

      {error && (
        <Alert
          variant="destructive"
          className="py-2.5 bg-destructive/10 border-destructive/20 text-destructive dark:text-red-400"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs font-medium">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="sign-up-firstname" className="text-sm font-medium">
              First name
            </Label>
            <Input
              id="sign-up-firstname"
              type="text"
              placeholder="Ada"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
              autoComplete="given-name"
              className="bg-muted focus-visible:ring-primary/20 focus-visible:border-primary/50 h-10 border-transparent ring-0"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sign-up-lastname" className="text-sm font-medium">
              Last name
            </Label>
            <Input
              id="sign-up-lastname"
              type="text"
              placeholder="Lovelace"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isLoading}
              autoComplete="family-name"
              className="bg-muted focus-visible:ring-primary/20 focus-visible:border-primary/50 h-10 border-transparent ring-0"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sign-up-email" className="text-sm font-medium">
            Email Address
          </Label>
          <Input
            id="sign-up-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            autoComplete="email"
            className="bg-muted focus-visible:ring-primary/20 focus-visible:border-primary/50 h-10 border-transparent ring-0"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sign-up-password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Input
              id="sign-up-password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              autoComplete="new-password"
              className="bg-muted focus-visible:ring-primary/20 focus-visible:border-primary/50 h-10 border-transparent pr-10 ring-0"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sign-up-confirm" className="text-sm font-medium">
            Confirm Password
          </Label>
          <Input
            id="sign-up-confirm"
            type="password"
            placeholder="Repeat password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            required
            autoComplete="new-password"
            className="bg-muted focus-visible:ring-primary/20 focus-visible:border-primary/50 h-10 border-transparent ring-0"
          />
        </div>

        <Button
          type="submit"
          className="h-11 w-full text-base font-semibold shadow-md shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-primary font-medium underline-offset-4 transition-all hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
