import { describe, expect, it } from "vitest";
import { safeExternalUrl } from "./links";

describe("safeExternalUrl", () => {
  it("adds https to a domain without a scheme", () => {
    expect(safeExternalUrl("example.com/project")).toBe(
      "https://example.com/project",
    );
  });
  it("rejects script links from profile fields", () => {
    expect(safeExternalUrl("javascript:alert(1)")).toBeNull();
  });
  it("keeps an ordinary secure URL", () => {
    expect(safeExternalUrl("https://example.com/")).toBe(
      "https://example.com/",
    );
  });
});
