import { auth } from "@/lib/auth";
import { favoriteInput } from "@/lib/favorites";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

async function getUserId(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user.id;
}

export async function GET(request: Request) {
  const userId = await getUserId(request);
  if (!userId)
    return Response.json(
      { error: "Sign in to see your saved items." },
      { status: 401 },
    );
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { savedAt: "desc" },
  });
  return Response.json({ favorites });
}

export async function POST(request: Request) {
  const userId = await getUserId(request);
  if (!userId)
    return Response.json({ error: "Sign in to save items." }, { status: 401 });
  let input: ReturnType<typeof favoriteInput>;
  try {
    input = favoriteInput(await request.json());
  } catch {
    return Response.json(
      { error: "Choose a valid GitHub developer or repository." },
      { status: 400 },
    );
  }
  const favorite = await prisma.favorite.upsert({
    where: {
      userId_kind_githubId: {
        userId,
        kind: input.kind,
        githubId: input.githubId,
      },
    },
    create: { userId, ...input },
    update: {
      slug: input.slug,
      title: input.title,
      subtitle: input.subtitle,
      imageUrl: input.imageUrl,
    },
  });
  return Response.json({ favorite }, { status: 201 });
}

export async function DELETE(request: Request) {
  const userId = await getUserId(request);
  if (!userId)
    return Response.json(
      { error: "Sign in to manage saved items." },
      { status: 401 },
    );
  const schema = z.object({
    kind: z.enum(["developer", "repository"]),
    githubId: z.string().regex(/^\d+$/),
  });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return Response.json(
      { error: "Choose a valid saved item." },
      { status: 400 },
    );
  await prisma.favorite.deleteMany({
    where: { userId, kind: parsed.data.kind, githubId: parsed.data.githubId },
  });
  return new Response(null, { status: 204 });
}
