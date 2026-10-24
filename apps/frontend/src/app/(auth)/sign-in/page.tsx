import { SignInForm } from "@/components/auth/sign-in-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - TutorlinkNG",
  description: "Sign in to your TutorlinkNG workspace.",
};

export default function SignInPage() {
  return <SignInForm />;
}
