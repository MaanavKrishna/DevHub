import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
export const metadata: Metadata = { title: "Create account" };
export default function SignupPage() {
  return (
    <div className="auth-page shell">
      <AuthForm mode="signup" />
      <div className="auth-aside">
        <div className="auth-aside-art">{`{ ideas: ∞ }`}</div>
        <h2>Build a better reading list.</h2>
        <p>
          Save interesting work as you browse and come back when you are ready
          to dive in.
        </p>
      </div>
    </div>
  );
}
