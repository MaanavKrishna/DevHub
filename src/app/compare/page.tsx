import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, GitCompareArrows, Users } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { StatePanel } from "@/components/state-panel";
import {
  getRepo,
  getUser,
  type GitHubRepo,
  type GitHubUser,
} from "@/lib/github";

export const metadata: Metadata = {
  title: "Compare GitHub profiles and projects",
};

function CompareColumn({
  item,
  type,
}: {
  item: GitHubRepo | GitHubUser;
  type: "repositories" | "users";
}) {
  if (type === "users") {
    const user = item as GitHubUser;
    return (
      <div className="compare-column">
        <div className="compare-identity">
          <Avatar src={user.avatar_url} name={user.login} size={62} />
          <div>
            <span>Developer</span>
            <h2>{user.name || user.login}</h2>
            <p>@{user.login}</p>
          </div>
        </div>
        <p className="compare-description">{user.bio || "No bio provided."}</p>
        <div className="compare-metrics">
          <div>
            <span>Public repositories</span>
            <strong>{user.public_repos}</strong>
          </div>
          <div>
            <span>Followers</span>
            <strong>{user.followers}</strong>
          </div>
          <div>
            <span>Following</span>
            <strong>{user.following}</strong>
          </div>
          <div>
            <span>On GitHub since</span>
            <strong>{new Date(user.created_at).getFullYear()}</strong>
          </div>
        </div>
        <Link href={`/developers/${encodeURIComponent(user.login)}`}>
          View full profile <ArrowUpRight size={16} />
        </Link>
      </div>
    );
  }
  const repo = item as GitHubRepo;
  return (
    <div className="compare-column">
      <div className="compare-identity">
        <span className="compare-repo-icon">⌘</span>
        <div>
          <span>{repo.owner.login}</span>
          <h2>{repo.name}</h2>
          <p>{repo.language || "Multiple languages"}</p>
        </div>
      </div>
      <p className="compare-description">
        {repo.description || "No description provided."}
      </p>
      <div className="compare-metrics">
        <div>
          <span>Stars</span>
          <strong>{repo.stargazers_count.toLocaleString()}</strong>
        </div>
        <div>
          <span>Forks</span>
          <strong>{repo.forks_count.toLocaleString()}</strong>
        </div>
        <div>
          <span>Open issues</span>
          <strong>{repo.open_issues_count.toLocaleString()}</strong>
        </div>
        <div>
          <span>Subscribers</span>
          <strong>{repo.subscribers_count?.toLocaleString() ?? "—"}</strong>
        </div>
      </div>
      <Link
        href={`/repositories/${encodeURIComponent(repo.owner.login)}/${encodeURIComponent(repo.name)}`}
      >
        View repository <ArrowUpRight size={16} />
      </Link>
    </div>
  );
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; left?: string; right?: string }>;
}) {
  const params = await searchParams;
  const type = params.type === "users" ? "users" : "repositories";
  const left = params.left?.trim() ?? "";
  const right = params.right?.trim() ?? "";
  let pair: [GitHubRepo | GitHubUser, GitHubRepo | GitHubUser] | null = null;
  let error: unknown = null;
  if (left && right) {
    try {
      if (type === "users")
        pair = await Promise.all([getUser(left), getUser(right)]);
      else {
        const parse = (value: string) => {
          const parts = value.split("/");
          if (parts.length !== 2 || !parts[0] || !parts[1])
            throw new Error("Use owner/repository for each project.");
          return parts as [string, string];
        };
        const [a, b] = [parse(left), parse(right)];
        pair = await Promise.all([getRepo(...a), getRepo(...b)]);
      }
    } catch (caught) {
      error = caught;
    }
  }
  return (
    <div className="shell page-space compare-page">
      <div className="page-heading">
        <span className="eyebrow">
          <GitCompareArrows size={16} /> Side by side
        </span>
        <h1>See the difference.</h1>
        <p>
          Compare two developers or repositories using the numbers that matter.
        </p>
      </div>
      <div className="compare-tabs">
        <Link
          className={type === "repositories" ? "active" : ""}
          href="/compare?type=repositories"
        >
          Repositories
        </Link>
        <Link
          className={type === "users" ? "active" : ""}
          href="/compare?type=users"
        >
          <Users size={16} /> Developers
        </Link>
      </div>
      <form action="/compare" method="get" className="compare-form">
        <input type="hidden" name="type" value={type} />
        <label>
          First {type === "users" ? "username" : "repository"}
          <input
            name="left"
            defaultValue={left}
            required
            placeholder={type === "users" ? "octocat" : "facebook/react"}
          />
        </label>
        <span className="versus">vs</span>
        <label>
          Second {type === "users" ? "username" : "repository"}
          <input
            name="right"
            defaultValue={right}
            required
            placeholder={type === "users" ? "torvalds" : "vuejs/core"}
          />
        </label>
        <button className="button button-primary" type="submit">
          Compare <GitCompareArrows size={17} />
        </button>
      </form>
      {error ? (
        <StatePanel
          title="Comparison unavailable"
          description={
            error instanceof Error && error.message.startsWith("Use owner/")
              ? error.message
              : "Check both GitHub names and try again. GitHub may also be temporarily unavailable."
          }
        />
      ) : pair ? (
        <div className="compare-grid">
          <CompareColumn item={pair[0]} type={type} />
          <CompareColumn item={pair[1]} type={type} />
        </div>
      ) : (
        <div className="compare-prompt">
          <GitCompareArrows size={31} />
          <h2>Pick two to compare</h2>
          <p>
            {type === "users"
              ? "Enter two GitHub usernames to compare their public profiles."
              : "Enter two names in owner/repository format to compare project statistics."}
          </p>
        </div>
      )}
    </div>
  );
}
