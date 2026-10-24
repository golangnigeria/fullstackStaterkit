"use client";

import { useState, useEffect, type FormEvent, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail, requestEmailVerification } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  MailCheck,
  CheckCircle2,
} from "lucide-react";

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState(
    searchParams.get("token") || searchParams.get("code") || "",
  );
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlToken = searchParams.get("token") || searchParams.get("code");
    if (urlToken && !isSuccess && !isLoading) {
      handleVerify(urlToken);
    }
  }, []);

  const handleVerify = async (tokenToVerify: string) => {
    if (!tokenToVerify.trim()) {
      setError("Please enter the verification code sent to your email.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await verifyEmail({ token: tokenToVerify.trim() });
      setIsSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Invalid or expired verification code.");
      } else {
        setError("Failed to verify email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleVerify(token);
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setError("Please provide your email address to resend the code.");
      return;
    }

    setIsResending(true);
    setError(null);
    setResendStatus(null);

    try {
      await requestEmailVerification({ email: email.trim() });
      setResendStatus(
        "A fresh verification code has been dispatched to your inbox.",
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to resend verification code.");
      } else {
        setError("Failed to resend code. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="h-8 w-8" />
          <div className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Email Verified!</h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Your email address has been successfully confirmed. Welcome to
            TutorlinkNG!
          </p>
        </div>
        <Button
          onClick={() => {
            router.push("/dashboard");
            router.refresh();
          }}
          className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-md shadow-emerald-600/20"
        >
          Continue to Dashboard
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 mb-2">
          <MailCheck className="h-6 w-6" />
        </div>
        <h2 className="text-foreground text-3xl font-bold tracking-tight">
          Verify your email
        </h2>
        <p className="text-muted-foreground text-sm">
          {email ? (
            <span>
              We sent a verification code to{" "}
              <span className="font-semibold text-foreground bg-muted/80 px-2 py-0.5 rounded border border-border/50 font-mono text-xs">
                {email}
              </span>
            </span>
          ) : (
            "Enter the verification code sent to your email to activate your account."
          )}
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

      {resendStatus && (
        <Alert className="py-2.5 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <AlertDescription className="text-xs font-medium">
            {resendStatus}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="verify-code" className="text-sm font-medium">
            Verification Code
          </Label>
          <Input
            id="verify-code"
            type="text"
            placeholder="ENTER CODE"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            disabled={isLoading}
            required
            className="text-center font-mono text-base tracking-[0.25em] font-bold h-12 uppercase bg-muted border-transparent focus-visible:ring-primary/20"
            autoFocus
          />
        </div>

        {!email && (
          <div className="space-y-1.5">
            <Label htmlFor="verify-email" className="text-sm font-medium">
              Your Email Address
            </Label>
            <Input
              id="verify-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="bg-muted border-transparent h-10"
            />
          </div>
        )}

        <Button
          type="submit"
          className="h-11 w-full text-base font-semibold shadow-md shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Verifying Code...
            </>
          ) : (
            "Verify Email Address"
          )}
        </Button>
      </form>

      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
        <span>Didn&apos;t receive it?</span>
        <button
          type="button"
          disabled={isResending || !email}
          onClick={handleResend}
          className="font-medium text-primary hover:underline disabled:opacity-50"
        >
          {isResending ? "Sending new code..." : "Resend code"}
        </button>
      </div>

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

export function VerifyEmailForm() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyEmailInner />
    </Suspense>
  );
}
