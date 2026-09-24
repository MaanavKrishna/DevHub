import Link from "next/link";
import { AlertCircle, SearchX } from "lucide-react";
import { GitHubError } from "@/lib/github";

export function StatePanel({
  title,
  description,
  href,
  action = "Back to explore",
  error,
}: {
  title?: string;
  description?: string;
  href?: string;
  action?: string;
  error?: unknown;
}) {
  const known = error instanceof GitHubError ? error : null;
  const heading =
    title ??
    (known?.kind === "not-found"
      ? "This page isn't on GitHub"
      : known?.kind === "rate-limit"
        ? "GitHub needs a moment"
        : "We couldn't load this right now");
  const detail =
    description ??
    (known?.retryAt
      ? `GitHub's limit resets around ${new Date(known.retryAt * 1000).toLocaleTimeString()}. Try again then.`
      : (known?.message ?? "Check your connection and try again in a moment."));
  return (
    <div className="state-panel" role={error ? "alert" : undefined}>
      <div className="state-icon">
        {error ? <AlertCircle size={24} /> : <SearchX size={24} />}
      </div>
      <h2>{heading}</h2>
      <p>{detail}</p>
      {href && (
        <Link className="button button-primary" href={href}>
          {action}
        </Link>
      )}
    </div>
  );
}
