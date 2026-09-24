"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Command,
  GitCompareArrows,
  Heart,
  Menu,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const links = [
  { href: "/search", label: "Explore", icon: Search },
  { href: "/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/dashboard", label: "Saved", icon: Heart },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session } = authClient.useSession();
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <div className="shell nav-inner">
          <Link href="/" className="brand" aria-label="DevHub home">
            <span className="brand-mark">
              <Command size={21} strokeWidth={2.3} />
            </span>
            <span>
              devhub<span className="brand-dot">.</span>
            </span>
          </Link>
          <nav
            className={`main-nav ${open ? "is-open" : ""}`}
            aria-label="Main navigation"
          >
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                onClick={() => setOpen(false)}
                className={
                  pathname?.startsWith(href) ? "nav-link active" : "nav-link"
                }
                href={href}
                key={href}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            {session ? (
              <Link className="account-link" href="/dashboard">
                <span className="account-avatar">
                  {session.user.name.charAt(0).toUpperCase()}
                </span>
                <span className="account-name">{session.user.name}</span>
              </Link>
            ) : (
              <Link className="button button-small button-dark" href="/login">
                Sign in <ArrowUpRight size={15} />
              </Link>
            )}
          </div>
          <button
            className="mobile-menu"
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>
    </>
  );
}
