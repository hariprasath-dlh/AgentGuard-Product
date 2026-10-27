import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ShieldAlert,
  Gauge,
  FileLock2,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ArrowDown,
  ShieldCheck,
  Terminal,
  Activity,
  Layers,
  Lock,
} from "lucide-react";
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

type DecisionTab = "ALLOW" | "DENY" | "PENDING";

export function HomeSection({ onScrollToNext }: { onScrollToNext?: () => void }) {
  const [selectedDecision, setSelectedDecision] = useState<DecisionTab>("PENDING");

  const decisionDetails: Record<
    DecisionTab,
    {
      tool: string;
      args: string;
      risk: string;
      statusText: string;
      badgeColor: string;
      ruleReason: string;
      actionEffect: string;
      auditPayload: string;
    }
  > = {
    ALLOW: {
      tool: "read_customer_record",
      args: '{"customer_id": "cust_8829", "fields": ["profile", "plan"]}',
      risk: "LOW RISK",
      statusText: "ALLOWED — DISPATCHED",
      badgeColor: "border-allow text-allow bg-allow/10",
      ruleReason: "Role 'support_agent' matches declared policy: read_customer_record allowed under $0.05 budget.",
      actionEffect: "Call executes immediately against external upstream API without human delay.",
      auditPayload: "SHA256: e8b941...c4a1 · Verified against Merkle tree",
    },
    DENY: {
      tool: "database.drop_table",
      args: '{"table": "production_users", "cascade": true}',
      risk: "CRITICAL RISK",
      statusText: "DENIED — BLOCKED PRE-DISPATCH",
      badgeColor: "border-deny text-deny bg-deny/10",
      ruleReason: "Blocked by GuardPolicy #09: Destructive schema mutations strictly prohibited for all agents.",
      actionEffect: "Pre-dispatch execution halted. Upstream Postgres connection never touched. Agent notified with reason code.",
      auditPayload: "SHA256: 7f310a...d82e · Incident flagged to SecOps",
    },
    PENDING: {
      tool: "stripe.send_payment",
      args: '{"amount_usd": 4500, "recipient_id": "acct_9941"}',
      risk: "HIGH RISK",
      statusText: "PENDING — AWAITING HUMAN APPROVAL",
      badgeColor: "border-pending text-pending bg-pending/10",
      ruleReason: "Rule financial_guard_v2: Outbound payments > $1,000 require dual-signature human authorization.",
      actionEffect: "Agent pauses execution cleanly. Webhook dispatched to Slack/Dashboard. Resumes upon operator click.",
      auditPayload: "SHA256: 3c9b74...109f · Pending approval ticket #H-441",
    },
  };

  const activeData = decisionDetails[selectedDecision];

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <section className="relative border-b border-border grid-lines overflow-hidden">
        {/* Subtle radial ambient gradient strictly within palette */}
        <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-signal/5 blur-3xl" />

        <div className="container-ag grid min-h-[90dvh] gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div className="flex flex-col justify-center">
            {/* Live Status Eyebrow */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/80 px-3.5 py-1.5 backdrop-blur-sm self-start">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
              </span>
              <span className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                Runtime Governance For AI Agents
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-7 text-4xl sm:text-6xl md:text-[4.25rem] lg:text-[5rem] xl:text-[5.75rem] 2xl:text-[6.25rem] font-medium leading-[0.96] tracking-tight">
              The agent
              <br />
              proposes.
              <br />
              <span className="font-display font-normal italic text-signal">AgentGuard</span>
              <br />
              decides.
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg leading-relaxed">
              AgentGuard is a runtime governance layer that sits between an AI agent and the tools
              it's allowed to call. Before any tool call reaches a live system, it's checked against
              real permissions, policy, risk, and budget rules — and anything high-risk waits for a
              human to approve it first.
            </p>

            {/* Primary Action Row */}
            <div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              {onScrollToNext ? (
                <button
                  type="button"
                  onClick={onScrollToNext}
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded bg-ink px-7 text-sm font-medium text-on-ink shadow-sm transition-all hover:-translate-y-0.5 hover:shadow active:translate-y-0"
                >
                  <span>Explore How It Works</span>
                  <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                </button>
              ) : (
                <Link
                  to="/how-it-works"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded bg-ink px-7 text-sm font-medium text-on-ink shadow-sm transition-all hover:-translate-y-0.5 hover:shadow active:translate-y-0"
                >
                  <span>Explore How It Works</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
              <Link
                to="/getting-started"
                className="inline-flex min-h-12 items-center justify-center rounded border border-foreground/30 bg-background/50 px-6 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:border-signal hover:text-signal hover:-translate-y-0.5 active:translate-y-0"
              >
                Get Started
              </Link>
            </div>

            {/* Hero Quick Telemetry Stats */}
            <div className="mt-12 grid grid-cols-3 gap-3 border-t border-border pt-6 sm:gap-6">
              <div>
                <p className="font-mono text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                  100%
                </p>
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">
                  Pre-Dispatch
                </p>
              </div>
              <div className="border-l border-border pl-3 sm:pl-6">
                <p className="font-mono text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                  &lt; 1.2ms
                </p>
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">
                  Eval Latency
                </p>
              </div>
              <div className="border-l border-border pl-3 sm:pl-6">
                <p className="font-mono text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                  SHA-256
                </p>
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">
                  Chained Audit
                </p>
              </div>
            </div>
          </div>

          {/* Premium Product Telemetry Showcase (Replaces Old Diagram) */}
          <div className="relative w-full">
            <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5 sm:p-7 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)] backdrop-blur-sm">
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-on-ink">
                    <Terminal className="h-3.5 w-3.5 text-signal" />
                  </div>
                  <div>
                    <p className="font-mono text-xs font-semibold tracking-tight text-foreground">
                      AGENTGUARD RUNTIME
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      v1.4.2 · ACTIVE INSPECTOR
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                  <span>0 BYPASSES</span>
                </div>
              </div>

              {/* Real-time Policy Evaluation Stream */}
              <div className="mt-5 space-y-3">
                <p className="eyebrow !text-[10px]">LIVE PRE-DISPATCH DECISION PIPELINE</p>

                {/* Event 1: Pending */}
                <div className="group rounded-lg border border-border bg-background/80 p-3.5 transition-colors hover:border-pending/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-pending shrink-0" />
                      <span className="font-mono text-xs font-medium text-foreground">
                        stripe.send_payment($4,500)
                      </span>
                    </div>
                    <span className="rounded border border-pending/40 bg-pending/10 px-2 py-0.5 font-mono text-[10px] font-medium text-pending">
                      PENDING
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Action requires dual-operator sign-off before dispatching to banking network.
                  </p>
                </div>

                {/* Event 2: Deny */}
                <div className="group rounded-lg border border-border bg-background/80 p-3.5 transition-colors hover:border-deny/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-3.5 w-3.5 text-deny shrink-0" />
                      <span className="font-mono text-xs font-medium text-foreground">
                        postgres.drop_table("users")
                      </span>
                    </div>
                    <span className="rounded border border-deny/40 bg-deny/10 px-2 py-0.5 font-mono text-[10px] font-medium text-deny">
                      BLOCKED
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Denied by policy #09: Destructive database alterations strictly forbidden.
                  </p>
                </div>

                {/* Event 3: Allow */}
                <div className="group rounded-lg border border-border bg-background/80 p-3.5 transition-colors hover:border-allow/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-allow shrink-0" />
                      <span className="font-mono text-xs font-medium text-foreground">
                        zendesk.read_ticket(id="8821")
                      </span>
                    </div>
                    <span className="rounded border border-border bg-card px-2 py-0.5 font-mono text-[10px] font-medium text-foreground">
                      ALLOW
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    RBAC verified: Support tier granted read-only scope. Executed in 0.8ms.
                  </p>
                </div>
              </div>

              {/* Cryptographic Proof Seal */}
              <div className="mt-5 flex items-center justify-between rounded border border-ink-line bg-ink px-3.5 py-2.5 font-mono text-[11px] text-on-ink-muted">
                <div className="flex items-center gap-2">
                  <Lock className="h-3 w-3 text-signal" />
                  <span>Merkle Root: 0x8f2c...4e1a</span>
                </div>
                <span className="text-[10px] text-signal font-medium">TAMPER-PROOF</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Gap in Existing Solutions */}
      <section className="border-b border-border bg-[#FAF8F4]/50">
        <div className="container-ag py-20 sm:py-24 md:py-28">
          <Reveal>
            <div className="max-w-3xl">
              <p className="eyebrow">
                <span className="text-signal">●</span> THE GAP
              </p>
              <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-normal leading-snug tracking-tight text-foreground">
                Most of today's AI agent tooling tells you what already happened. Almost none of it
                decides what's allowed to happen next.
              </h2>
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
                Observability platforms like LangSmith and Langfuse are excellent at logging prompts,
                responses, and token usage — after the fact. Basic API gateways can rate-limit
                traffic, but they don't understand what an agent is actually trying to do. Neither can
                tell the difference between an agent reading a customer record and an agent about to
                delete one. And when something does go wrong, the audit trail is often just rows in a
                regular database — editable by anyone with admin access, which isn't good enough when
                a decision needs to be proven, not just logged.
              </p>
            </div>
          </Reveal>

          {/* 3 Asymmetric Gap Bento Cards */}
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal delay={60}>
              <div className="group flex h-full flex-col justify-between rounded-xl border border-border bg-card p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-md">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-signal">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-medium tracking-tight text-foreground">
                    No pre-dispatch control
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    tools execute first, get reviewed later, if ever.
                  </p>
                </div>
                <div className="mt-6 border-t border-border/80 pt-4 font-mono text-[11px] text-muted-foreground group-hover:text-foreground">
                  Post-Facto Logging ≠ Prevention
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="group flex h-full flex-col justify-between rounded-xl border border-border bg-card p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-md">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-signal">
                    <Gauge className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-medium tracking-tight text-foreground">
                    No risk-aware governance
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    a LOW-risk lookup and a CRITICAL database deletion are treated the same way by a
                    generic rate limiter.
                  </p>
                </div>
                <div className="mt-6 border-t border-border/80 pt-4 font-mono text-[11px] text-muted-foreground group-hover:text-foreground">
                  Blind Rate Limits Fail Under Attack
                </div>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="group flex h-full flex-col justify-between rounded-xl border border-border bg-card p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-md sm:col-span-2 lg:col-span-1">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-signal">
                    <FileLock2 className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-medium tracking-tight text-foreground">
                    No tamper-evident record
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    a standard log table can be edited after the fact, which fails the basic bar for
                    anything that needs to hold up as evidence.
                  </p>
                </div>
                <div className="mt-6 border-t border-border/80 pt-4 font-mono text-[11px] text-muted-foreground group-hover:text-foreground">
                  Standard SQL Logs Can Be Mutated
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. Our Solution Section */}
      <section className="border-b border-border">
        <div className="container-ag py-20 sm:py-24 md:py-28">
          <Reveal>
            <div className="max-w-3xl">
              <p className="eyebrow">
                <span className="text-signal">●</span> OUR SOLUTION
              </p>
              <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-normal leading-snug tracking-tight text-foreground">
                AgentGuard moves the decision to before the action, not after it.
              </h2>
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
                Every tool call an agent wants to make is sent to AgentGuard first. AgentGuard checks
                who the agent is, what it's allowed to do, what it's about to spend, and how risky
                the action is — and only then returns ALLOW, DENY, or PENDING. If a human needs to
                sign off, the agent pauses and waits for a real approval instead of guessing. Every
                single decision, whatever it is, is written to a cryptographic, tamper-evident
                record that can be independently verified later. This is the shift from &ldquo;we
                logged what the agent did&rdquo; to &ldquo;we controlled what the agent was allowed to
                do.&rdquo;
              </p>
            </div>
          </Reveal>

          {/* Interactive Decision Inspector (Replacing Diagram with High-Agency Interaction) */}
          <Reveal delay={100}>
            <div className="mt-14 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              {/* Tab Selector */}
              <div className="flex flex-wrap border-b border-border bg-background/50 p-2 gap-2">
                {(["ALLOW", "DENY", "PENDING"] as DecisionTab[]).map((tab) => {
                  const isActive = selectedDecision === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setSelectedDecision(tab)}
                      className={`inline-flex items-center gap-2 rounded-md px-4 py-2 font-mono text-xs font-medium transition-all ${
                        isActive
                          ? "bg-ink text-on-ink shadow-sm"
                          : "text-muted-foreground hover:bg-card hover:text-foreground"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          tab === "ALLOW"
                            ? "bg-allow"
                            : tab === "DENY"
                              ? "bg-deny"
                              : "bg-pending"
                        }`}
                      />
                      <span>Inspect {tab} State</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Decision Breakdown */}
              <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr]">
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded border px-2.5 py-1 font-mono text-xs font-semibold ${activeData.badgeColor}`}
                    >
                      {activeData.statusText}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {activeData.risk}
                    </span>
                  </div>

                  <div>
                    <p className="eyebrow">INTERCEPTED PROPOSED CALL</p>
                    <div className="mt-2 rounded-md border border-ink-line bg-ink p-3.5 font-mono text-xs text-on-ink">
                      <span className="text-signal font-semibold">{activeData.tool}</span>
                      <span className="text-on-ink-muted">({activeData.args})</span>
                    </div>
                  </div>

                  <div>
                    <p className="eyebrow">RULE EVALUATED</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground font-medium">
                      {activeData.ruleReason}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-lg border border-border bg-background/70 p-5 sm:p-6">
                  <div>
                    <p className="eyebrow">EXECUTION EFFECT ON AGENT</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {activeData.actionEffect}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-border pt-4">
                    <p className="eyebrow !text-[10px]">CRYPTOGRAPHIC AUDIT PAYLOAD</p>
                    <p className="mt-1 font-mono text-xs text-muted-foreground break-all">
                      {activeData.auditPayload}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. How We Filled The Gap */}
      <section className="container-ag py-20 sm:py-24 md:py-28">
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow">
              <span className="text-signal">●</span> HOW WE FILLED THE GAP
            </p>
            <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-normal leading-snug tracking-tight text-foreground">
              Six specific gaps in existing tooling, and exactly how AgentGuard closes each one.
            </h2>
          </div>
        </Reveal>

        <div className="mt-16 divide-y divide-border border-y border-border">
          {SIX_GAP_SOLUTIONS.map((p, k) => (
            <Reveal key={p.tag} delay={k * 30}>
              <article className="group grid gap-6 py-8 transition-colors hover:bg-card/40 md:grid-cols-[70px_1fr_2.2fr] md:gap-8 md:px-3">
                <span className="font-mono text-sm font-semibold text-muted-foreground group-hover:text-signal transition-colors">
                  {p.tag}
                </span>

                <div>
                  <h3 className="text-xl font-medium tracking-tight text-foreground">
                    {p.title}
                  </h3>
                </div>

                <dl className="grid gap-4 sm:grid-cols-3 text-sm">
                  <div>
                    <dt className="eyebrow">Problem</dt>
                    <dd className="mt-1.5 text-muted-foreground leading-relaxed">
                      {p.problem}
                    </dd>
                  </div>
                  <div>
                    <dt className="eyebrow">Method</dt>
                    <dd className="mt-1.5 text-foreground leading-relaxed">
                      {p.method}
                    </dd>
                  </div>
                  <div>
                    <dt className="eyebrow !text-signal">Why it matters</dt>
                    <dd className="mt-1.5 text-muted-foreground leading-relaxed">
                      {p.why}
                    </dd>
                  </div>
                </dl>
              </article>
            </Reveal>
          ))}
        </div>

        {onScrollToNext && (
          <div className="mt-16 flex justify-center">
            <button
              type="button"
              onClick={onScrollToNext}
              className="group inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-6 py-3 font-mono text-xs text-muted-foreground transition-all hover:border-signal hover:text-foreground hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
            >
              <span>Continue scroll to How It Works</span>
              <ArrowDown className="h-3.5 w-3.5 text-signal transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
