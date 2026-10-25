import { useEffect, useRef, useState } from "react";
import { Decision } from "@/components/site/Reveal";

const SUBTOPICS = [
  {
    n: "01",
    tag: "THE GOLDEN RULE",
    title: "The Golden Rule",
    lines: ["The Golden Rule"],
    body: "AgentGuard's entire design comes down to one sentence: the agent proposes, AgentGuard decides, and the tool only runs after AgentGuard says ALLOW. An agent never talks to a real tool directly. It sends its intended action to AgentGuard first, and AgentGuard is the only thing with the authority to let it through, block it, or pause it for a human. Nothing in this system lets an agent reason its own way around that gate.",
    badge: "GATEWAY LAW",
    accent: "ALLOW",
  },
  {
    n: "02",
    tag: "AGENTS, TOOLS, AND PERMISSIONS",
    title: "Agents, Tools, and Permissions",
    lines: ["Agents, Tools, and", "Permissions"],
    body: "Every AI agent that wants to use AgentGuard is registered as its own identity, with its own API key and its own organization. Every tool it might call — sending an email, reading a record, issuing a refund — is also registered separately, with a declared risk level. An agent can only use a tool if an explicit permission has been granted connecting that specific agent to that specific tool. No permission means no access, by default.",
    badge: "IDENTITY & RBAC",
    accent: "PERMISSION",
  },
  {
    n: "03",
    tag: "THE POLICY DECISION PIPELINE",
    title: "The Policy Decision Pipeline",
    lines: ["The Policy Decision", "Pipeline"],
    body: "Every single request runs through the same fixed sequence of checks, in this exact order: is the caller authenticated, is the agent active, does it have permission for this tool, is the tool enabled, is the action allowed, what's the tool's risk level, is there budget remaining, is the rate limit respected, does this require human approval, are the parameters safe, and does the request look suspicious. The first check that fails stops the request immediately — nothing downstream gets a chance to override an earlier denial.",
    badge: "DECISION SEQUENCE",
    accent: "PIPELINE",
  },
  {
    n: "04",
    tag: "RISK LEVELS AND WHY THEY MATTER",
    title: "Risk Levels and Why They Matter",
    lines: ["Risk Levels and", "Why They Matter"],
    body: "Every tool is assigned one of four risk levels — LOW, MEDIUM, HIGH, or CRITICAL — and that level drives the decision. A LOW-risk lookup can be approved automatically. A HIGH-risk action, like a large refund, always pauses for a human. A CRITICAL action, like deleting a database, is denied outright — even if the agent technically has permission for it. Risk level is never something an agent can talk its way around.",
    badge: "FOUR RISK TIERS",
    accent: "RISK ENGINE",
  },
  {
    n: "05",
    tag: "BUDGETS AND RATE LIMITS",
    title: "Budgets and Rate Limits",
    lines: ["Budgets and", "Rate Limits"],
    body: "Every agent has a configurable spending cap and a request-rate cap, enforced in real time through Redis. If an agent tries to exceed its budget or starts firing requests faster than its allowed rate, it gets blocked immediately — not after a bill arrives or a system gets overwhelmed. This is what stops a stuck or misbehaving agent from quietly running up thousands of calls in minutes.",
    badge: "REDIS ENFORCEMENT",
    accent: "RATE CAP",
  },
  {
    n: "06",
    tag: "THE PRE-DISPATCH GATEWAY",
    title: "The Pre-Dispatch Gateway",
    lines: ["The Pre-Dispatch", "Gateway"],
    body: "This is the single chokepoint every request passes through. The gateway runs the full decision pipeline, writes the outcome to the audit record first, and only then — if the decision was ALLOW — lets the actual tool execute. If the audit write itself fails for any reason, the tool never runs and the caller gets an error instead of a silent gap in the record. The order is never reversed.",
    badge: "AUDIT-FIRST CHOKEPOINT",
    accent: "ATOMIC GATE",
  },
  {
    n: "07",
    tag: "HUMAN-IN-THE-LOOP APPROVAL",
    title: "Human-in-the-Loop Approval",
    lines: ["Human-in-the-Loop", "Approval"],
    body: "When a request is marked PENDING, it doesn't disappear and it doesn't time out silently — it shows up in a real approval queue for a human with the right role to review. That person sees exactly what was requested, by which agent, and why it was flagged, then approves or denies it with a note. Only after approval does the original action actually run. Every pending request also has an expiration, so nothing waits forever unreviewed.",
    badge: "APPROVAL QUEUE",
    accent: "PENDING QUEUE",
  },
  {
    n: "08",
    tag: "THE CRYPTOGRAPHIC AUDIT VAULT",
    title: "The Cryptographic Audit Vault",
    lines: ["The Cryptographic", "Audit Vault"],
    body: "Every decision — allow, deny, or pending — is written to an append-only log where each entry's hash is built from the content of that entry plus the hash of the entry before it. That means altering any single past record breaks the chain from that point forward, and it's mathematically detectable. Anyone with the right role can trigger a full chain verification and get back a clear VALID or INVALID result, with the exact broken record identified if something was tampered with.",
    badge: "SHA-256 HASH CHAIN",
    accent: "TAMPER-EVIDENT",
  },
  {
    n: "09",
    tag: "ROLE-BASED ACCESS CONTROL",
    title: "Role-Based Access Control",
    lines: ["Role-Based Access", "Control"],
    body: "Every human user belongs to one of five roles — Admin, Security, Auditor, Manager, or Developer — and each role sees a different slice of the system. Security manages agents, tools, and policy. Managers review and approve pending requests. Auditors can verify the cryptographic chain but can't approve anything. Developers can register agents and tools but can't touch budgets or policy. No role can act outside what it's actually meant to do.",
    badge: "5 HUMAN ROLES",
    accent: "RBAC ENFORCED",
  },
  {
    n: "10",
    tag: "THE CONTROL PLANE DASHBOARD",
    title: "The Control Plane Dashboard",
    lines: ["The Control Plane", "Dashboard"],
    body: "Everything above is visible and operable from one web dashboard: live stats on today's decisions, a full agent and tool registry, policy and budget management, the human approval queue, and the audit vault with its chain-verification button. Nothing happens invisibly — every allow, deny, and pending decision shows up here in real time.",
    badge: "OPERATIONAL UI",
    accent: "REAL-TIME",
  },
  {
    n: "11",
    tag: "THE PYTHON SDK",
    title: "The Python SDK",
    lines: ["The Python SDK"],
    body: "Developers don't call AgentGuard's API by hand. A lightweight Python package wraps the whole interaction into a single method call that returns a clear result or raises a specific, catchable exception for denied, pending, or failed requests. Adding governance to an existing agent is a matter of wrapping its tool calls with the SDK — not rewriting how the agent itself works.",
    badge: "ONE-LINE WRAPPER",
    accent: "PYTHON 3.10+",
  },
  {
    n: "12",
    tag: "AUTHENTICATION AND ACCESS",
    title: "Authentication and Access",
    lines: ["Authentication and", "Access"],
    body: "Every person accessing the dashboard signs in with either an email and password or their Google account — both paths end in the same securely issued session. Agents authenticate separately, using their own API key rather than a human login, so an agent's access can be revoked independently of any person's account.",
    badge: "DUAL AUTH REALM",
    accent: "SECURE SESSIONS",
  },
  {
    n: "13",
    tag: "ORGANIZATION ISOLATION",
    title: "Organization Isolation",
    lines: ["Organization", "Isolation"],
    body: "Every agent, tool, policy, budget, and audit record belongs to exactly one organization, and no request can ever read or affect another organization's data — this is enforced at every single point data is accessed, not just at the login screen. Two completely separate teams can run AgentGuard against the same deployment and never see a trace of each other's activity.",
    badge: "MULTI-TENANT ENCLAVE",
    accent: "ZERO CROSS-TALK",
  },
];

function SplitLine({ text }: { text: string }) {
  const words = text.split(" ");
  let globalCharIdx = 0;

  return (
    <span className="ascent-line block">
      {words.map((word, wordIdx) => {
        const wordChars = Array.from(word);
        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap">
            {wordChars.map((char) => {
              const charIdx = globalCharIdx++;
              return (
                <span
                  key={charIdx}
                  className="ascent-char inline-block"
                  style={{
                    transitionDelay: `${charIdx * 38}ms`,
                  }}
                >
                  {char}
                </span>
              );
            })}
            {wordIdx < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        );
      })}
    </span>
  );
}

export function HowItWorksSection({ onScrollToNext }: { onScrollToNext?: () => void }) {
  const [active, setActive] = useState(0);
  const [isCardMode, setIsCardMode] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check for card mode (?card)
    const params = new URLSearchParams(window.location.search);
    const card = params.has("card");
    setIsCardMode(card);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Auto-reveal hero on mount
    setHeroVisible(true);

    if (reduceMotion) {
      // Mark all visible immediately
      sectionRefs.current.forEach((el) => {
        if (!el) return;
        el.classList.add("is-visible");
        const chars = el.querySelectorAll<HTMLElement>(".subtopic-char");
        chars.forEach((c) => {
          c.style.opacity = "1";
          c.style.transform = "none";
        });
      });
      return;
    }

    if (card) {
      // Card mode: loop section 1 reveal -> 1.8s hold -> instant reset -> 420ms pause
      let timer: ReturnType<typeof setTimeout>;
      const runCardLoop = () => {
        setHeroVisible(true);
        const firstEl = sectionRefs.current[0];
        if (firstEl) {
          firstEl.classList.add("is-visible");
          const chars = firstEl.querySelectorAll<HTMLElement>(".subtopic-char");
          chars.forEach((c) => {
            c.style.opacity = "1";
            c.style.transform = "none";
          });
        }

        timer = setTimeout(() => {
          if (firstEl) {
            firstEl.classList.remove("is-visible");
            firstEl.classList.add("card-reset");
            const chars = firstEl.querySelectorAll<HTMLElement>(".subtopic-char");
            chars.forEach((c) => {
              c.style.opacity = "0";
              c.style.transform = "translateX(48px) skewX(16deg)";
            });
          }
          setHeroVisible(false);

          timer = setTimeout(() => {
            if (firstEl) firstEl.classList.remove("card-reset");
            runCardLoop();
          }, 420);
        }, 1800);
      };

      runCardLoop();
      return () => clearTimeout(timer);
    }

    // Scroll-controlled smooth text reveal engine for all 13 subtopics
    const cards = sectionRefs.current.filter(Boolean) as HTMLElement[];
    if (cards.length === 0) return;

    // Cache character node lists per card to avoid querying during scroll
    const cardChars = cards.map((cardEl) =>
      Array.from(cardEl.querySelectorAll<HTMLElement>(".subtopic-char")),
    );

    const currentProgress = new Array(cards.length).fill(0);
    let rafId: number | null = null;
    let isRunning = false;

    const updateProgress = () => {
      const windowH = window.innerHeight;
      let needsNextFrame = false;

      cards.forEach((cardEl, idx) => {
        const chars = cardChars[idx];
        if (!chars || chars.length === 0) return;

        const rect = cardEl.getBoundingClientRect();
        // Reveal begins when the card enters at 88% of viewport height
        // Reveal finishes when the card reaches 42% of viewport height
        const startY = windowH * 0.88;
        const endY = windowH * 0.42;
        const rawP = (startY - rect.top) / (startY - endY);
        const targetP = Math.max(0, Math.min(1, rawP));

        // Smooth damping (lerp) to deliver silky scroll-coupled animation
        const diff = targetP - currentProgress[idx];
        if (Math.abs(diff) > 0.002) {
          currentProgress[idx] += diff * 0.22;
          needsNextFrame = true;
        } else {
          currentProgress[idx] = targetP;
        }

        const P = currentProgress[idx];
        const numChars = chars.length;
        const windowSpread = 0.22;

        chars.forEach((charEl, cIdx) => {
          const cStart = (cIdx / numChars) * (1 - windowSpread);
          const cEnd = cStart + windowSpread;

          let t = 0;
          if (P >= cEnd) {
            t = 1;
          } else if (P <= cStart) {
            t = 0;
          } else {
            t = (P - cStart) / (cEnd - cStart);
          }

          // Smoothstep curve for natural ease-in-out feel per character
          const eased = t * t * (3 - 2 * t);

          charEl.style.opacity = eased.toFixed(3);
          const tx = ((1 - eased) * 48).toFixed(1);
          const sk = ((1 - eased) * 16).toFixed(1);
          charEl.style.transform = `translateX(${tx}px) skewX(${sk}deg)`;
        });

        // Set active card based on central reading zone
        if (rect.top <= windowH * 0.7 && rect.bottom >= windowH * 0.35) {
          setActive(idx);
        }
      });

      if (needsNextFrame) {
        rafId = requestAnimationFrame(updateProgress);
      } else {
        isRunning = false;
      }
    };

    const handleScrollOrResize = () => {
      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(updateProgress);
      }
    };

    // Initialize positions on mount
    isRunning = true;
    rafId = requestAnimationFrame(updateProgress);

    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="ascent-editorial-wrapper w-full bg-background text-foreground">
      {/* Self-contained Ascent Mechanic styles in one injected style block */}
      <style>{`
        .ascent-char {
          display: inline-block;
          transform: translateX(56px) skewX(18deg);
          opacity: 0;
          transition: transform 0.58s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.46s ease-out;
          will-change: transform, opacity;
        }

        .is-visible .ascent-char,
        .hero-visible .ascent-char {
          transform: translateX(0) skewX(0);
          opacity: 1;
        }

        .card-reset .ascent-char {
          transition: none !important;
          transform: translateX(56px) skewX(18deg) !important;
          opacity: 0 !important;
        }

        .subtopic-char {
          display: inline-block;
          will-change: transform, opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .ascent-char,
          .subtopic-char {
            transform: none !important;
            opacity: 1 !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* Top Banner Tag */}
      <div className="border-b border-border bg-sand/30 py-4 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <span className="text-signal">02</span> / 06 — How It Works
      </div>

      {/* Page Intro Header (short, sits above all subtopics) */}
      <section
        className={`border-b border-border py-16 md:py-24 transition-opacity duration-500 ${heroVisible ? "hero-visible is-visible" : ""}`}
      >
        <div className="container-ag max-w-5xl">
          <p className="eyebrow text-signal tracking-[0.2em]">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-signal" />
            HOW IT WORKS
          </p>

          <h1 className="mt-6 text-3xl font-semibold leading-[1.12] tracking-tight sm:text-5xl md:text-6xl text-foreground">
            <SplitLine text="Every tool call passes through" />
            <span className="text-signal">
              <SplitLine text="thirteen real checkpoints" />
            </span>
            <SplitLine text="before anything is allowed to happen." />
          </h1>

          <p className="mt-8 max-w-3xl text-lg text-muted-foreground leading-relaxed md:text-xl">
            This page walks through exactly what AgentGuard checks, in what order, and what happens
            at every stage — from the moment an agent proposes an action to the moment it's recorded
            forever.
          </p>
        </div>
      </section>

      {/* Subtopics Main Section — Alternating Zig-Zag Flow */}
      <section className="container-ag max-w-6xl py-16 md:py-24">
        <div className="flex flex-col space-y-12 md:space-y-16">
          {SUBTOPICS.map((s, idx) => {
            if (isCardMode && idx > 0) return null;
            const isRight = idx % 2 === 0;

            return (
              <article
                key={s.n}
                data-idx={idx}
                ref={(el) => {
                  sectionRefs.current[idx] = el;
                }}
                className={`ascent-section relative w-full md:w-[85%] lg:w-[75%] ${
                  isRight ? "md:ml-auto md:mr-0" : "md:mr-auto md:ml-0"
                } rounded-xl border border-border bg-card p-6 md:p-10 shadow-sm transition-all duration-300 ${
                  active === idx ? "border-foreground/30 shadow-md ring-1 ring-border" : ""
                }`}
              >
                {/* Kicker & Number Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-signal font-mono text-xs font-semibold text-primary-foreground">
                      {s.n}
                    </span>
                    <p className="eyebrow text-xs tracking-wider text-muted-foreground">{s.tag}</p>
                  </div>
                  <span className="rounded border border-border bg-background px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {s.badge}
                  </span>
                </div>

                {/* Subtopic Headline with Smooth User Scroll Control */}
                <div className="mt-4">
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                    {s.lines.map((line, lIdx) => {
                      const words = line.split(" ");
                      return (
                        <span key={lIdx} className="block">
                          {words.map((word, wIdx) => (
                            <span key={wIdx} className="inline-block whitespace-nowrap">
                              {Array.from(word).map((char, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="subtopic-char inline-block will-change-transform"
                                  style={{
                                    transform: "translateX(48px) skewX(16deg)",
                                    opacity: 0,
                                  }}
                                >
                                  {char}
                                </span>
                              ))}
                              {wIdx < words.length - 1 && (
                                <span className="inline-block">&nbsp;</span>
                              )}
                            </span>
                          ))}
                        </span>
                      );
                    })}
                  </h2>
                </div>

                {/* Sub paragraph directly under subtopic without gap or line */}
                <p className="mt-2 text-base leading-relaxed text-muted-foreground md:text-lg">
                  {s.body}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Footer / Continue to Next Page */}
      {onScrollToNext && (
        <div className="border-t border-border bg-sand/20 py-10 text-center">
          <button
            type="button"
            onClick={onScrollToNext}
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-mono text-xs text-muted-foreground transition-all hover:border-signal hover:text-foreground hover:shadow-sm"
          >
            <span>Continue to Getting Started</span>
            <span className="text-signal transition-transform group-hover:translate-y-0.5">↓</span>
          </button>
        </div>
      )}
    </div>
  );
}
