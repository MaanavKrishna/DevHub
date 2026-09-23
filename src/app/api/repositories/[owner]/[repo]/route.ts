import { apiError } from "@/lib/api-error";
import {
  getRepo,
  getRepoCommits,
  getRepoContributors,
  getRepoLanguages,
} from "@/lib/github";
import { languageShares } from "@/lib/analytics";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> },
) {
  const { owner, repo } = await params;
  try {
    const repository = await getRepo(owner, repo);
    const [languages, contributors, commits] = await Promise.all([
      getRepoLanguages(owner, repo).catch(() => null),
      getRepoContributors(owner, repo).catch(() => null),
      getRepoCommits(owner, repo).catch(() => null),
    ]);
    return Response.json({
      repository,
      languages: languages ? languageShares(languages) : null,
      contributors,
      commits,
    });
  } catch (error) {
    return apiError(error);
  }
}
