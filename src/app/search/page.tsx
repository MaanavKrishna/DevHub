import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  FolderGit2,
  Users,
} from "lucide-react";
import { SearchBox } from "@/components/search-box";
import { DeveloperCard, RepositoryCard } from "@/components/result-cards";
import { StatePanel } from "@/components/state-panel";
import {
  searchInput,
  searchRepos,
  searchUsers,
  type GitHubRepo,
  type GitHubUser,
  type SearchResult,
} from "@/lib/github";

export const metadata: Metadata = { title: "Explore GitHub" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
}) {
  const params = await searchParams;
  const type = params.type === "users" ? "users" : "repositories";
  const query = params.q?.trim() ?? "";
  const rawPage = params.page ?? "1";
  const page =
    Number.isInteger(Number(rawPage)) && Number(rawPage) > 0
      ? Math.min(Number(rawPage), 100)
      : 1;
  let result: SearchResult<GitHubUser> | SearchResult<GitHubRepo> | null = null;
  let error: unknown = null;
  if (query) {
    try {
      const input = searchInput(query, rawPage);
      result =
        type === "users"
          ? await searchUsers(input.query, input.page)
          : await searchRepos(input.query, input.page);
    } catch (caught) {
      error = caught;
    }
  }
  const pageUrl = (number: number) =>
    `/search?type=${type}&q=${encodeURIComponent(query)}&page=${number}`;
  const totalPages = result
    ? Math.min(Math.ceil(Math.min(result.total_count, 1000) / 12), 84)
    : 0;
  return (
    <div className="shell page-space">
      <div className="page-heading">
        <span className="eyebrow">
          <Compass size={16} /> Explore GitHub
        </span>
        <h1>Look closer at what matters.</h1>
        <p>Search the people and projects shaping open source.</p>
      </div>
      <div className="search-workspace">
        <div className="search-tabs" role="tablist" aria-label="Search type">
          <Link
            role="tab"
            aria-selected={type === "repositories"}
            className={
              type === "repositories" ? "search-tab active" : "search-tab"
            }
            href={`/search?type=repositories&q=${encodeURIComponent(query)}`}
          >
            <FolderGit2 size={18} /> Repositories
          </Link>
          <Link
            role="tab"
            aria-selected={type === "users"}
            className={type === "users" ? "search-tab active" : "search-tab"}
            href={`/search?type=users&q=${encodeURIComponent(query)}`}
          >
            <Users size={18} /> Developers
          </Link>
        </div>
        <SearchBox defaultValue={query} type={type} />
      </div>
      {!query ? (
        <StatePanel
          title="Your search starts here"
          description="Enter a name, technology, topic, or keyword to explore public GitHub results."
        />
      ) : error ? (
        <StatePanel error={error} href={pageUrl(page)} action="Try again" />
      ) : result && result.items.length === 0 ? (
        <StatePanel
          title="No results for this search"
          description="Try a broader term or switch between developers and repositories."
        />
      ) : (
        result && (
          <>
            <div className="results-heading">
              <div>
                <h2>{type === "users" ? "Developers" : "Repositories"}</h2>
                <p>
                  {new Intl.NumberFormat().format(result.total_count)} result
                  {result.total_count === 1 ? "" : "s"} for “{query}”
                  {result.incomplete_results
                    ? " · GitHub is still indexing some results"
                    : ""}
                </p>
              </div>
              <span className="results-page">
                Page {page} of {totalPages}
              </span>
            </div>
            <div
              className={`results-grid ${type === "users" ? "users-grid" : ""}`}
            >
              {type === "users"
                ? result.items.map((item) => (
                    <DeveloperCard user={item as GitHubUser} key={item.id} />
                  ))
                : result.items.map((item) => (
                    <RepositoryCard repo={item as GitHubRepo} key={item.id} />
                  ))}
            </div>
            <div className="pagination">
              {page > 1 && (
                <Link href={pageUrl(page - 1)}>
                  <ArrowLeft size={17} /> Previous
                </Link>
              )}
              {page < totalPages && (
                <Link href={pageUrl(page + 1)}>
                  Next page <ArrowRight size={17} />
                </Link>
              )}
            </div>
          </>
        )
      )}
    </div>
  );
}
