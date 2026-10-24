import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  CheckCircle2,
  Users,
  Zap,
  Shield,
  ArrowRight,
  ListTodo,
  Layers,
  Sparkles,
  BarChart3,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
              TL
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Tutorlink<span className="text-primary">NG</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/sign-in">
              <Button variant="ghost" className="font-medium">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="font-medium shadow-sm shadow-primary/20">
                Get Started
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(120,119,198,0.2),rgba(0,0,0,0))]" />
          
          <div className="container mx-auto text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Sparkles className="h-3.5 w-3.5" />
              Empowering High-Performance Learning & Task Management
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
              Organize, Focus, and <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary via-primary/80 to-chart-1 bg-clip-text text-transparent">
                Achieve More Together
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              TutorlinkNG connects intelligent task tracking, category organization,
              and seamless productivity in one unified workspace built for learners and tutors.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/sign-up">
                <Button size="lg" className="h-12 text-base px-8 font-semibold shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Start Free Today
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" size="lg" className="h-12 text-base px-8 font-semibold hover:bg-muted transition-all">
                  Sign In to Workspace
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-y bg-muted/40">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">
                Built for Clarity and Performance
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Everything you need to manage your personal schedule, study goals,
                and tutoring tasks with zero clutter.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-xl border bg-card p-6 shadow-xs hover:border-primary/40 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <ListTodo className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Smart Tasks</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Track priorities, due dates, and statuses from draft to completed with instant updates.
                </p>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-xs hover:border-primary/40 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Categorization</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Color-code categories to segment courses, subjects, assignments, and tutoring milestones.
                </p>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-xs hover:border-primary/40 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Insights & Metrics</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Real-time status metrics and progress metrics to keep you motivated and on schedule.
                </p>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-xs hover:border-primary/40 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure Authentication</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Native password verification, session tokens, and end-to-end security protection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              Ready to streamline your workflow?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join TutorlinkNG today and experience a calm, focused task management environment.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="h-12 px-8 font-semibold shadow-md shadow-primary/20">
                Create Free Account
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-4 sm:px-6 lg:px-8 bg-card/40">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} TutorlinkNG. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/sign-in" className="hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up" className="hover:text-foreground transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
