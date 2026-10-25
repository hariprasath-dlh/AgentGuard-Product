import { useState } from "react";
import { PageHeader, Reveal, CodeBlock, Decision } from "@/components/site/Reveal";
import { INTEGRATION_LAYERS, INTEGRATION_POINTS } from "@/content/site";
import {
  ExternalLink,
  Shield,
  Layers,
  Key,
  Users,
  Lock,
  Gauge,
  UserCheck,
  FileText,
  Blocks,
} from "lucide-react";

const CODE_BASIC_CONNECTION = `import os
from agentguard import AgentGuard

# Initialize the client using your agent's unique API key
client = AgentGuard(
    api_key=os.environ.get("AGENTGUARD_API_KEY"),
    base_url="https://agentguard-backend-zorh.onrender.com/api/v1",
)`;

const CODE_WRAPPER_PATTERN = `from agentguard import AgentGuard, AgentGuardDenied, AgentGuardPending

client = AgentGuard(api_key=os.environ["AGENTGUARD_API_KEY"])

def dispatch_tool(tool_name: str, parameters: dict):
    # Intercept tool call before external execution
    try:
        result = client.guard(tool=tool_name, parameters=parameters)
        if result.allowed:
            return TOOLS[tool_name](**parameters)
    except AgentGuardDenied as e:
        # Policy or RBAC blocked execution
        return {"error": "Blocked by policy", "reason": e.reason}
    except AgentGuardPending as e:
        # Held for human authorization
        return {"status": "pending_approval", "request_id": e.request_id}`;

const CODE_MULTI_AGENT = `# Fleet configuration: one dashboard, isolated agent identities
support_agent = AgentGuard(
    api_key=os.environ["SUPPORT_AGENT_KEY"],
    base_url="https://agentguard-backend-zorh.onrender.com/api/v1",
)

billing_agent = AgentGuard(
    api_key=os.environ["BILLING_AGENT_KEY"],
    base_url="https://agentguard-backend-zorh.onrender.com/api/v1",
)

data_agent = AgentGuard(
    api_key=os.environ["DATA_PIPELINE_AGENT_KEY"],
    base_url="https://agentguard-backend-zorh.onrender.com/api/v1",
)`;

const CODE_FRAMEWORK_AGNOSTIC = `# Example: Integrating with LangChain, LlamaIndex, or custom agents
from langchain.tools import tool
from agentguard import AgentGuard

guard_client = AgentGuard(api_key=os.environ["AGENTGUARD_API_KEY"])

@tool
def update_customer_record(customer_id: str, updates: dict) -> str:
    """Updates customer record after pre-execution governance check."""
    decision = guard_client.guard(
        tool="update_customer_record",
        parameters={"customer_id": customer_id, "updates": updates},
    )
    if decision.allowed:
        return database.update(customer_id, updates)
    return f"Action blocked: {decision.reason}"`;

const ROLES_REFERENCE = [
  {
    role: "Customer Support",
    agent: "support-bot-prod",
    tools: "search_faq, view_order, create_ticket",
    access: "Read-only & safe write",
  },
  {
    role: "Billing Operations",
    agent: "billing-assistant-v2",
    tools: "fetch_invoice, issue_refund (under $100)",
    access: "Scoped financial access",
  },
  {
    role: "Data Engineering",
    agent: "etl-sync-worker",
    tools: "query_warehouse, export_csv",
    access: "Analytic read-only",
  },
  {
    role: "DevOps & SRE",
    agent: "infra-monitor-agent",
    tools: "restart_pod, check_health, scale_replicas",
    access: "High-risk (requires human approval)",
  },
];

export function IntegrationSection({ onScrollToNext }: { onScrollToNext?: () => void }) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="w-full bg-background text-foreground">
      {/* Top Banner Tag */}
      <div className="border-b border-border bg-sand/30 py-4 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <span className="text-signal">05</span> / 06 — Integration
      </div>

      {/* Page Intro Header */}
      <PageHeader
        eyebrow="INTEGRATION"
        title="One dashboard, any number of agents, all governed the same way."
        intro="This page explains how the dashboard and the SDK actually connect, and how to grow from one agent to a whole fleet of them without losing control of who can do what."
      />

      {/* Interactive System Flow Diagram */}
      <section className="container-ag border-b border-border py-16 md:py-20">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-signal" />
            <span className="font-mono text-xs uppercase tracking-wider text-signal font-medium">
              Architecture Overview
            </span>
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            The Governed Execution Path
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
            Your agent code stays unchanged. The SDK adds one non-blocking checkpoint between the
            agent deciding on a tool and running it.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 items-start">
          <div className="rounded-xl border border-ink-line bg-ink p-5 text-on-ink shadow-lg md:p-8">
            <div className="flex items-center justify-between border-b border-ink-line pb-4">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-on-ink-muted">
                Runtime Request Flow
              </p>
              <span className="font-mono text-[11px] text-signal font-medium">
                ~42ms avg evaluation
              </span>
            </div>
            <ol className="mt-6 space-y-2">
              {INTEGRATION_LAYERS.map((l, k) => (
                <li
                  key={l.name}
                  onMouseEnter={() => setHover(k)}
                  onMouseLeave={() => setHover(null)}
                >
                  <div
                    className={`flex items-center justify-between gap-4 rounded-lg border px-4 py-3.5 transition-all ${
                      hover === k || l.decision
                        ? "border-signal bg-ink/90 ring-1 ring-signal/40"
                        : "border-ink-line bg-ink-soft/90"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] text-on-ink-muted">LAYER 0{k + 1}</p>
                      {l.decision ? (
                        <div className="mt-1 flex flex-wrap gap-2">
                          <Decision status="ALLOW" />
                          <Decision status="DENY" />
                          <Decision status="PENDING" />
                        </div>
                      ) : (
                        <p className="mt-0.5 font-medium text-sm text-on-ink">{l.name}</p>
                      )}
                    </div>
                    <p className="text-right text-xs text-on-ink-muted font-mono">{l.note}</p>
                  </div>
                  {k < INTEGRATION_LAYERS.length - 1 && (
                    <div className="ml-8 my-1 h-5 w-px">
                      <svg viewBox="0 0 2 20" className="h-5 w-0.5" aria-hidden="true">
                        <line
                          x1="1"
                          y1="0"
                          x2="1"
                          y2="20"
                          strokeWidth="1.5"
                          className={
                            hover !== null && k <= hover ? "stroke-signal" : "stroke-ink-line"
                          }
                        />
                      </svg>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-4">
            {INTEGRATION_POINTS.map((p, k) => (
              <Reveal key={p.t} delay={k * 25}>
                <div className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-signal/40">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-signal/15 font-mono text-[11px] font-semibold text-signal">
                      {k + 1}
                    </span>
                    <h3 className="font-medium text-foreground text-sm">{p.t}</h3>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground md:text-sm pl-7">
                    {p.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Subtopics Detailed Breakdown */}
      <section className="container-ag max-w-5xl py-16 md:py-24">
        <div className="space-y-12 md:space-y-16">
          {/* Subtopic 1 — The Core Connection: One Agent, One API Key */}
          <Reveal>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <Key className="h-4 w-4 text-signal" />
                  <span className="font-mono text-xs uppercase tracking-wider text-signal font-medium">
                    Foundation
                  </span>
                </div>
                <span className="rounded border border-border bg-background px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                  Core Principle
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                The Core Connection: One Agent, One API Key
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                Every connection between your code and AgentGuard starts the same way — an agent you
                register in the dashboard, and the one-time API key it gives you. That key is what
                your code uses to prove which agent it is every time it sends a request through the
                SDK. The dashboard is where you define what an agent can do; the SDK is how your
                running code actually asks for permission to do it. They're always talking to the
                same underlying account — there's no separate setup for each.
              </p>
              <div className="mt-6">
                <CodeBlock
                  code={CODE_BASIC_CONNECTION}
                  label="Python SDK Configuration"
                  copyable={true}
                />
              </div>
              <div className="mt-4">
                <a
                  href="https://agentguard-frontend-theta.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded border border-foreground/60 bg-background px-4 py-2 font-mono text-xs font-medium text-foreground transition-colors hover:border-signal hover:text-signal"
                >
                  <span>Open Dashboard to generate agent keys</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </Reveal>

          {/* Subtopic 2 — How the Dashboard and SDK Work Together */}
          <Reveal delay={20}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <Layers className="h-4 w-4 text-signal" />
                <span className="font-mono text-xs uppercase tracking-wider text-signal font-medium">
                  Architecture
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                How the Dashboard and SDK Work Together
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                The dashboard is where you configure policies, register tools, define roles, and
                monitor live audit events. The SDK lives inside your application process and
                intercepts tool execution. When your agent decides to call a tool, the SDK packages
                the intent and dispatches a lightweight JSON payload to the AgentGuard API. The
                backend evaluates the request against your dashboard configuration in under 50ms,
                returning ALLOW, DENY, or PENDING before any real execution occurs.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border/80 bg-background p-4">
                  <span className="font-mono text-xs font-bold text-signal">01. Dashboard</span>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Where you declare rules, assign roles to agents, and review pending approval
                    queues.
                  </p>
                </div>
                <div className="rounded-lg border border-border/80 bg-background p-4">
                  <span className="font-mono text-xs font-bold text-signal">02. SDK Wrapper</span>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Intercepts the proposed tool call and asks AgentGuard for permission before
                    running.
                  </p>
                </div>
                <div className="rounded-lg border border-border/80 bg-background p-4">
                  <span className="font-mono text-xs font-bold text-signal">03. Audit Engine</span>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Stores cryptographically linked decision records accessible on the dashboard in
                    real time.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Subtopic 3 — Where the SDK Sits in Your Code */}
          <Reveal delay={30}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <Shield className="h-4 w-4 text-signal" />
                <span className="font-mono text-xs uppercase tracking-wider text-signal font-medium">
                  Implementation
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Where the SDK Sits in Your Code
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                The SDK sits directly between your agent's reasoning loop and your actual tool
                functions. You do not need to alter how your model prompts, reasons, or plans. When
                the agent selects a tool and provides parameters, you wrap the dispatch in a single
                guard check. The SDK acts as an immutable boundary: only approved calls proceed to
                your external services, while denied actions fail fast with clear explanatory
                reasons.
              </p>
              <div className="mt-6">
                <CodeBlock
                  code={CODE_WRAPPER_PATTERN}
                  label="Tool Dispatch Wrapper (Python)"
                  copyable={true}
                />
              </div>
            </div>
          </Reveal>

          {/* Subtopic 4 — Managing Multiple Agents in One Dashboard */}
          <Reveal delay={40}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <Users className="h-4 w-4 text-signal" />
                <span className="font-mono text-xs uppercase tracking-wider text-signal font-medium">
                  Fleet Management
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Managing Multiple Agents in One Dashboard
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                As you expand from a single prototype to a fleet of specialized agents, they all
                live under your central organization. Each agent gets its own distinct identity,
                descriptive metadata, and scoped API key. Whether you run a support assistant, a
                data analysis worker, or a code deployment agent, their actions, token consumption,
                and policy decisions appear together in real time on the dashboard.
              </p>
              <div className="mt-6">
                <CodeBlock
                  code={CODE_MULTI_AGENT}
                  label="Fleet Multi-Agent Configuration"
                  copyable={true}
                />
              </div>
            </div>
          </Reveal>

          {/* Subtopic 5 — Role-Based Access Control Across Your Fleet */}
          <Reveal delay={50}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <Lock className="h-4 w-4 text-signal" />
                <span className="font-mono text-xs uppercase tracking-wider text-signal font-medium">
                  Permissions & RBAC
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Role-Based Access Control Across Your Fleet
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                Rather than hardcoding security rules into each agent's codebase, AgentGuard
                decouples access control from code. You assign agents roles like Support, Finance,
                or Admin in the dashboard, and attach tool permissions to those roles. If a customer
                support agent attempts to run a database migration tool, AgentGuard intercepts and
                denies the call instantly, without requiring you to change a single line of
                application code.
              </p>

              {/* Reference Table for Fleet Roles */}
              <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-background">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-sand/30 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Assigned Role</th>
                      <th className="px-4 py-3 font-semibold">Example Agent</th>
                      <th className="px-4 py-3 font-semibold">Permitted Tools</th>
                      <th className="px-4 py-3 font-semibold">Access Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-mono text-xs">
                    {ROLES_REFERENCE.map((r, i) => (
                      <tr key={i} className="transition-colors hover:bg-sand/15">
                        <td className="px-4 py-3 font-semibold text-foreground">
                          <code className="rounded bg-muted px-1.5 py-0.5 font-semibold text-foreground">
                            {r.role}
                          </code>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{r.agent}</td>
                        <td className="px-4 py-3 font-mono text-signal">{r.tools}</td>
                        <td className="px-4 py-3 font-sans text-xs text-muted-foreground md:text-sm">
                          {r.access}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>

          {/* Subtopic 6 — Enforcing Risk Limits and Cost Budgets */}
          <Reveal delay={60}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <Gauge className="h-4 w-4 text-signal" />
                <span className="font-mono text-xs uppercase tracking-wider text-signal font-medium">
                  Safety & Budgets
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Enforcing Risk Limits and Cost Budgets
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                A rogue agent loop or an unexpected prompt injection can quickly exhaust third-party
                API budgets or trigger runaway execution storms. AgentGuard enforces strict
                per-agent and per-tool rate limits, token budgets, and risk thresholds. When an
                agent attempts an action that exceeds its allocated threshold or is flagged as
                CRITICAL risk, the SDK receives an immediate DENY or escalates to human review.
              </p>
            </div>
          </Reveal>

          {/* Subtopic 7 — Human-in-the-Loop for Sensitive Actions */}
          <Reveal delay={70}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <UserCheck className="h-4 w-4 text-signal" />
                <span className="font-mono text-xs uppercase tracking-wider text-signal font-medium">
                  Human Oversight
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Human-in-the-Loop for Sensitive Actions
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                For high-consequence operations — such as sending external wire transfers, issuing
                customer refunds over a certain dollar amount, or deleting sensitive data — policies
                can return PENDING. The request pauses safely and appears in the dashboard approval
                queue for human authorization. Once approved or rejected by a team member, the agent
                script can resume or branch to an alternative path.
              </p>
            </div>
          </Reveal>

          {/* Subtopic 8 — Unified Audit Trail and Fleet-Wide Visibility */}
          <Reveal delay={80}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <FileText className="h-4 w-4 text-signal" />
                <span className="font-mono text-xs uppercase tracking-wider text-signal font-medium">
                  Auditability
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Unified Audit Trail and Fleet-Wide Visibility
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                Every evaluation made by AgentGuard produces a cryptographically chained audit
                record that cannot be tampered with or erased. Each entry captures the exact agent
                ID, requested tool, passed arguments, timestamp, evaluated policy rule, and final
                decision. Security teams and compliance auditors can reconstruct any agent's
                decision trail on demand with complete confidence.
              </p>
            </div>
          </Reveal>

          {/* Subtopic 9 — Framework-Agnostic Integration */}
          <Reveal delay={90}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <Blocks className="h-4 w-4 text-signal" />
                <span className="font-mono text-xs uppercase tracking-wider text-signal font-medium">
                  Compatibility
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Framework-Agnostic Integration
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                AgentGuard works seamlessly with any modern AI framework, including LangChain,
                LlamaIndex, CrewAI, AutoGen, and custom Python loops. Because the SDK operates at
                the tool invocation boundary rather than the model prompt layer, you can govern
                agents across different frameworks and language models using the exact same
                centralized governance rules and dashboard.
              </p>
              <div className="mt-6">
                <CodeBlock
                  code={CODE_FRAMEWORK_AGNOSTIC}
                  label="LangChain / Framework Tool Integration"
                  copyable={true}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Continue Scroll Navigation */}
      {onScrollToNext && (
        <div className="border-t border-border py-8 text-center">
          <button
            type="button"
            onClick={onScrollToNext}
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 font-mono text-xs text-muted-foreground transition-all hover:border-signal hover:text-foreground"
          >
            <span>Continue scroll to FAQ</span>
            <span className="text-signal transition-transform group-hover:translate-y-0.5">↓</span>
          </button>
        </div>
      )}
    </div>
  );
}
