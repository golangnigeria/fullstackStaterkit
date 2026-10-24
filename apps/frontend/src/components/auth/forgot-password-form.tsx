"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { password as authPassword } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, ArrowRight, ArrowLeft, MailCheck } from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authPassword.requestReset({ email: email.trim() });
      setSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to process request. Please try again.");
      } else {
        setError("Failed to process request. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-md">
          <MailCheck className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Check your email</h2>
          <p className="text-sm text-muted-foreground">
            We sent a verification code to{" "}
            <span className="font-semibold text-foreground">{email}</span>.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Link href="/reset-password" className="block w-full">
            <Button className="w-full h-11 text-base font-semibold gap-2">
              Enter Reset Code
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full h-10 text-sm"
            onClick={() => setSubmitted(false)}
          >
            Try another email
          </Button>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground pt-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-foreground text-3xl font-bold tracking-tight">
          Forgot password?
        </h2>
        <p className="text-muted-foreground text-sm">
          Enter your email address and we&apos;ll send you a verification code to reset your password.
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="forgot-email" className="text-sm font-medium">
            Work or Personal Email
          </Label>
          <Input
            id="forgot-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            autoComplete="email"
            className="bg-muted focus-visible:ring-primary/20 focus-visible:border-primary/50 h-10 border-transparent ring-0"
          />
        </div>

        <Button
          type="submit"
          className="h-11 w-full text-base font-semibold shadow-md shadow-primary/20"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Sending code...
            </>
          ) : (
            "Send verification code"
          )}
        </Button>
      </form>

      <div className="text-center pt-2">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Sign in
        </Link>
      </div>
    </div>
  );
}
