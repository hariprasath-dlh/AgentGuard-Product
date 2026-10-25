import { Link } from "@tanstack/react-router";
import { GovernanceVisual } from "@/components/site/GovernanceVisual";
import { Reveal } from "@/components/site/Reveal";

const SIX_GAP_SOLUTIONS = [
  {
    tag: "01",
    title: "Pre-dispatch governance",
    problem: "Most agent tooling looks at what happened after a tool already ran.",
    method: "AgentGuard intercepts the proposed tool call before it reaches the external service.",
    why: "There is a real decision point, not just a log entry after the fact.",
  },
  {
    tag: "02",
    title: "Policy and permission checks",
    problem: "An agent can call any tool it was given, whether or not its role should allow it.",
    method:
      "Each request is checked against agent roles (RBAC) and declared policy rules before anything executes.",
    why: "Agents only reach the tools and actions they are actually allowed to use.",
  },
  {
    tag: "03",
    title: "Risk and usage controls",
    problem:
      "A single misbehaving agent can rack up unexpected cost or call volume in minutes, with nothing stopping it.",
    method:
      "Every tool carries a risk level, and every agent has a budget and a rate limit enforced in real time before a call is allowed through.",
    why: "Runaway costs and request storms get stopped automatically, not discovered after the bill arrives.",
  },
  {
    tag: "04",
    title: "Human-in-the-loop approval",
    problem: "Some actions are too important to fully automate.",
    method:
      "High-risk actions are marked PENDING and wait for a person to approve or reject them before anything runs.",
    why: "People stay in control of the calls that actually matter.",
  },
  {
    tag: "05",
    title: "Auditability",
    problem:
      "When something goes wrong, it is hard to reconstruct why an agent acted the way it did, and a normal log can be quietly edited after the fact.",
    method:
      "Every decision is recorded as a cryptographically linked audit event, with the reason behind it, chained so that altering any past record breaks the chain and is immediately detectable.",
    why: "Reviewers can trace each action back to the exact rule that allowed or blocked it — and prove the record hasn't been altered, not just assume it hasn't.",
  },
  {
    tag: "06",
    title: "Developer integration",
    problem: "Governance gets skipped if it's painful to add to an existing agent.",
    method:
      "A lightweight Python SDK wraps a tool call in one line, so an existing agent can route through AgentGuard without a rewrite.",
    why: "Teams add real governance without re-architecting anything they've already built.",
  },
];

export function HomeSection({ onScrollToNext }: { onScrollToNext?: () => void }) {
  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <section className="border-b border-border grid-lines">
        <div className="container-ag grid gap-12 py-16 md:py-24 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <div>
            <p className="eyebrow">
              <span className="text-signal">●</span> RUNTIME GOVERNANCE FOR AI AGENTS
            </p>
            <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.2rem]">
              The agent
              <br />
              proposes.
              <br />
              <span className="font-display font-normal italic text-signal">AgentGuard</span>
              <br />
              decides.
            </h1>
            <p className="mt-6 max-w-md text-base text-muted-foreground md:text-lg">
              AgentGuard is a runtime governance layer that sits between an AI agent and the tools
              it's allowed to call. Before any tool call reaches a live system, it's checked against
              real permissions, policy, risk, and budget rules — and anything high-risk waits for a
              human to approve it first.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {onScrollToNext ? (
                <button
                  type="button"
                  onClick={onScrollToNext}
                  className="inline-flex min-h-12 items-center justify-center rounded bg-ink px-6 text-sm font-medium text-on-ink transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Explore How It Works ↓
                </button>
              ) : (
                <Link
                  to="/how-it-works"
                  className="inline-flex min-h-12 items-center justify-center rounded bg-ink px-6 text-sm font-medium text-on-ink transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Explore How It Works →
                </Link>
              )}
              <Link
                to="/getting-started"
                className="inline-flex min-h-12 items-center justify-center rounded border border-foreground/70 px-6 text-sm font-medium transition-colors hover:border-signal hover:text-signal"
              >
                Get Started
              </Link>
            </div>
          </div>
          <GovernanceVisual />
        </div>
      </section>

      {/* 2. The Gap in Existing Solutions */}
      <section className="border-b border-border">
        <div className="container-ag py-20 md:py-28">
          <Reveal>
            <p className="eyebrow">THE GAP</p>
            <h2 className="mt-5 max-w-3xl text-2xl font-normal leading-snug tracking-tight md:text-3xl">
              Most of today's AI agent tooling tells you what already happened. Almost none of it
              decides what's allowed to happen next.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Observability platforms like LangSmith and Langfuse are excellent at logging prompts,
              responses, and token usage — after the fact. Basic API gateways can rate-limit
              traffic, but they don't understand what an agent is actually trying to do. Neither can
              tell the difference between an agent reading a customer record and an agent about to
              delete one. And when something does go wrong, the audit trail is often just rows in a
              regular database — editable by anyone with admin access, which isn't good enough when
              a decision needs to be proven, not just logged.
            </p>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <div className="rounded border border-border bg-card p-5">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">No pre-dispatch control</span> —
                  tools execute first, get reviewed later, if ever.
                </p>
              </div>
              <div className="rounded border border-border bg-card p-5">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">No risk-aware governance</span> — a
                  LOW-risk lookup and a CRITICAL database deletion are treated the same way by a
                  generic rate limiter.
                </p>
              </div>
              <div className="rounded border border-border bg-card p-5">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">No tamper-evident record</span> — a
                  standard log table can be edited after the fact, which fails the basic bar for
                  anything that needs to hold up as evidence.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. Our Solution */}
      <section className="border-b border-border">
        <div className="container-ag py-20 md:py-28">
          <Reveal>
            <p className="eyebrow">OUR SOLUTION</p>
            <h2 className="mt-5 max-w-3xl text-2xl font-normal leading-snug tracking-tight md:text-3xl">
              AgentGuard moves the decision to before the action, not after it.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Every tool call an agent wants to make is sent to AgentGuard first. AgentGuard checks
              who the agent is, what it's allowed to do, what it's about to spend, and how risky the
              action is — and only then returns ALLOW, DENY, or PENDING. If a human needs to sign
              off, the agent pauses and waits for a real approval instead of guessing. Every single
              decision, whatever it is, is written to a cryptographic, tamper-evident record that
              can be independently verified later. This is the shift from &ldquo;we logged what the
              agent did&rdquo; to &ldquo;we controlled what the agent was allowed to do.&rdquo;
            </p>
          </Reveal>
        </div>
      </section>

      {/* 4. How We Filled the Gap */}
      <section className="container-ag py-20 md:py-28">
        <Reveal>
          <p className="eyebrow">HOW WE FILLED THE GAP</p>
          <h2 className="mt-5 max-w-3xl text-2xl font-normal leading-snug tracking-tight md:text-3xl">
            Six specific gaps in existing tooling, and exactly how AgentGuard closes each one.
          </h2>
        </Reveal>

        <div className="mt-16 border-t border-foreground/80">
          {SIX_GAP_SOLUTIONS.map((p, k) => (
            <Reveal key={p.tag} delay={k * 40}>
              <article className="group grid gap-4 border-b border-border py-8 md:grid-cols-[80px_1fr_2fr] md:gap-8">
                <span className="font-mono text-xs text-muted-foreground group-hover:text-signal">
                  {p.tag}
                </span>
                <h3 className="text-xl font-medium tracking-tight">{p.title}</h3>
                <dl className="grid gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="eyebrow">Problem</dt>
                    <dd className="mt-1.5 text-muted-foreground">{p.problem}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow">Method</dt>
                    <dd className="mt-1.5">{p.method}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow !text-signal">Why it matters</dt>
                    <dd className="mt-1.5 text-muted-foreground">{p.why}</dd>
                  </div>
                </dl>
              </article>
            </Reveal>
          ))}
        </div>

        {onScrollToNext && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={onScrollToNext}
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 font-mono text-xs text-muted-foreground transition-all hover:border-signal hover:text-foreground"
            >
              <span>Continue scroll to How It Works</span>
              <span className="text-signal transition-transform group-hover:translate-y-0.5">
                ↓
              </span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
