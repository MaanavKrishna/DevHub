import { describe, expect, it } from "vitest";
import { favoriteInput } from "./favorites";

describe("favoriteInput", () => {
  it("accepts a developer with a stable GitHub ID", () => {
    expect(
      favoriteInput({
        kind: "developer",
        githubId: "123",
        slug: "octocat",
        title: "octocat",
        imageUrl: "https://avatars.githubusercontent.com/u/123",
      }).kind,
    ).toBe("developer");
  });
  it("rejects repository slugs without owner and name", () => {
    expect(() =>
      favoriteInput({
        kind: "repository",
        githubId: "123",
        slug: "bad",
        title: "bad",
      }),
    ).toThrow();
  });
  it("rejects invalid kinds", () => {
    expect(() =>
      favoriteInput({
        kind: "issue",
        githubId: "123",
        slug: "bad",
        title: "bad",
      }),
    ).toThrow();
  });
});
