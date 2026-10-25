// All editable site copy lives here.

export const LINKS = {
  github: "https://github.com/hariprasath-dlh/AgentGuard",
  dashboard: "https://agentguard-frontend-theta.vercel.app/",
  email: "hariprasathdlhdlh@gmail.com",
};

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/getting-started", label: "Getting Started" },
  { to: "/sdk-setup", label: "SDK Setup" },
  { to: "/integration", label: "Integration" },
  { to: "/faq", label: "FAQ" },
] as const;

export const HOME_PILLARS = [
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
      "When something goes wrong, it is hard to reconstruct why an agent acted the way it did.",
    method:
      "Every decision is recorded as a cryptographically linked audit event, with the reason behind it.",
    why: "Reviewers can trace each action back to the exact rule that allowed or blocked it — and prove the record hasn't been altered.",
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

export const STEPS = [
  {
    n: "01",
    title: "Agent proposes an action",
    what: "The agent decides it wants to call a tool, for example sending an email or querying a database.",
    why: "This is the moment before anything irreversible happens.",
    how: "The proposal is packaged as a structured tool request: agent, tool, action and arguments.",
  },
  {
    n: "02",
    title: "AgentGuard intercepts the request",
    what: "Instead of going straight to the tool, the request is sent to AgentGuard.",
    why: "Governance only works if it sits in the path of execution.",
    how: "The SDK forwards the request to the AgentGuard API over JSON.",
  },
  {
    n: "03",
    title: "Authentication and agent validation",
    what: "AgentGuard checks who is asking.",
    why: "Unknown or revoked agents should never reach a tool.",
    how: "The agent identity and credentials are validated before any other check.",
  },
  {
    n: "04",
    title: "Tool permissions and RBAC",
    what: "The agent's role is compared to the tool and action requested.",
    why: "A support agent should not be able to delete records.",
    how: "Role-based rules map roles to allowed tools and actions.",
  },
  {
    n: "05",
    title: "Policy evaluation",
    what: "Declared policies are applied to the request and its arguments.",
    why: "Some rules depend on context, not just on the tool name.",
    how: "Policies are evaluated in order and can allow, deny or escalate.",
  },
  {
    n: "06",
    title: "Risk evaluation",
    what: "The request is given a risk level.",
    why: "Not every allowed action carries the same consequence.",
    how: "Risk signals from the tool, action and arguments are combined into a score.",
  },
  {
    n: "07",
    title: "Budget and rate limits",
    what: "Usage counters are checked for the agent and tool.",
    why: "Prevents runaway loops and unexpected costs.",
    how: "Requests over the limit are denied with a clear reason.",
  },
  {
    n: "08",
    title: "Human-in-the-loop",
    what: "High-risk requests can be held for review.",
    why: "People decide on the actions that really matter.",
    how: "The request is marked PENDING until a reviewer approves or rejects it.",
  },
  {
    n: "09",
    title: "Final decision",
    what: "AgentGuard returns ALLOW, DENY or PENDING.",
    why: "The agent gets one clear answer it can act on.",
    how: "The decision includes the reason and the rule that produced it.",
  },
  {
    n: "10",
    title: "Tool execution only when allowed",
    what: "The tool runs only after an ALLOW.",
    why: "Blocked actions never touch the external system.",
    how: "The SDK executes the call on ALLOW and skips it otherwise.",
  },
  {
    n: "11",
    title: "Audit event recorded",
    what: "The full decision is written to the audit log.",
    why: "Every action is traceable later.",
    how: "Audit events store the request, decision and reason in order.",
  },
];

export const ONBOARDING = [
  {
    n: "01",
    title: "Requirements",
    body: "A Python project with an AI agent that calls tools. Access to a running AgentGuard API instance.",
    code: "python --version\n# Python 3.x",
  },
  {
    n: "02",
    title: "Install",
    body: "Add the SDK to your project. Replace with the exact package name from the repository.",
    code: "pip install agentguard-sdk  # placeholder",
  },
  {
    n: "03",
    title: "Configure",
    body: "Point the SDK at your AgentGuard API and give the agent an identity.",
    code: "AGENTGUARD_URL=<your-api-url>\nAGENTGUARD_AGENT_ID=<agent-id>",
  },
  {
    n: "04",
    title: "Connect the agent",
    body: "Create a client and wrap the tools your agent uses.",
    code: "guard = AgentGuardClient(url, agent_id)  # placeholder",
  },
  {
    n: "05",
    title: "Send a governed tool request",
    body: "Instead of calling the tool directly, ask AgentGuard first.",
    code: 'decision = guard.check(tool="send_email", args={...})',
  },
  {
    n: "06",
    title: "Read the decision",
    body: "Act on ALLOW, stop on DENY, and wait on PENDING.",
    code: 'if decision.status == "ALLOW":\n    run_tool()',
  },
];

export type TermLine = { kind: "cmd" | "out" | "ok" | "state" | "decision"; text: string };
export const TERMINAL: TermLine[] = [
  { kind: "cmd", text: "pip install agentguard-sdk" },
  { kind: "out", text: "# replace with verified install output" },
  { kind: "cmd", text: "agentguard init" },
  { kind: "out", text: "# writes local config (placeholder)" },
  { kind: "cmd", text: "configure" },
  { kind: "ok", text: "AgentGuard connected" },
  { kind: "ok", text: "Policy loaded" },
  { kind: "ok", text: "Agent ready" },
  { kind: "cmd", text: 'agent.run("send_email", to="team@...")' },
  { kind: "state", text: "governance: auth → rbac → policy → risk → budget" },
  { kind: "decision", text: "PENDING · awaiting human approval" },
];

export const INTEGRATION_LAYERS = [
  { name: "Existing AI Agent", note: "Your current agent, unchanged" },
  { name: "AgentGuard SDK", note: "Wraps tool calls in Python" },
  { name: "AgentGuard API", note: "Receives structured JSON requests" },
  { name: "Governance Checks", note: "Auth · RBAC · policy · risk · limits" },
  { name: "ALLOW / DENY / PENDING", note: "One clear decision with a reason", decision: true },
  { name: "External Tool", note: "Runs only after ALLOW" },
];

export const INTEGRATION_POINTS = [
  {
    t: "Where the SDK fits",
    d: "The SDK sits between your agent's reasoning step and its tool layer. The agent code stays the same; tool calls go through a wrapper.",
  },
  {
    t: "Interception",
    d: "When the agent picks a tool, the wrapper turns it into a structured request instead of executing it.",
  },
  {
    t: "Reaching governance",
    d: "The request is sent to the AgentGuard API, which runs the checks in a fixed order.",
  },
  {
    t: "Returning the decision",
    d: "The API responds with a status, a reason and the rule involved.",
  },
  { t: "After ALLOW", d: "The SDK runs the real tool and returns the result to the agent." },
  {
    t: "After DENY",
    d: "The tool is never called. The agent receives the reason and can choose another path.",
  },
  {
    t: "After PENDING",
    d: "The request waits for human review. The agent can poll or continue other work.",
  },
];

export const INTEGRATION_CODE = `# Placeholder example — replace with the real SDK API
from agentguard import AgentGuardClient

guard = AgentGuardClient(url=AGENTGUARD_URL, agent_id="support-bot")

def governed_call(tool, **args):
    decision = guard.check(tool=tool, args=args)

    if decision.status == "ALLOW":
        return TOOLS[tool](**args)
    if decision.status == "PENDING":
        return {"waiting": decision.request_id}
    return {"denied": decision.reason}`;

export const FAQ = [
  {
    q: "What is AgentGuard?",
    a: "AgentGuard is a runtime governance layer for AI agents. It checks each proposed tool call before it runs and returns ALLOW, DENY or PENDING.",
  },
  {
    q: "Why does AgentGuard check actions before execution?",
    a: "Once a tool runs, the email is sent or the record is changed. Checking first means unsafe actions can be stopped instead of just logged.",
  },
  {
    q: "What happens when an action is denied?",
    a: "The tool is never called. The agent receives the decision with a reason, so it can explain the result or try another approach.",
  },
  {
    q: "What happens when an action requires human approval?",
    a: "The request is marked PENDING. A reviewer approves or rejects it, and only an approval lets the tool run.",
  },
  {
    q: "How does the SDK fit into an existing AI project?",
    a: "It wraps the agent's tool calls. Your agent logic stays the same; calls are routed through AgentGuard before execution.",
  },
  {
    q: "What is the role of RBAC and permissions?",
    a: "Each agent has a role. Roles define which tools and actions the agent may use, so access is limited by design.",
  },
  {
    q: "How are budget and rate limits used?",
    a: "They cap how often and how much an agent can use a tool. This protects against runaway loops and unexpected cost.",
  },
  {
    q: "What is the audit layer?",
    a: "Every decision is recorded with the request and the reason. It gives a traceable history of what the agent tried and what was decided.",
  },
  {
    q: "How is AgentGuard different from observability tools?",
    a: "Observability shows what happened. AgentGuard decides what is allowed to happen, before it happens, and records that decision.",
  },
  {
    q: "Can AgentGuard work with different agent architectures?",
    a: "It is designed to be framework-agnostic. Any agent that can route a tool call through the SDK or API can be governed.",
  },
];
