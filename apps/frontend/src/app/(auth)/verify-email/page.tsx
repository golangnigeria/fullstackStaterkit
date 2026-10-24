import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email - TutorlinkNG",
  description: "Verify your email address to activate your TutorlinkNG account.",
};

export default function VerifyEmailPage() {
  return <VerifyEmailForm />;
}
