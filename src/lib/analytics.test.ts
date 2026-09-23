import { describe, expect, it } from "vitest";
import { formatShare, languageShares } from "./analytics";

describe("languageShares", () => {
  it("sorts languages by bytes and calculates percentages", () => {
    expect(languageShares({ TypeScript: 750, CSS: 250 })).toEqual([
      { name: "TypeScript", bytes: 750, percentage: 75 },
      { name: "CSS", bytes: 250, percentage: 25 },
    ]);
  });

  it("returns an empty list when GitHub has no language data", () => {
    expect(languageShares({})).toEqual([]);
  });
});

it("labels a nonzero share smaller than one percent accurately", () => {
  expect(formatShare({ name: "Shell", bytes: 1, percentage: 0 })).toBe("<1%");
});
