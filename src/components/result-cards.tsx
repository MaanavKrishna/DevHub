import Link from "next/link";
import { ArrowUpRight, Code2, GitFork, Star } from "lucide-react";
import { Avatar } from "./avatar";
import type { GitHubRepo, GitHubUser } from "@/lib/github";

export function DeveloperCard({ user }: { user: GitHubUser }) {
  return (
    <Link
      className="result-card developer-card"
      href={`/developers/${encodeURIComponent(user.login)}`}
    >
      <Avatar src={user.avatar_url} name={user.login} />
      <div className="result-main">
        <h3>{user.login}</h3>
        <p>Explore profile and public work</p>
      </div>
      <span className="card-arrow">
        <ArrowUpRight size={18} />
      </span>
    </Link>
  );
}

export function RepositoryCard({ repo }: { repo: GitHubRepo }) {
  return (
    <Link
      className="result-card repository-card"
      href={`/repositories/${encodeURIComponent(repo.owner.login)}/${encodeURIComponent(repo.name)}`}
    >
      <div className="repo-card-heading">
        <span className="repo-icon">
          <Code2 size={20} />
        </span>
        <div>
          <span className="repo-owner">{repo.owner.login}</span>
          <h3>{repo.name}</h3>
        </div>
        <span className="card-arrow">
          <ArrowUpRight size={18} />
        </span>
      </div>
      <p className="repo-description">
        {repo.description || "No description provided."}
      </p>
      <div className="repo-card-meta">
        <span>
          <Star size={15} />{" "}
          {new Intl.NumberFormat("en", { notation: "compact" }).format(
            repo.stargazers_count,
          )}
        </span>
        <span>
          <GitFork size={15} />{" "}
          {new Intl.NumberFormat("en", { notation: "compact" }).format(
            repo.forks_count,
          )}
        </span>
        {repo.language && (
          <span className="language-pill">
            <i />
            {repo.language}
          </span>
        )}
      </div>
    </Link>
  );
}
