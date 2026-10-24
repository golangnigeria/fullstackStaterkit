import { SignUpForm } from "@/components/auth/sign-up-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account - TutorlinkNG",
  description: "Create your free TutorlinkNG account to get started.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
