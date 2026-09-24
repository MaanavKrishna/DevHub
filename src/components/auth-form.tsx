"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    const result =
      mode === "signup"
        ? await authClient.signUp.email({
            name: String(data.get("name") ?? ""),
            email,
            password,
          })
        : await authClient.signIn.email({ email, password });
    if (result.error) {
      setError(
        result.error.message ||
          "Could not continue. Check your details and try again.",
      );
      setPending(false);
      return;
    }
    const next = new URLSearchParams(window.location.search).get("next");
    router.push(
      next?.startsWith("/") && !next.startsWith("//") ? next : "/dashboard",
    );
    router.refresh();
  }
  return (
    <div className="auth-form-card">
      <div className="auth-icon">✳</div>
      <h1>{mode === "login" ? "Welcome back." : "Make your space."}</h1>
      <p>
        {mode === "login"
          ? "Sign in to get back to the people and projects you saved."
          : "Create an account to keep your open source discoveries together."}
      </p>
      <form onSubmit={submit}>
        {mode === "signup" && (
          <label>
            Name
            <input
              name="name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={80}
              placeholder="Your name"
            />
          </label>
        )}
        <label>
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
            required
            minLength={8}
            placeholder={
              mode === "signup" ? "At least 8 characters" : "Your password"
            }
          />
        </label>
        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}
        <button
          className="button button-primary auth-submit"
          type="submit"
          disabled={pending}
        >
          {pending ? (
            <LoaderCircle className="spin" size={18} />
          ) : (
            <>
              {mode === "login" ? "Sign in" : "Create account"}
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
      <div className="auth-switch">
        {mode === "login" ? "New to DevHub?" : "Already have an account?"}{" "}
        <Link href={mode === "login" ? "/signup" : "/login"}>
          {mode === "login" ? "Create an account" : "Sign in"}
        </Link>
      </div>
    </div>
  );
}
