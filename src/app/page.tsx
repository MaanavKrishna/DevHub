import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  GitCompareArrows,
  GitFork,
  Search,
  Star,
  Users,
} from "lucide-react";
import { SearchBox } from "@/components/search-box";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span className="pulse-dot" /> THE OPEN SOURCE OBSERVATORY{" "}
              <span> / 01</span>
            </div>
            <h1>
              Good code has
              <br />
              <em>a story.</em>
              <span className="hero-asterisk">✳</span>
            </h1>
            <p>
              Find the people behind the projects. Follow the signals,
              understand the work, and save what deserves a closer look.
            </p>
            <SearchBox large />
            <div className="quick-searches">
              <span>START SOMEWHERE</span>
              <Link href="/search?type=repositories&q=typescript">
                TypeScript <ArrowUpRight size={13} />
              </Link>
              <Link href="/search?type=users&q=design">
                Designers <ArrowUpRight size={13} />
              </Link>
              <Link href="/search?type=repositories&q=developer+tools">
                Developer tools <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
          <div
            className="hero-visual"
            aria-label="Illustration of connected open source activity"
            role="img"
          >
            <div className="visual-grid" />
            <div className="visual-coordinate coordinate-top">
              38° 53′ 42″ N
            </div>
            <div className="visual-coordinate coordinate-side">
              OPEN SOURCE / IN MOTION
            </div>
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <div className="visual-orbit orbit-three" />
            <div className="visual-core">
              <span>✳</span>
            </div>
            <div className="orbit-point point-a">
              <Star size={16} />
              <span>discover</span>
            </div>
            <div className="orbit-point point-b">
              <GitFork size={16} />
              <span>understand</span>
            </div>
            <div className="orbit-point point-c">
              <Users size={16} />
              <span>connect</span>
            </div>
            <div className="visual-index">
              01 <span>/</span> ∞
            </div>
          </div>
        </div>
        <div className="hero-bottom shell">
          <span>EXPLORE THE ECOSYSTEM</span>
          <ArrowDownRight size={20} />
          <span>SCROLL TO DISCOVER</span>
        </div>
      </section>
      <section className="shell home-lower">
        <div className="section-heading">
          <div>
            <span className="section-rule">THE WORKFLOW / 02</span>
            <h2>
              From curious
              <br />
              to <em>informed.</em>
            </h2>
          </div>
          <p>
            Everything you need to make sense of the people and projects moving
            open source forward.
          </p>
        </div>
        <div className="feature-grid">
          <Link className="feature feature-primary" href="/search">
            <span className="feature-number">01 / DISCOVER</span>
            <Search size={30} />
            <div>
              <h3>
                Look beyond
                <br />
                the name.
              </h3>
              <p>
                Search repositories and developers with a clearer path to the
                details that matter.
              </p>
            </div>
            <ArrowUpRight className="feature-arrow" size={24} />
          </Link>
          <Link className="feature" href="/compare">
            <span className="feature-number">02 / COMPARE</span>
            <GitCompareArrows size={30} />
            <div>
              <h3>
                Put the work
                <br />
                side by side.
              </h3>
              <p>
                Compare projects or developers and see their numbers in context.
              </p>
            </div>
            <ArrowUpRight className="feature-arrow" size={24} />
          </Link>
          <Link className="feature" href="/dashboard">
            <span className="feature-number">03 / COLLECT</span>
            <Star size={30} />
            <div>
              <h3>
                Keep what
                <br />
                stands out.
              </h3>
              <p>
                Build your own shortlist of people and repositories worth
                revisiting.
              </p>
            </div>
            <ArrowUpRight className="feature-arrow" size={24} />
          </Link>
        </div>
        <div className="home-outro">
          <span>LESS SCROLLING. MORE SIGNAL.</span>
          <Link href="/search">
            Start exploring <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
