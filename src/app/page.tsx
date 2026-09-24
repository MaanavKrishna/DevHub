import Link from "next/link";
import {
  ArrowRight,
  Code2,
  GitFork,
  Radar,
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
              <span className="pulse-dot" /> A clearer view of open source
            </div>
            <h1>
              Find the people.
              <br />
              <span>Follow the work.</span>
            </h1>
            <p>
              Search GitHub developers and repositories, explore the signals
              behind the code, and keep the discoveries worth coming back to.
            </p>
            <SearchBox large />
            <div className="quick-searches">
              <span>Try a search</span>
              <Link href="/search?type=repositories&q=typescript">
                TypeScript
              </Link>
              <Link href="/search?type=users&q=design">Designers</Link>
              <Link href="/search?type=repositories&q=machine+learning">
                Machine learning
              </Link>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <div className="visual-axis axis-x" />
            <div className="visual-axis axis-y" />
            <div className="visual-main">
              <div className="visual-top">
                <span className="visual-badge">
                  <Code2 size={18} />
                </span>
                <span>Explore the ecosystem</span>
                <span className="visual-live">
                  <span /> Live
                </span>
              </div>
              <div className="visual-graph">
                <span className="graph-line graph-line-a" />
                <span className="graph-line graph-line-b" />
                <span className="graph-line graph-line-c" />
                <i className="node node-a" />
                <i className="node node-b" />
                <i className="node node-c" />
                <i className="node node-d" />
                <i className="node node-e" />
              </div>
              <div className="visual-bottom">
                <span>
                  <Star size={15} /> Discover
                </span>
                <span>
                  <GitFork size={15} /> Understand
                </span>
                <span>
                  <Users size={15} /> Connect
                </span>
              </div>
            </div>
            <div className="floating-tag tag-one">
              <Radar size={17} /> Signals in focus
            </div>
            <div className="floating-tag tag-two">
              <span className="tiny-dot" /> Public GitHub data
            </div>
          </div>
        </div>
      </section>
      <section className="shell home-lower">
        <div className="section-heading">
          <div>
            <span className="section-rule" />
            <h2>Go from curious to informed.</h2>
          </div>
          <p>
            One place for the context you need before you star, follow, or
            contribute.
          </p>
        </div>
        <div className="feature-grid">
          <div className="feature">
            <span className="feature-icon blue">
              <Search size={22} />
            </span>
            <h3>Search with intent</h3>
            <p>
              Find developers and repositories by what you care about, then go
              straight to the details.
            </p>
          </div>
          <div className="feature">
            <span className="feature-icon teal">
              <Radar size={22} />
            </span>
            <h3>See the whole picture</h3>
            <p>
              Read activity, contributors, and language mix alongside the
              familiar GitHub numbers.
            </p>
          </div>
          <div className="feature">
            <span className="feature-icon coral">
              <Star size={22} />
            </span>
            <h3>Keep your shortlist</h3>
            <p>
              Save the people and projects you want to watch in one personal
              workspace.
            </p>
          </div>
        </div>
        <Link className="text-link" href="/search">
          Start exploring <ArrowRight size={18} />
        </Link>
      </section>
    </>
  );
}
