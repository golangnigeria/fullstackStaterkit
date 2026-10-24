import type { ReactNode } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { GraduationCap } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background flex w-full min-h-screen flex-col">
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Left Side: Editorial & Brand Banner */}
        <div className="bg-muted/30 relative hidden flex-col justify-between overflow-hidden p-12 lg:flex lg:w-1/2 border-r">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background -z-10" />
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-chart-1/10 blur-3xl" />

          <Link href="/" className="relative z-10 flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              Tutorlink<span className="text-primary">NG</span>
            </span>
          </Link>

          <div className="relative z-10 space-y-4 max-w-lg">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-semibold">
              Verified Tutors & Learner Community
            </div>
            <blockquote className="text-2xl font-bold leading-snug text-foreground">
              “Connecting ambitious learners with world-class tutors seamlessly across Nigeria and beyond.”
            </blockquote>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Organize study sessions, complete milestones, and manage assignments with a focused task ecosystem.
            </p>
          </div>

          <div className="relative z-10 text-xs text-muted-foreground">
            © {new Date().getFullYear()} TutorlinkNG. Dedicated to academic excellence.
          </div>
        </div>

        {/* Right Side: Interactive Form Container */}
        <div className="flex flex-1 flex-col justify-between p-6 sm:p-12 relative min-h-screen">
          <div className="flex items-center justify-between lg:justify-end w-full mb-6">
            <Link href="/" className="flex items-center gap-2.5 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight">TutorlinkNG</span>
            </Link>
            <ThemeToggle />
          </div>

          <div className="flex flex-1 items-center justify-center py-6">
            <div className="w-full max-w-md">{children}</div>
          </div>

          <footer className="border-border/60 text-muted-foreground flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs sm:flex-row mt-6">
            <span>© {new Date().getFullYear()} TutorlinkNG. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/sign-in" className="hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link href="/sign-up" className="hover:text-foreground transition-colors">
                Register
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
