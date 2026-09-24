import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  CalendarDays,
  Link2,
  MapPin,
} from "lucide-react";
import { Avatar } from "@/components/avatar";
import { FavoriteButton } from "@/components/favorite-button";
import { RepositoryCard } from "@/components/result-cards";
import { Stat } from "@/components/stat";
import { StatePanel } from "@/components/state-panel";
import { getUser, getUserRepos } from "@/lib/github";
import { safeExternalUrl } from "@/lib/links";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ login: string }>;
}): Promise<Metadata> {
  const { login } = await params;
  return { title: `${login} — Developer` };
}

export default async function DeveloperPage({
  params,
}: {
  params: Promise<{ login: string }>;
}) {
  const { login } = await params;
  let user: Awaited<ReturnType<typeof getUser>>;
  try {
    user = await getUser(login);
  } catch (error) {
    return (
      <div className="shell page-space">
        <StatePanel error={error} href="/search?type=users" />
      </div>
    );
  }
  const repos = await getUserRepos(login).catch(() => null);
  const blogHref = safeExternalUrl(user.blog);
  return (
    <div className="shell page-space detail-page">
      <Link className="back-link" href="/search?type=users">
        <ArrowLeft size={17} /> Back to developers
      </Link>
      <div className="detail-hero">
        <div className="identity-row">
          <Avatar src={user.avatar_url} name={user.login} size={104} />
          <div className="identity-copy">
            <span className="identity-type">Developer profile</span>
            <h1>{user.name || user.login}</h1>
            <p className="identity-handle">@{user.login}</p>
          </div>
        </div>
        <div className="detail-actions">
          <FavoriteButton
            item={{
              kind: "developer",
              githubId: String(user.id),
              slug: user.login,
              title: user.name || user.login,
              subtitle: user.bio,
              imageUrl: user.avatar_url,
            }}
          />
          <a
            className="button button-outline"
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
      <div className="detail-grid">
        <section className="detail-main">
          <div className="intro-block">
            <h2>About {user.name || user.login}</h2>
            <p>{user.bio || "This developer has not added a bio yet."}</p>
            <div className="profile-facts">
              {user.location && (
                <span>
                  <MapPin size={16} />
                  {user.location}
                </span>
              )}
              {user.company && (
                <span>
                  <Building2 size={16} />
                  {user.company}
                </span>
              )}
              {blogHref && (
                <a href={blogHref} target="_blank" rel="noreferrer">
                  <Link2 size={16} />
                  Website <ArrowUpRight size={14} />
                </a>
              )}
              <span>
                <CalendarDays size={16} />
                Joined{" "}
                {new Date(user.created_at).toLocaleDateString("en", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="section-topline">
            <div>
              <h2>Public repositories</h2>
              <p>Recently updated work from this developer</p>
            </div>
            <a
              href={`${user.html_url}?tab=repositories`}
              target="_blank"
              rel="noreferrer"
            >
              All on GitHub <ArrowUpRight size={15} />
            </a>
          </div>
          {repos === null ? (
            <div className="muted-panel">
              Repositories are unavailable right now.
            </div>
          ) : repos.length ? (
            <div className="results-grid detail-repos">
              {repos.map((repo) => (
                <RepositoryCard repo={repo} key={repo.id} />
              ))}
            </div>
          ) : (
            <div className="muted-panel">No public repositories yet.</div>
          )}
        </section>
        <aside className="detail-side">
          <div className="side-panel">
            <h2>At a glance</h2>
            <div className="side-stats">
              <Stat label="Public repositories" value={user.public_repos} />
              <Stat label="Followers" value={user.followers} />
              <Stat label="Following" value={user.following} />
            </div>
          </div>
          <div className="side-note">
            <span className="note-symbol">✳</span>
            <p>
              GitHub data updates as the developer&apos;s profile changes. Save
              this profile to find it again.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
