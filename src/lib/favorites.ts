import { z } from "zod";

const schema = z
  .object({
    kind: z.enum(["developer", "repository"]),
    githubId: z.string().regex(/^\d+$/),
    slug: z.string().min(1).max(200),
    title: z.string().min(1).max(160),
    subtitle: z.string().max(300).optional().nullable(),
    imageUrl: z.url().optional().nullable(),
  })
  .refine(
    (value) =>
      value.kind === "developer"
        ? /^[\w-]+$/.test(value.slug)
        : /^[\w.-]+\/[\w.-]+$/.test(value.slug),
    { message: "Invalid GitHub item path" },
  );

export function favoriteInput(value: unknown) {
  return schema.parse(value);
}
