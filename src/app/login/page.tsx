import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
export const metadata: Metadata = { title: "Sign in" };
export default function LoginPage() {
  return (
    <div className="auth-page shell">
      <AuthForm mode="login" />
      <div className="auth-aside">
        <div className="auth-aside-art">{`{ explore: true }`}</div>
        <h2>Your next discovery is waiting.</h2>
        <p>
          A personal home for the developers and repositories you want to keep
          close.
        </p>
      </div>
    </div>
  );
}
