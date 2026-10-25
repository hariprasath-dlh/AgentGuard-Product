import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { NAV, LINKS } from "@/content/site";

export function Footer() {
  return (
    <footer className="bg-ink text-on-ink">
      <div className="container-ag grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo inverted />
          <p className="mt-4 max-w-xs text-sm text-on-ink-muted">
            Runtime governance for autonomous AI agents.
          </p>
        </div>
        <div>
          <p className="eyebrow !text-on-ink-muted">Pages</p>
          <ul className="mt-4 grid grid-cols-2 gap-y-2 text-sm md:grid-cols-1">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="text-on-ink/85 hover:text-signal">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow !text-on-ink-muted">Project</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href={LINKS.github}
                target="_blank"
                rel="noreferrer"
                className="text-on-ink/85 hover:text-signal"
              >
                GitHub ↗
              </a>
            </li>
            <li>
              <a
                href={LINKS.dashboard}
                target="_blank"
                rel="noreferrer"
                className="text-on-ink/85 hover:text-signal"
              >
                AgentGuard Dashboard ↗
              </a>
            </li>
            <li>
              <a
                href={`mailto:${LINKS.email}`}
                className="break-all text-on-ink/85 hover:text-signal"
              >
                {LINKS.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-line">
        <div className="container-ag flex flex-col gap-2 py-5 font-mono text-xs text-on-ink-muted sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} AgentGuard</span>
          <span>The agent proposes. AgentGuard decides.</span>
        </div>
      </div>
    </footer>
  );
}
