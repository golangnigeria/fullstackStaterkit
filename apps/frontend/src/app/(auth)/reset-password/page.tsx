import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password - TutorlinkNG",
  description: "Reset your TutorlinkNG account password with your verification code.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
