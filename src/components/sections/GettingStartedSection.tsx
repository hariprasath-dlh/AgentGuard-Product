import { Link } from "@tanstack/react-router";
import { PageHeader, Reveal, CodeBlock } from "@/components/site/Reveal";

const PIP_INSTALL_CODE = `pip install agentguard-governance-sdk`;

const PYTHON_SDK_CODE = `from agentguard import AgentGuard, AgentGuardDenied, AgentGuardPending

client = AgentGuard(
    api_key="your-agent-api-key",
    base_url="https://agentguard-backend-zorh.onrender.com/api/v1",
)

result = client.guard(tool="send_email", parameters={"to": "user@example.com"})

if result.allowed:
    send_email()  # your existing function`;

export function GettingStartedSection({ onScrollToNext }: { onScrollToNext?: () => void }) {
  return (
    <div className="w-full bg-background text-foreground">
      {/* Top Banner Tag */}
      <div className="border-b border-border bg-sand/30 py-4 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <span className="text-signal">03</span> / 06 — Getting Started
      </div>

      {/* Page Intro Header */}
      <PageHeader
        eyebrow="GETTING STARTED"
        title="Add real governance to your own AI agent in about fifteen minutes."
        intro="This guide walks you through everything from creating your account to seeing your first real decision show up in the dashboard — no prior AgentGuard experience needed."
      />

      <section className="container-ag max-w-5xl py-16 md:py-24">
        <div className="space-y-12 md:space-y-16">
          {/* Before You Start */}
          <Reveal>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-signal" />
                  <span className="font-mono text-xs uppercase tracking-wider text-signal font-medium">
                    Prerequisites
                  </span>
                </div>
                <span className="rounded border border-border bg-background px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                  ~5 mins setup
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Before You Start
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                You'll need an existing AI agent project written in Python, or just a willingness to
                try AgentGuard with a small test script first. You don't need to change how your
                agent thinks or reasons — you're only wrapping the moment it decides to call a tool.
                Have Python 3.9 or newer installed, and have five minutes to create a free account.
              </p>
            </div>
          </Reveal>

          {/* Step 1 — Create Your Account */}
          <Reveal delay={20}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal font-mono text-xs font-semibold text-primary-foreground">
                  01
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Step 1
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Step 1 — Create Your Account
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                Go to the AgentGuard dashboard at{" "}
                <a
                  href="https://agentguard-frontend-theta.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-foreground underline decoration-signal underline-offset-4 hover:text-signal"
                >
                  agentguard-frontend-theta.vercel.app
                </a>{" "}
                and click Sign Up. You can register with an email and password, or sign in directly
                with your Google account. Creating an account automatically sets up your own
                organization — a private space where your agents, tools, and data are completely
                separate from anyone else using AgentGuard.
              </p>
              <div className="mt-4">
                <a
                  href="https://agentguard-frontend-theta.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded border border-foreground/60 bg-background px-4 py-2 font-mono text-xs font-medium text-foreground transition-colors hover:border-signal hover:text-signal"
                >
                  Open Dashboard at agentguard-frontend-theta.vercel.app ↗
                </a>
              </div>
            </div>
          </Reveal>

          {/* Step 2 — Register Your First Agent */}
          <Reveal delay={30}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal font-mono text-xs font-semibold text-primary-foreground">
                  02
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Step 2
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Step 2 — Register Your First Agent
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                Once you're signed in, go to the Agents page and click "Register Agent." Give it a
                clear name, like the name of your actual project or bot. This creates a unique
                identity for your agent inside AgentGuard — every decision it causes will be tracked
                under this identity specifically.
              </p>
            </div>
          </Reveal>

          {/* Step 3 — Copy and Save Your API Key */}
          <Reveal delay={40}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal font-mono text-xs font-semibold text-primary-foreground">
                  03
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Step 3
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Step 3 — Copy and Save Your API Key
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                The moment you create an agent, AgentGuard shows you its API key one time only. Copy
                it immediately and store it somewhere safe, like an environment variable on your
                machine — never paste it into your code directly, and never share it. If you lose
                it, you'll need to create a new agent, since it cannot be shown again.
              </p>
            </div>
          </Reveal>

          {/* Step 4 — Register the Tools Your Agent Uses */}
          <Reveal delay={50}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal font-mono text-xs font-semibold text-primary-foreground">
                  04
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Step 4
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Step 4 — Register the Tools Your Agent Uses
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                Go to the Tools page and add each action your agent is capable of — for example,
                "send_email" or "process_refund." For each one, choose a risk level: LOW for
                harmless lookups, MEDIUM for everyday actions, HIGH for anything involving money or
                sensitive changes, and CRITICAL for anything irreversible or dangerous. This risk
                level is what AgentGuard uses to decide how carefully to treat each action.
              </p>
            </div>
          </Reveal>

          {/* Step 5 — Grant Your Agent Permission */}
          <Reveal delay={60}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal font-mono text-xs font-semibold text-primary-foreground">
                  05
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Step 5
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Step 5 — Grant Your Agent Permission
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                By default, an agent can't use any tool until you say it can. On the Tools &
                Permissions page, grant your agent access to each tool it's actually meant to use.
                This is deliberate — it means a mistake in your agent's code can't accidentally
                reach a tool it was never supposed to touch.
              </p>
            </div>
          </Reveal>

          {/* Step 6 — Install the Python SDK */}
          <Reveal delay={70}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal font-mono text-xs font-semibold text-primary-foreground">
                  06
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Step 6
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Step 6 — Install the Python SDK
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                In your own project, install the official SDK:
              </p>
              <div className="mt-4">
                <CodeBlock code={PIP_INSTALL_CODE} label="Terminal" />
              </div>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                That's the only dependency you need to start sending requests through AgentGuard.
              </p>
            </div>
          </Reveal>

          {/* Step 7 — Connect the SDK to Your Agent */}
          <Reveal delay={80}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal font-mono text-xs font-semibold text-primary-foreground">
                  07
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Step 7
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Step 7 — Connect the SDK to Your Agent
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                In your agent's code, create a client using your API key, then wrap any place your
                agent is about to call a real tool:
              </p>
              <div className="mt-4">
                <CodeBlock code={PYTHON_SDK_CODE} label="agent_guard_example.py" />
              </div>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                If the action is denied or needs human approval, the SDK raises a clear exception
                instead of silently failing — you decide how your agent should react in each case.
              </p>
            </div>
          </Reveal>

          {/* Step 8 — Set a Budget and a Policy (Recommended) */}
          <Reveal delay={90}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal font-mono text-xs font-semibold text-primary-foreground">
                  08
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Step 8
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Step 8 — Set a Budget and a Policy (Recommended)
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                Go to the Budgets page and give your agent a spending cap and a request-rate cap —
                even a generous one is better than none. Go to the Policies page if you want finer
                control over exactly which parameters or actions should be automatically blocked.
                Both of these run automatically once set; you don't need to check them manually.
              </p>
            </div>
          </Reveal>

          {/* Step 9 — Send a Real Test Request */}
          <Reveal delay={100}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal font-mono text-xs font-semibold text-primary-foreground">
                  09
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Step 9
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Step 9 — Send a Real Test Request
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                Run your agent, or the small script from Step 7, and trigger a real tool call. Watch
                what comes back: an ALLOW means it worked and your tool ran as normal, a DENY means
                AgentGuard blocked it and the exception will tell you why, and a PENDING means the
                action is now waiting for a human to approve it.
              </p>
            </div>
          </Reveal>

          {/* Step 10 — Watch It Happen in the Dashboard */}
          <Reveal delay={110}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal font-mono text-xs font-semibold text-primary-foreground">
                  10
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Step 10
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Step 10 — Watch It Happen in the Dashboard
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                Go back to the AgentGuard dashboard and open the Dashboard home screen — you'll see
                your request counted immediately. Open the Audit Vault to see the exact decision
                recorded permanently. If anything came back PENDING, open Approvals to review and
                approve it yourself.
              </p>
            </div>
          </Reveal>

          {/* You're Set Up */}
          <Reveal delay={120}>
            <div className="rounded-xl border border-border bg-sand/30 p-6 md:p-10 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-signal" />
                <span className="font-mono text-xs uppercase tracking-wider text-signal font-semibold">
                  Complete
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                You're Set Up
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                Your agent is now fully governed — every tool call it makes is checked, every
                decision is recorded, and nothing risky happens without either passing policy or
                getting a human's sign-off. From here, explore the SDK Setup page for the full
                exception reference, or the Integration page for connecting more than one agent.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  to="/sdk-setup"
                  className="inline-flex min-h-12 items-center justify-center rounded bg-signal px-6 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  See SDK Setup →
                </Link>
                <Link
                  to="/integration"
                  className="inline-flex min-h-12 items-center justify-center rounded border border-foreground/70 bg-card px-6 text-sm font-medium transition-colors hover:border-signal hover:text-signal"
                >
                  Integration details →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Continue to Next Section (When in story-scroll mode) */}
        {onScrollToNext && (
          <div className="mt-16 border-t border-border pt-10 text-center">
            <button
              type="button"
              onClick={onScrollToNext}
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-mono text-xs text-muted-foreground transition-all hover:border-signal hover:text-foreground hover:shadow-sm"
            >
              <span>Continue to Python SDK Setup</span>
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
