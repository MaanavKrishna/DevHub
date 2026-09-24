"use client";
import Link from "next/link";
import { ArrowUpRight, Heart, Trash2 } from "lucide-react";
import { useState } from "react";

export type SavedItem = {
  id: string;
  kind: string;
  githubId: string;
  slug: string;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  savedAt: string;
};

export function SavedGrid({
  initialItems,
  kind,
}: {
  initialItems: SavedItem[];
  kind: "developer" | "repository";
}) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState("");
  async function remove(item: SavedItem) {
    setError("");
    const response = await fetch("/api/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: item.kind, githubId: item.githubId }),
    }).catch(() => null);
    if (!response?.ok) {
      setError("Could not remove that item. Try again.");
      return;
    }
    setItems((current) => current.filter((entry) => entry.id !== item.id));
  }
  return (
    <>
      {error && (
        <p className="inline-error" role="alert">
          {error}
        </p>
      )}
      {items.length ? (
        <div className="saved-grid">
          {items.map((item) => {
            const href =
              kind === "developer"
                ? `/developers/${encodeURIComponent(item.slug)}`
                : `/repositories/${item.slug.split("/").map(encodeURIComponent).join("/")}`;
            return (
              <div className="saved-card" key={item.id}>
                <div className="saved-card-top">
                  <span className="saved-kind">
                    {kind === "developer" ? "Developer" : "Repository"}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${item.title} from saved`}
                    onClick={() => remove(item)}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
                <Link href={href}>
                  <h3>{item.title}</h3>
                  <p>{item.subtitle || item.slug}</p>
                  <span>
                    View details <ArrowUpRight size={15} />
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-saved">
          <Heart size={24} />
          <p>
            No saved {kind === "developer" ? "developers" : "repositories"} yet.
          </p>
          <Link
            href={`/search?type=${kind === "developer" ? "users" : "repositories"}`}
          >
            Explore {kind === "developer" ? "developers" : "repositories"}
          </Link>
        </div>
      )}
    </>
  );
}
