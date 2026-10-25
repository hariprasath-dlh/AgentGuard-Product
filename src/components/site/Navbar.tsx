import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { NAV, LINKS } from "@/content/site";

const SECTION_MAP: Record<string, string> = {
  "/": "home",
  "/how-it-works": "how-it-works",
  "/getting-started": "getting-started",
  "/sdk-setup": "sdk-setup",
  "/integration": "integration",
  "/faq": "faq",
};

function scrollToTarget(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const headerOffset = 64;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [path]);

  // Track active section on the continuous scroll home page
  useEffect(() => {
    if (typeof window === "undefined" || path !== "/") return;

    const sections = Object.values(SECTION_MAP);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [path]);

  const handleNavClick = (to: string, e: React.MouseEvent) => {
    const sectionId = SECTION_MAP[to];
    if (path === "/" && sectionId) {
      e.preventDefault();
      scrollToTarget(sectionId);
      setActiveSection(sectionId);
      setOpen(false);
      window.history.replaceState(null, "", `#${sectionId}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="container-ag flex h-16 items-center justify-between">
        <div
          onClick={(e) => {
            if (path === "/") {
              e.preventDefault();
              scrollToTarget("home");
            }
          }}
          className="cursor-pointer"
        >
          <Logo />
        </div>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((n) => {
            const sectionId = SECTION_MAP[n.to];
            const active = path === "/" ? activeSection === sectionId : path === n.to;
            const targetHref = path === "/" ? `#${sectionId}` : n.to;

            return (
              <a
                key={n.to}
                href={targetHref}
                onClick={(e) => handleNavClick(n.to, e)}
                className={`relative rounded px-3 py-2 text-sm transition-colors ${active ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
              >
                {n.label}
                {active && <span className="absolute inset-x-3 -bottom-[13px] h-[2px] bg-signal" />}
              </a>
            );
          })}
        </nav>
        <a
          href={LINKS.github}
          target="_blank"
          rel="noreferrer"
          className="hidden rounded border border-foreground/80 px-3.5 py-1.5 font-mono text-xs text-foreground transition-colors hover:bg-ink hover:text-on-ink lg:inline-block"
        >
          GitHub ↗
        </a>
        <button
          className="flex h-11 w-11 items-center justify-center rounded border border-border lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 h-[1.5px] w-5 bg-foreground transition-transform ${open ? "top-1.5 rotate-45" : "top-0"}`}
            />
            <span
              className={`absolute left-0 h-[1.5px] w-5 bg-foreground transition-transform ${open ? "top-1.5 -rotate-45" : "top-3"}`}
            />
          </span>
        </button>
      </div>
      {open && (
        <nav
          className="page-enter border-t border-border bg-background lg:hidden"
          aria-label="Mobile"
        >
          <div className="container-ag flex flex-col py-3">
            {NAV.map((n) => {
              const sectionId = SECTION_MAP[n.to];
              const active = path === "/" ? activeSection === sectionId : path === n.to;
              const targetHref = path === "/" ? `#${sectionId}` : n.to;

              return (
                <a
                  key={n.to}
                  href={targetHref}
                  onClick={(e) => handleNavClick(n.to, e)}
                  className={`flex min-h-12 items-center justify-between border-b border-border/70 text-base ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}
                >
                  {n.label}
                  {active && <span className="h-2 w-2 rounded-full bg-signal" />}
                </a>
              );
            })}
            <a
              href={LINKS.github}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-12 items-center font-mono text-sm"
            >
              GitHub ↗
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
