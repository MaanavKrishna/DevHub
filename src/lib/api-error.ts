import { GitHubError } from "./github";

export function apiError(error: unknown): Response {
  if (error instanceof GitHubError) {
    const status =
      error.kind === "not-found"
        ? 404
        : error.kind === "rate-limit"
          ? 429
          : 502;
    return Response.json(
      {
        error: error.message,
        kind: error.kind,
        ...(error.retryAt ? { retryAt: error.retryAt } : {}),
      },
      { status },
    );
  }
  if (
    error instanceof Error &&
    error.message.startsWith("Enter a search term")
  ) {
    return Response.json(
      { error: error.message, kind: "validation" },
      { status: 400 },
    );
  }
  return Response.json(
    { error: "Something went wrong. Please try again.", kind: "unavailable" },
    { status: 500 },
  );
}
