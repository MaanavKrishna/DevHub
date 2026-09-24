"use client";
import { Heart, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

type Item = {
  kind: "developer" | "repository";
  githubId: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
};

export function FavoriteButton({ item }: { item: Item }) {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session) return;
    let active = true;
    fetch("/api/favorites")
      .then((response) => response.json())
      .then((data) => {
        if (active)
          setSaved(
            (data.favorites ?? []).some(
              (favorite: Item) =>
                favorite.kind === item.kind &&
                favorite.githubId === item.githubId,
            ),
          );
      })
      .catch(() => {
        if (active) setError("Saved status is unavailable.");
      });
    return () => {
      active = false;
    };
  }, [session, item.kind, item.githubId]);

  async function toggle() {
    if (!session) {
      router.push(
        `/login?next=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/favorites", {
        method: saved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          saved ? { kind: item.kind, githubId: item.githubId } : item,
        ),
      });
      if (!response.ok) throw new Error("Could not update your saved items.");
      setSaved(!saved);
      router.refresh();
    } catch {
      setError("Could not update your saved items. Try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="favorite-control">
      <button
        type="button"
        className={`button favorite-button ${saved ? "is-saved" : ""}`}
        onClick={toggle}
        disabled={busy || sessionPending}
        aria-pressed={saved}
      >
        {busy ? (
          <LoaderCircle size={17} className="spin" />
        ) : (
          <Heart size={17} fill={saved ? "currentColor" : "none"} />
        )}
        {saved ? "Saved" : "Save"}
      </button>
      {error && (
        <span className="inline-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
