import { afterEach, describe, expect, it, vi } from "vitest";
import { GitHubError, githubRequest, searchInput } from "./github";

afterEach(() => vi.unstubAllGlobals());

describe("searchInput", () => {
  it("trims valid queries and clamps page numbers", () => {
    expect(searchInput("  react  ", "900")).toEqual({
      query: "react",
      page: 100,
    });
  });
  it("rejects empty searches", () => {
    expect(() => searchInput("   ", "1")).toThrow("Enter a search term");
  });
});

describe("githubRequest", () => {
  it("maps a rate limit response to a retryable error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("{}", {
          status: 403,
          headers: {
            "x-ratelimit-remaining": "0",
            "x-ratelimit-reset": "2000000000",
          },
        }),
      ),
    );
    await expect(githubRequest("/users/octocat")).rejects.toMatchObject({
      kind: "rate-limit",
      retryAt: 2000000000,
    });
  });
  it("maps a missing profile to a not-found error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("{}", { status: 404 })),
    );
    await expect(githubRequest("/users/missing")).rejects.toEqual(
      new GitHubError("not-found", "GitHub could not find this item."),
    );
  });
  it("does not call every forbidden response a rate limit", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response('{"message":"Resource not accessible by integration"}', {
          status: 403,
          headers: { "x-ratelimit-remaining": "20" },
        }),
      ),
    );
    await expect(githubRequest("/repos/private/repo")).rejects.toMatchObject({
      kind: "unavailable",
    });
  });
});
