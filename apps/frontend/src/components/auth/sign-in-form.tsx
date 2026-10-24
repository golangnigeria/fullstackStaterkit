"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, requestEmailVerification } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  Loader2,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Mail,
} from "lucide-react";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signIn.credential({
        credential: email.trim(),
        password,
        remember_me: remember,
      } as any);
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Invalid credentials. Please try again.");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInlineResend = async () => {
    if (!email) return;
    setResendLoading(true);
    setResendSuccess(false);
    try {
      await requestEmailVerification({ email: email.trim() });
      setResendSuccess(true);
    } catch {
      // silently ignore or keep state
    } finally {
      setResendLoading(false);
    }
  };

  const isUnverifiedEmail = Boolean(
    error &&
      (error.toLowerCase().includes("not verified") ||
        error.toLowerCase().includes("email_not_verified")),
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-foreground text-3xl font-bold tracking-tight">
          Welcome back
        </h2>
        <p className="text-muted-foreground text-sm">
          Sign in to pick up right where you left off.
        </p>
      </div>

      {isUnverifiedEmail ? (
        <div className="relative overflow-hidden rounded-xl border border-amber-500/35 bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-transparent p-4 shadow-sm backdrop-blur-sm transition-all animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-inner">
              <Mail className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-amber-950 dark:text-amber-200 uppercase tracking-wider">
                  Email Verification Required
                </h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  Pending
                </span>
              </div>
              <p className="text-xs text-amber-900/90 dark:text-amber-200/80 leading-relaxed">
                Your account has been created, but your email address is not verified yet.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <Link
                  href={`/verify-email?email=${encodeURIComponent(email)}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs py-2 px-3.5 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] text-center"
                >
                  Verify Email Now
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  type="button"
                  disabled={resendLoading}
                  onClick={handleInlineResend}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/30 bg-background/60 hover:bg-background/90 text-amber-900 dark:text-amber-200 font-medium text-xs py-2 px-3 transition-colors disabled:opacity-60"
                >
                  {resendLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5" />
                  )}
                  {resendSuccess ? "Code Resent!" : "Resend Code"}
                </button>
              </div>
              {resendSuccess && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-1 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Verification email resent to {email}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : error ? (
        <Alert variant="destructive" className="py-2.5 bg-destructive/10 border-destructive/20 text-destructive dark:text-red-400 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
        </Alert>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="sign-in-email" className="text-sm font-medium">
            Email Address
          </Label>
          <Input
            id="sign-in-email"
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

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="sign-in-password" className="text-sm font-medium">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-primary text-xs underline-offset-4 transition-all hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="sign-in-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              autoComplete="current-password"
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

        <div className="flex items-center gap-3">
          <Switch
            id="remember"
            checked={remember}
            onCheckedChange={setRemember}
            disabled={isLoading}
          />
          <Label
            htmlFor="remember"
            className="text-muted-foreground cursor-pointer text-sm select-none"
          >
            Keep me signed in for 30 days
          </Label>
        </div>

        <Button
          type="submit"
          className="h-11 w-full text-base font-semibold shadow-md shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        New here?{" "}
        <Link
          href="/sign-up"
          className="text-primary font-medium underline-offset-4 transition-all hover:underline"
        >
          Create a free account
        </Link>
      </p>
    </div>
  );
}
