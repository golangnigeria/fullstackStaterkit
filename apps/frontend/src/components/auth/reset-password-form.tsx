"use client";

import { useState, type FormEvent, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { password as authPassword } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  Loader2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState(
    searchParams.get("token") || searchParams.get("code") || "",
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setError("Please enter the verification code sent to your email.");
      return;
    }

    if (!newPassword) {
      setError("Please enter your new password.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authPassword.reset({ token: token.trim(), newPassword });
      setIsSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(
          err.message ||
            "Failed to reset password. The code may be invalid or expired.",
        );
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20 shadow-lg">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Password Reset Complete
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Your password has been reset successfully. You can now log in using
            your new credentials.
          </p>
        </div>
        <Link href="/sign-in" className="block w-full">
          <Button className="w-full h-11 text-base font-semibold gap-2">
            Sign in now
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 mb-2">
          <KeyRound className="h-6 w-6" />
        </div>
        <h2 className="text-foreground text-3xl font-bold tracking-tight">
          Reset your password
        </h2>
        <p className="text-muted-foreground text-sm">
          Enter the verification code from your email and choose a new password.
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
        <div className="space-y-1.5">
          <Label htmlFor="reset-code" className="text-sm font-medium">
            Verification Code
          </Label>
          <Input
            id="reset-code"
            type="text"
            placeholder="Paste verification code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            disabled={isLoading}
            required
            className="bg-muted font-mono text-sm tracking-wide h-10 border-transparent"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reset-new-password" className="text-sm font-medium">
            New Password
          </Label>
          <div className="relative">
            <Input
              id="reset-new-password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
              required
              autoComplete="new-password"
              className="bg-muted focus-visible:ring-primary/20 h-10 border-transparent pr-10"
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
          <Label htmlFor="reset-confirm-password" className="text-sm font-medium">
            Confirm New Password
          </Label>
          <Input
            id="reset-confirm-password"
            type="password"
            placeholder="Repeat new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            required
            autoComplete="new-password"
            className="bg-muted focus-visible:ring-primary/20 h-10 border-transparent"
          />
        </div>

        <Button
          type="submit"
          className="h-11 w-full text-base font-semibold shadow-md shadow-primary/20 mt-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Resetting password...
            </>
          ) : (
            "Reset Password"
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

export function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <ResetPasswordInner />
    </Suspense>
  );
}
