import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-xl mb-4">
        404
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Page Not Found</h1>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm">
        The page you are looking for does not exist or may have been moved.
      </p>
      <div className="flex items-center gap-3 mt-6">
        <Link href="/dashboard">
          <Button className="font-medium">Go to Dashboard</Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="font-medium">
            Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
