import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Code2,
  GitCommitHorizontal,
  GitFork,
  Globe2,
  Scale,
} from "lucide-react";
import { Avatar } from "@/components/avatar";
import { FavoriteButton } from "@/components/favorite-button";
import { Stat } from "@/components/stat";
import { StatePanel } from "@/components/state-panel";
import { formatShare, languageShares } from "@/lib/analytics";
import {
  getRepo,
  getRepoCommits,
  getRepoContributors,
  getRepoLanguages,
} from "@/lib/github";
import { safeExternalUrl } from "@/lib/links";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}): Promise<Metadata> {
  const { owner, repo } = await params;
  return { title: `${owner}/${repo} — Repository` };
}

export default async function RepositoryPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await params;
  let repository: Awaited<ReturnType<typeof getRepo>>;
  try {
    repository = await getRepo(owner, repo);
  } catch (error) {
    return (
      <div className="shell page-space">
        <StatePanel error={error} href="/search" />
      </div>
    );
  }
  const [languages, contributors, commits] = await Promise.all([
    getRepoLanguages(owner, repo)
      .then(languageShares)
      .catch(() => null),
    getRepoContributors(owner, repo).catch(() => null),
    getRepoCommits(owner, repo).catch(() => null),
  ]);
  const homepageUrl = safeExternalUrl(repository.homepage);
  return (
    <div className="shell page-space detail-page">
      <Link className="back-link" href="/search">
        <ArrowLeft size={17} /> Back to repositories
      </Link>
      <div className="detail-hero repo-detail-hero">
        <div className="identity-row">
          <span className="repo-hero-icon">
            <Code2 size={32} />
          </span>
          <div className="identity-copy">
            <span className="identity-type">
              Public repository <span className="identity-separator">/</span>{" "}
              {repository.owner.login}
            </span>
            <h1>{repository.name}</h1>
            <p className="repo-hero-description">
              {repository.description || "No description provided."}
            </p>
          </div>
        </div>
        <div className="detail-actions">
          <FavoriteButton
            item={{
              kind: "repository",
              githubId: String(repository.id),
              slug: repository.full_name,
              title: repository.name,
              subtitle: repository.description,
              imageUrl: repository.owner.avatar_url,
            }}
          />
          <a
            className="button button-outline"
            href={repository.html_url}
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
      <div className="stat-strip">
        <Stat label="Stars" value={repository.stargazers_count} />
        <Stat label="Forks" value={repository.forks_count} />
        <Stat label="Open issues" value={repository.open_issues_count} />
        <Stat label="Subscribers" value={repository.subscribers_count ?? "—"} />
      </div>
      <div className="detail-grid">
        <div className="detail-main">
          <section className="content-section">
            <div className="section-topline">
              <div>
                <h2>Language distribution</h2>
                <p>Share of source bytes reported by GitHub</p>
              </div>
            </div>
            {languages === null ? (
              <div className="muted-panel">
                Language data is unavailable right now.
              </div>
            ) : languages.length ? (
              <>
                <div
                  className="language-bar"
                  role="img"
                  aria-label={languages
                    .map((item) => `${item.name} ${formatShare(item)}`)
                    .join(", ")}
                >
                  {languages.map((item, index) => (
                    <span
                      key={item.name}
                      style={{
                        width: `${formatShare(item)}`,
                        background: `var(--chart-${index % 6})`,
                      }}
                    />
                  ))}
                </div>
                <div className="language-list">
                  {languages.map((item, index) => (
                    <div key={item.name}>
                      <span
                        className="language-dot"
                        style={{ background: `var(--chart-${index % 6})` }}
                      />
                      <strong>{item.name}</strong>
                      <span>{formatShare(item)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="muted-panel">
                GitHub has no language data for this repository.
              </div>
            )}
          </section>
          <section className="content-section">
            <div className="section-topline">
              <div>
                <h2>Recent activity</h2>
                <p>Latest commits on the default branch</p>
              </div>
              <GitCommitHorizontal size={21} />
            </div>
            {commits === null ? (
              <div className="muted-panel">
                Commit activity is unavailable right now.
              </div>
            ) : commits.length ? (
              <div className="commit-list">
                {commits.map((item) => (
                  <a
                    key={item.sha}
                    href={item.html_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="commit-icon">
                      <GitCommitHorizontal size={17} />
                    </span>
                    <span className="commit-copy">
                      <strong>{item.commit.message.split("\n")[0]}</strong>
                      <small>
                        {item.author?.login ||
                          item.commit.author?.name ||
                          "Unknown author"}{" "}
                        ·{" "}
                        {item.commit.author?.date
                          ? new Date(
                              item.commit.author.date,
                            ).toLocaleDateString("en", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Date unavailable"}
                      </small>
                    </span>
                    <ArrowUpRight size={16} />
                  </a>
                ))}
              </div>
            ) : (
              <div className="muted-panel">
                No recent commits are available.
              </div>
            )}
          </section>
        </div>
        <aside className="detail-side">
          <div className="side-panel">
            <h2>Project details</h2>
            <div className="repo-facts">
              <span>
                <CalendarDays size={16} /> Created{" "}
                {new Date(repository.created_at).toLocaleDateString("en", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span>
                <GitFork size={16} /> Updated{" "}
                {new Date(repository.pushed_at).toLocaleDateString("en", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
              {repository.license && (
                <span>
                  <Scale size={16} /> {repository.license.name}
                </span>
              )}
              {homepageUrl && (
                <a href={homepageUrl} target="_blank" rel="noreferrer">
                  <Globe2 size={16} /> Project website{" "}
                  <ArrowUpRight size={14} />
                </a>
              )}
            </div>
            {repository.topics?.length > 0 && (
              <div className="topic-list">
                {repository.topics.slice(0, 8).map((topic) => (
                  <span key={topic}>{topic}</span>
                ))}
              </div>
            )}
          </div>
          <div className="side-panel contributors-panel">
            <div className="side-panel-title">
              <h2>Contributors</h2>
              <span>{contributors?.length ?? "—"}</span>
            </div>
            {contributors === null ? (
              <p className="aside-muted">Contributor data is unavailable.</p>
            ) : contributors.length ? (
              <div className="contributors-list">
                {contributors.map((person) => (
                  <a
                    href={person.html_url}
                    key={person.id}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Avatar
                      src={person.avatar_url}
                      name={person.login}
                      size={34}
                    />
                    <span>{person.login}</span>
                    <small>{person.contributions} commits</small>
                  </a>
                ))}
              </div>
            ) : (
              <p className="aside-muted">No contributors listed.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
