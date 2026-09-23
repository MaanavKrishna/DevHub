export type GitHubUser = {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string | null;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
};

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  subscribers_count?: number;
  pushed_at: string;
  created_at: string;
  topics: string[];
  owner: { login: string; avatar_url: string; html_url: string };
  license: { name: string } | null;
};

export type GitHubContributor = {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
};
export type GitHubCommit = {
  sha: string;
  html_url: string;
  commit: { message: string; author: { name: string; date: string } | null };
  author: { login: string; avatar_url: string } | null;
};
export type SearchResult<T> = {
  total_count: number;
  incomplete_results: boolean;
  items: T[];
};

export class GitHubError extends Error {
  constructor(
    public kind: "not-found" | "rate-limit" | "unavailable",
    message: string,
    public retryAt?: number,
  ) {
    super(message);
    this.name = "GitHubError";
  }
}

export function searchInput(rawQuery: string, rawPage: string | null) {
  const query = rawQuery.trim().slice(0, 100);
  if (!query) throw new Error("Enter a search term to explore GitHub.");
  const parsed = Number(rawPage);
  const page =
    Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, 100) : 1;
  return { query, page };
}

export async function githubRequest<T>(
  path: string,
  revalidate = 120,
): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "DevHub-analytics",
  };
  if (process.env.GITHUB_TOKEN)
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  let response: Response;
  try {
    response = await fetch(`https://api.github.com${path}`, {
      headers,
      next: { revalidate },
    });
  } catch {
    throw new GitHubError(
      "unavailable",
      "GitHub is unavailable right now. Try again shortly.",
    );
  }
  if (response.status === 404)
    throw new GitHubError("not-found", "GitHub could not find this item.");
  if (response.status === 403 || response.status === 429) {
    const body = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    const limited =
      response.status === 429 ||
      response.headers.get("x-ratelimit-remaining") === "0" ||
      /rate limit|abuse detection/i.test(body.message ?? "");
    if (limited) {
      const reset = Number(response.headers.get("x-ratelimit-reset"));
      const retryAfter = Number(response.headers.get("retry-after"));
      const retryAt =
        Number.isFinite(reset) && reset > 0
          ? reset
          : Number.isFinite(retryAfter) && retryAfter > 0
            ? Math.floor(Date.now() / 1000) + retryAfter
            : undefined;
      throw new GitHubError(
        "rate-limit",
        "GitHub is limiting requests. Please try again later.",
        retryAt,
      );
    }
    throw new GitHubError(
      "unavailable",
      "GitHub could not load this data. Try again shortly.",
    );
  }
  if (!response.ok)
    throw new GitHubError(
      "unavailable",
      "GitHub could not load this data. Try again shortly.",
    );
  return response.json() as Promise<T>;
}

export function searchUsers(query: string, page = 1) {
  return githubRequest<SearchResult<GitHubUser>>(
    `/search/users?q=${encodeURIComponent(query)}&per_page=12&page=${page}`,
    60,
  );
}

export function searchRepos(query: string, page = 1) {
  return githubRequest<SearchResult<GitHubRepo>>(
    `/search/repositories?q=${encodeURIComponent(query)}&sort=best-match&per_page=12&page=${page}`,
    60,
  );
}

export function getUser(login: string) {
  return githubRequest<GitHubUser>(`/users/${encodeURIComponent(login)}`);
}

export function getUserRepos(login: string) {
  return githubRequest<GitHubRepo[]>(
    `/users/${encodeURIComponent(login)}/repos?sort=updated&per_page=6`,
  );
}

export function getRepo(owner: string, repo: string) {
  return githubRequest<GitHubRepo>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
  );
}

export function getRepoLanguages(owner: string, repo: string) {
  return githubRequest<Record<string, number>>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`,
    300,
  );
}

export function getRepoContributors(owner: string, repo: string) {
  return githubRequest<GitHubContributor[]>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contributors?per_page=8`,
    300,
  );
}

export function getRepoCommits(owner: string, repo: string) {
  return githubRequest<GitHubCommit[]>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?per_page=10`,
    180,
  );
}
