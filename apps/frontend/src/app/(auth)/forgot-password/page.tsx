import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password - TutorlinkNG",
  description: "Request a password reset verification code for your TutorlinkNG account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
