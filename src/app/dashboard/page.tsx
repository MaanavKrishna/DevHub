import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowUpRight, Heart } from "lucide-react";
import { SavedGrid } from "@/components/saved-grid";
import { SignOutButton } from "@/components/sign-out-button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Your saved discoveries" };

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?next=/dashboard");
  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { savedAt: "desc" },
  });
  const developers = favorites
    .filter((item) => item.kind === "developer")
    .map((item) => ({ ...item, savedAt: item.savedAt.toISOString() }));
  const repositories = favorites
    .filter((item) => item.kind === "repository")
    .map((item) => ({ ...item, savedAt: item.savedAt.toISOString() }));
  return (
    <div className="shell page-space dashboard">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">
            <Heart size={16} /> Your workspace
          </span>
          <h1>Good to see you, {session.user.name.split(" ")[0]}.</h1>
          <p>Everything worth another look, all in one place.</p>
        </div>
        <SignOutButton />
      </div>
      <div className="dashboard-summary">
        <div>
          <strong>{favorites.length}</strong>
          <span>Saved discoveries</span>
        </div>
        <div>
          <strong>{developers.length}</strong>
          <span>Developers</span>
        </div>
        <div>
          <strong>{repositories.length}</strong>
          <span>Repositories</span>
        </div>
        <Link href="/search">
          Find more <ArrowUpRight size={17} />
        </Link>
      </div>
      <section className="dashboard-section">
        <div className="section-topline">
          <div>
            <h2>Developers</h2>
            <p>People you want to keep up with</p>
          </div>
        </div>
        <SavedGrid initialItems={developers} kind="developer" />
      </section>
      <section className="dashboard-section">
        <div className="section-topline">
          <div>
            <h2>Repositories</h2>
            <p>Projects you want to explore further</p>
          </div>
        </div>
        <SavedGrid initialItems={repositories} kind="repository" />
      </section>
    </div>
  );
}
