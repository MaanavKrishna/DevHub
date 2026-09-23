import { apiError } from "@/lib/api-error";
import { getUser, getUserRepos } from "@/lib/github";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ login: string }> },
) {
  const { login } = await params;
  try {
    const user = await getUser(login);
    const repos = await getUserRepos(login).catch(() => null);
    return Response.json({ user, repos });
  } catch (error) {
    return apiError(error);
  }
}
