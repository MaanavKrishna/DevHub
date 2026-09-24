import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import "@/styles/home.css";
import "@/styles/discovery.css";
import "@/styles/details.css";
import "@/styles/account.css";
import "@/styles/compare.css";
import "@/styles/responsive.css";

export const metadata: Metadata = {
  title: {
    default: "DevHub — Explore what developers build",
    template: "%s | DevHub",
  },
  description:
    "Find GitHub developers and repositories, explore their activity, and keep a collection of your favourites.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <footer className="site-footer">
          <div className="shell footer-inner">
            <span>DevHub</span>
            <span>Built for curious developers. Data from GitHub.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
