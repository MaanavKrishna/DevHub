import { describe, expect, it } from "vitest";
import { apiError } from "./api-error";
import { GitHubError } from "./github";

describe("apiError", () => {
  it("returns 429 and retry time for GitHub limits", async () => {
    const response = apiError(
      new GitHubError("rate-limit", "Limit reached", 2000000000),
    );
    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({
      error: "Limit reached",
      kind: "rate-limit",
      retryAt: 2000000000,
    });
  });
  it("does not expose unexpected internal errors", async () => {
    const response = apiError(new Error("secret"));
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "Something went wrong. Please try again.",
      kind: "unavailable",
    });
  });
});
