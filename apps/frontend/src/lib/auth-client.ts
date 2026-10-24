import { env } from "@/config/env";
import { createAuthClient } from "limen-auth/react";
import { credentialPasswordPlugin } from "limen-auth/plugins";

export const auth = createAuthClient({
  baseURL: env.VITE_API_URL,
  plugins: [credentialPasswordPlugin()],
});

export const {
  useSession,
  signIn,
  signUp,
  signout,
  getSession,
  password,
  verifyEmail,
  requestEmailVerification,
} = auth;
