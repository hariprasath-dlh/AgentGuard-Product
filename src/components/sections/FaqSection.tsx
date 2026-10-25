import { Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/Reveal";
import { FaqAccordion, type FAQItem } from "@/components/ui/faq-chat-accordion";

interface FaqCategory {
  title: string;
  description?: string;
  items: FAQItem[];
}

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    title: "Core Concepts & Architecture",
    description: "Foundational concepts behind pre-dispatch AI agent governance.",
    items: [
      {
        id: 1,
        question: "What is AgentGuard?",
        answer:
          "AgentGuard is a governance layer that sits between an AI agent and the tools it calls. Before any tool call runs, AgentGuard checks permissions, policy, risk, budget, and rate limits, then returns ALLOW, DENY, or PENDING. Every decision is recorded in a tamper-evident audit log.",
      },
      {
        id: 2,
        question: "Why do AI agents need governance at all?",
        answer:
          "An agent that can call real tools can also call the wrong one, call the right one too many times, or be tricked into a harmful action. Logging what happened afterwards doesn't undo it. AgentGuard puts the decision before the action, so a bad call is stopped instead of just recorded.",
      },
      {
        id: 3,
        question: "How is this different from tools like LangSmith or Langfuse?",
        answer:
          "Those tools are observability platforms — they log prompts, responses, and token usage after execution has already happened. They cannot block a destructive action or pause a tool call in flight. AgentGuard is a pre-dispatch control plane: it sits in the execution path and makes an authoritative decision before any tool call reaches external infrastructure.",
      },
      {
        id: 4,
        question: "How is AgentGuard different from traditional API gateways?",
        answer:
          "Traditional gateways (like Kong or AWS API Gateway) inspect raw HTTP endpoints at network boundaries and enforce generic rate limits by IP. They don't understand agent semantics, tool arguments, model parameters, or risk levels. AgentGuard evaluates structured tool calls with full awareness of agent identity, role permissions, contextual policy, and spending caps.",
      },
      {
        id: 5,
        question: "What agent frameworks are supported?",
        answer:
          "AgentGuard is completely framework-agnostic. It communicates via standard JSON over REST HTTP. Whether your agent is built with LangChain, CrewAI, AutoGen, OpenAI Agents SDK, LlamaIndex, or plain Python scripts, you can govern its tool dispatches with the SDK or direct API calls.",
      },
    ],
  },
  {
    title: "Decisions & Policy Engine",
    description: "How the 11-step deterministic pipeline arrives at decisions.",
    items: [
      {
        id: 6,
        question: "What decisions can AgentGuard return?",
        answer:
          "AgentGuard returns one of three authoritative decisions: ALLOW (the tool call passes all checks and may execute), DENY (the call violates a permission, policy, risk, budget, or rate limit rule and is blocked), or PENDING (the action requires human review and execution is suspended until approved).",
      },
      {
        id: 7,
        question: "What happens when an action is denied?",
        answer:
          "When a call is denied, the tool is never executed. The SDK raises a specific AgentGuardDenied exception containing the structured reason and rule that blocked it. Your code can catch this exception cleanly, log it, or pass the reason back to the agent so it can re-plan or explain the refusal to the user.",
      },
      {
        id: 8,
        question: "Can permissions override a CRITICAL risk level?",
        answer:
          "No. In AgentGuard, CRITICAL risk rules are an immutable architectural invariant. Even if an administrator explicitly grants an agent permission to run a tool, if that tool's risk level is evaluated as CRITICAL, the policy engine unconditionally denies the request. Security invariants always supersede individual permission grants.",
      },
      {
        id: 9,
        question: "How fast is each evaluation?",
        answer:
          "The 11-step deterministic policy engine runs entirely in pure logic without calling external LLMs during evaluation. Typical response times are sub-15ms, introducing negligible latency to your agent's execution loop.",
      },
    ],
  },
  {
    title: "Human-in-the-Loop (HITL)",
    description: "Asynchronous review workflows for high-stakes tool execution.",
    items: [
      {
        id: 10,
        question: "How does Human-in-the-Loop approval work?",
        answer:
          "When an agent proposes an action rated HIGH risk, the engine marks the request as PENDING and generates a review item in the Control Plane dashboard. The SDK raises AgentGuardPending, pausing the agent. A manager or admin reviews the full payload and clicks Approve or Deny. If approved, the agent resumes and the tool executes.",
      },
      {
        id: 11,
        question: "What happens if a human doesn't review a PENDING request in time?",
        answer:
          "Every HITL request has a 24-hour expiration window. If no operator reviews the request before the deadline, it automatically transitions to EXPIRED, and the action is safely cancelled without executing.",
      },
      {
        id: 12,
        question: "Who is authorized to approve pending actions?",
        answer:
          "Only users with the MANAGER or ADMIN roles can approve or deny pending requests in the Control Plane dashboard. Users with AUDITOR, SECURITY, or DEVELOPER roles have restricted access.",
      },
    ],
  },
  {
    title: "Security, RBAC & Audit Vault",
    description: "Multi-tenant role boundaries and cryptographic tamper detection.",
    items: [
      {
        id: 13,
        question: "How does the tamper-evident audit log work?",
        answer:
          "Every single evaluation — whether ALLOW, DENY, or PENDING — writes a cryptographic record linked to the previous event using SHA-256 hash chaining (current_hash = SHA256(previous_hash + canonical_event)). Any insertion, deletion, or modification breaks the hash chain immediately.",
      },
      {
        id: 14,
        question: "Why do you say 'tamper-evident' instead of 'tamper-proof'?",
        answer:
          "We maintain strict language discipline: no database is completely tamper-proof against someone with direct database administrator access. However, AgentGuard's cryptographic hash chain makes any tampering immediately detectable. Auditors can verify the entire chain at any time via the Control Plane with one click.",
      },
      {
        id: 15,
        question: "How are agent API keys managed and stored?",
        answer:
          "Agent API keys use the ag_live_ prefix and are hashed using SHA-256 before being stored in the database. Plaintext keys are displayed exactly once at creation and never stored or returned again. Keys can be revoked instantly from the dashboard.",
      },
      {
        id: 16,
        question: "What roles are supported in the Control Plane?",
        answer:
          "AgentGuard enforces strict multi-tenant RBAC with five distinct roles: ADMIN (full access), SECURITY (manages policies, tools, agents, and budgets), AUDITOR (read-only audit vault access and chain verification), MANAGER (approvals and operations), and DEVELOPER (registers agents and tests tools).",
      },
    ],
  },
  {
    title: "SDK & Developer Integration",
    description: "Installing and wiring the lightweight client in minutes.",
    items: [
      {
        id: 17,
        question: "What dependencies does the Python SDK have?",
        answer:
          "The agentguard-governance-sdk package is a small Python library with only two dependencies: httpx (for fast HTTP requests) and pydantic (for structured validation), and nothing else.",
      },
      {
        id: 18,
        question: "What happens if the AgentGuard API is temporarily unreachable?",
        answer:
          "The SDK includes configurable timeout and exponential backoff retry settings. If the connection fails after retries, it raises an AgentGuardServerError or AgentGuardTimeoutError, allowing you to define fail-closed or fail-safe behavior based on your security policy.",
      },
      {
        id: 19,
        question: "Does using AgentGuard require rewriting existing agent code?",
        answer:
          "No. AgentGuard wraps your existing tool dispatch functions. You don't need to rebuild prompts, switch LLM providers, or restructure your agent loop. You simply insert a guard.check() or client.guard() call before invoking the actual tool function.",
      },
    ],
  },
];

export function FaqSection({ onScrollToTop }: { onScrollToTop?: () => void }) {
  return (
    <div className="w-full">
      <div className="border-b border-border bg-sand/30 py-4 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <span className="text-signal">06</span> / 06 — Frequently Asked Questions
      </div>
      <PageHeader
        eyebrow="FAQ"
        title="Straight answers to the questions people ask first."
        intro="If you can't find what you're looking for here, the How It Works and SDK Setup pages go deeper on any topic below."
      />

      <section className="container-ag max-w-4xl py-12 md:py-16">
        <div className="space-y-12 md:space-y-16">
          {FAQ_CATEGORIES.map((category, catIdx) => (
            <div key={category.title} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <span className="font-mono text-xs uppercase tracking-widest text-signal">
                  0{catIdx + 1}
                </span>
                <h2 className="text-xl font-medium tracking-tight text-foreground md:text-2xl">
                  {category.title}
                </h2>
              </div>
              {category.description && (
                <p className="text-sm text-muted-foreground">{category.description}</p>
              )}
              <FaqAccordion
                data={category.items}
                className="p-0"
                questionClassName="border border-border bg-card hover:bg-sand/40 text-foreground px-4 py-3 rounded-xl shadow-xs"
                answerClassName="max-w-2xl bg-signal text-primary-foreground px-5 py-3 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA Strip */}
      <section className="border-t border-border bg-sand">
        <div className="container-ag flex flex-col gap-6 py-16 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl text-xl tracking-tight md:text-2xl">
            Add a real decision point to an existing agent with the Python SDK.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/sdk-setup"
              className="inline-flex min-h-12 items-center justify-center rounded bg-signal px-6 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              See SDK Setup →
            </Link>
            {onScrollToTop && (
              <button
                type="button"
                onClick={onScrollToTop}
                className="inline-flex min-h-12 items-center justify-center rounded border border-foreground/70 px-5 text-sm font-medium transition-colors hover:border-signal hover:text-signal"
              >
                Back to Top ↑
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
