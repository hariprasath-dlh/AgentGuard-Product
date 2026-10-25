import { useState } from "react";
import { PageHeader, Reveal, CodeBlock } from "@/components/site/Reveal";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Terminal as TerminalIcon, Check, Copy } from "lucide-react";

const STEP1_CODE = `mkdir agentguard-quickstart
cd agentguard-quickstart`;

const STEP2_POWERSHELL = `python -m venv venv
.\\venv\\Scripts\\activate`;

const STEP2_BASH = `python3 -m venv venv
source venv/bin/activate`;

const STEP3_CMD = `pip install agentguard-governance-sdk`;

const STEP3_OUT = `Collecting agentguard-governance-sdk
  Downloading agentguard_governance_sdk-0.1.0-py3-none-any.whl (12 kB)
Collecting httpx>=0.24.0
  Downloading httpx-0.27.0-py3-none-any.whl (75 kB)
Collecting pydantic>=2.0.0
  Downloading pydantic-2.7.0-py3-none-any.whl (409 kB)
Installing collected packages: pydantic, httpx, agentguard-governance-sdk
Successfully installed agentguard-governance-sdk-0.1.0 httpx-0.27.0 pydantic-2.7.0`;

const STEP4_CMD = `python -c "import agentguard; print(agentguard.__version__)"`;

const STEP4_OUT = `0.1.0`;

const STEP5_SCRIPT = `from agentguard import (
    AgentGuard,
    AgentGuardDenied,
    AgentGuardPending,
)

client = AgentGuard(
    api_key="PASTE_YOUR_AGENT_API_KEY_HERE",
    base_url="https://agentguard-backend-zorh.onrender.com/api/v1",
)

result = client.guard(
    tool="read_customer",
    parameters={"customer_id": "123"},
)

print("Allowed:", result.allowed)
print("Decision:", result.decision)
print("Reason:", result.reason)`;

const STEP6_CMD = `python quickstart.py`;

const STEP6_OUT = `Allowed: True
Decision: ALLOW
Reason: All policy checks passed.`;

const DENIED_EXAMPLE_CODE = `try:
    client.guard(tool="delete_database", parameters={})
except AgentGuardDenied as e:
    print("Blocked:", e.reason)
except AgentGuardPending as e:
    print("Waiting for approval:", e.reason, "| request id:", e.request_id)`;

const DENIED_EXAMPLE_OUT = `Blocked: Tool 'delete_database' has risk level 'CRITICAL', which is denied by policy.`;

const BOOLEAN_MODE_CODE = `result = client.guard(
    tool="delete_database",
    parameters={},
    raise_for_status=False,
)

if result.allowed:
    run_the_tool()
else:
    print("Not allowed:", result.decision, "-", result.reason)`;

const CLIENT_REF = [
  { col1: "api_key", col2: "string", col3: "required", col4: "Your agent's API key" },
  {
    col1: "base_url",
    col2: "string",
    col3: "http://localhost:8000/api/v1",
    col4: "The AgentGuard backend to send requests to",
  },
  {
    col1: "agent_id",
    col2: "string",
    col3: "none",
    col4: "Your agent's ID, if not already tied to the key",
  },
  {
    col1: "timeout",
    col2: "number",
    col3: "5.0",
    col4: "Seconds to wait before giving up on a request",
  },
  {
    col1: "max_retries",
    col2: "number",
    col3: "1",
    col4: "How many times to retry a dropped connection",
  },
  {
    col1: "retry_backoff",
    col2: "number",
    col3: "0.2",
    col4: "Seconds to wait between retries",
  },
];

const GUARD_REF = [
  {
    col1: "tool",
    col2: "string",
    col3: "required",
    col4: "The name of the tool being called, exactly as registered in the dashboard",
  },
  {
    col1: "parameters",
    col2: "dict",
    col3: "{}",
    col4: "The actual arguments your tool call is using",
  },
  {
    col1: "estimated_tokens",
    col2: "number",
    col3: "0",
    col4: "Optional, for budget tracking",
  },
  {
    col1: "estimated_cost",
    col2: "number",
    col3: "0.0",
    col4: "Optional, for budget tracking",
  },
  {
    col1: "metadata",
    col2: "dict",
    col3: "none",
    col4: "Any extra context you want recorded with the decision",
  },
  {
    col1: "raise_for_status",
    col2: "boolean",
    col3: "true",
    col4: "Set to false to get a plain result object instead of an exception for denied or pending calls",
  },
];

const EXCEPTION_REF = [
  {
    ex: "AgentGuardDenied",
    when: "The action was blocked by policy",
    todo: "Don't retry it — read .reason to see why",
  },
  {
    ex: "AgentGuardPending",
    when: "The action needs human approval",
    todo: "Use .request_id to track it, and check back or poll later",
  },
  {
    ex: "AgentGuardAuthenticationError",
    when: "The API key is invalid or revoked",
    todo: "Check the key in your environment, or generate a new one",
  },
  {
    ex: "AgentGuardTimeout",
    when: "AgentGuard couldn't be reached in time",
    todo: "Check your network and the base_url you're using",
  },
  {
    ex: "AgentGuardServerError",
    when: "AgentGuard itself had an unexpected problem",
    todo: "Safe to retry later; this is not your agent's fault",
  },
];

function OutputBlock({
  output,
  label = "What you should see",
}: {
  output: string;
  label?: string;
}) {
  return (
    <div className="mt-3 overflow-hidden rounded-md border border-ink-line/80 bg-ink-soft shadow-xs">
      <div className="flex items-center justify-between border-b border-ink-line/70 bg-ink/80 px-4 py-2 font-mono text-[11px] text-on-ink-muted">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal" />
          <span className="font-medium text-on-ink">{label}</span>
        </div>
        <span className="rounded bg-ink px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-on-ink-muted">
          Output
        </span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-on-ink/90 whitespace-pre">
        <code>{output}</code>
      </pre>
    </div>
  );
}

function ReferenceTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: { col1: string; col2: string; col3: string; col4: string }[];
}) {
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-sand/30 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 font-mono text-xs">
          {rows.map((r, i) => (
            <tr key={i} className="transition-colors hover:bg-sand/15">
              <td className="px-4 py-3 font-semibold text-foreground">
                <code className="rounded bg-muted px-1.5 py-0.5 font-semibold text-foreground">
                  {r.col1}
                </code>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{r.col2}</td>
              <td className="px-4 py-3 font-mono text-signal">{r.col3}</td>
              <td className="px-4 py-3 font-sans text-xs text-muted-foreground md:text-sm">
                {r.col4}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExceptionTable({ rows }: { rows: { ex: string; when: string; todo: string }[] }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-sand/30 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-semibold">Exception</th>
            <th className="px-4 py-3 font-semibold">When it happens</th>
            <th className="px-4 py-3 font-semibold">What to do</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 text-xs">
          {rows.map((r, i) => (
            <tr key={i} className="transition-colors hover:bg-sand/15">
              <td className="px-4 py-3 font-mono font-semibold text-foreground">
                <code className="rounded bg-muted px-1.5 py-0.5 font-semibold text-foreground">
                  {r.ex}
                </code>
              </td>
              <td className="px-4 py-3 text-muted-foreground md:text-sm">{r.when}</td>
              <td className="px-4 py-3 font-medium text-foreground md:text-sm">{r.todo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const FULL_WINDOWS_QUICKSTART = `# ─────────────────────────────────────────────────────────────
# AgentGuard Python SDK — Windows Quickstart
# ─────────────────────────────────────────────────────────────

# 1. Create a new project folder

mkdir agentguard-quickstart

# Output:
#
# Directory: C:\\Users\\username
#
# Mode   LastWriteTime   Length Name
# ----   -------------   ------ ----
# d----- ...                    agentguard-quickstart


# 2. Move into the project folder

cd agentguard-quickstart

# Prompt:
#
# PS C:\\Users\\username\\agentguard-quickstart>


# 3. Create a Python virtual environment

python -m venv venv

# Output:
#
# No output
#
# The command completes successfully and creates the "venv" folder.


# 4. Activate the virtual environment

.\\venv\\Scripts\\Activate.ps1

# Prompt:
#
# (venv) PS C:\\Users\\username\\agentguard-quickstart>


# 5. Install the AgentGuard SDK

pip install agentguard-governance-sdk

# Output:
#
# Collecting agentguard-governance-sdk
# ...
# Successfully installed agentguard-governance-sdk-0.1.0
# ...
#
# (venv) PS C:\\Users\\username\\agentguard-quickstart>


# 6. Verify that the SDK can be imported

python -c "import agentguard; print('AgentGuard SDK import successful')"

# Output:
#
# AgentGuard SDK import successful


# 7. Set your AgentGuard API key
#
# Replace <YOUR_API_KEY> with the API key created in AgentGuard.
# Do NOT commit this value to source control.

$env:AGENTGUARD_API_KEY="<YOUR_API_KEY>"

# Output:
#
# No output


# 8. Create a minimal AgentGuard example

@'
import os
from agentguard import AgentGuard

client = AgentGuard(
    api_key=os.environ["AGENTGUARD_API_KEY"],
    base_url="https://agentguard-backend-zorh.onrender.com/api/v1",
)

result = client.guard(
    "demo_tool",
    {"message": "hello"},
)

print(f"Allowed: {result.allowed}")
print(f"Decision: {result.decision}")
print(f"Reason: {result.reason}")
'@ | Set-Content agent.py

# Output:
#
# No output


# 9. Run the governed tool call

python agent.py

# Successful output:
#
# Allowed: True
# Decision: <decision returned by AgentGuard>
# Reason: <reason returned by AgentGuard>


# The agent proposes the tool call.
# AgentGuard evaluates it before execution.
# The tool is allowed to proceed only when AgentGuard returns ALLOW.`;

function SdkTerminalPreview() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 2000);
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#0c0d12] font-mono text-xs sm:text-[13px] text-zinc-300 select-text">
      {/* Terminal Title Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-ink-line/80 bg-[#14151e] px-3 sm:px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
          </div>
          <span className="ml-2 font-mono text-[11px] text-zinc-400">
            Windows PowerShell — Windows Quickstart
          </span>
        </div>

        {/* Legend & Full Copy Action */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-3 text-[10px] text-zinc-400 mr-2">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Command
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Placeholder
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleCopy("all", FULL_WINDOWS_QUICKSTART)}
            className="flex items-center gap-1.5 rounded border border-ink-line bg-[#1f202b] px-2.5 py-1 text-[11px] font-medium text-zinc-200 transition-colors hover:border-signal/50 hover:bg-[#282a38] hover:text-white"
            title="Copy full quickstart script"
          >
            {copiedKey === "all" ? (
              <>
                <Check className="h-3 w-3 text-allow" />
                <span className="text-allow font-semibold">Quickstart Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 text-zinc-400" />
                <span>Copy All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Terminal Main Content Body */}
      <div className="relative flex-1 overflow-y-auto p-4 sm:p-6 text-left leading-relaxed space-y-6">
        {/* Header Banner */}
        <div className="text-zinc-500 font-mono text-xs sm:text-[13px] leading-tight">
          <div># ─────────────────────────────────────────────────────────────</div>
          <div className="text-zinc-300 font-semibold py-0.5">
            # AgentGuard Python SDK — Windows Quickstart
          </div>
          <div># ─────────────────────────────────────────────────────────────</div>
        </div>

        {/* 1. Create a new project folder */}
        <div className="space-y-2">
          <div className="text-zinc-400"># 1. Create a new project folder</div>
          <div className="group flex items-center justify-between gap-3 rounded-md bg-[#13151f] border border-ink-line/80 px-3 py-2">
            <span className="text-emerald-400 font-bold tracking-wide">
              mkdir agentguard-quickstart
            </span>
            <button
              type="button"
              onClick={() => handleCopy("cmd1", "mkdir agentguard-quickstart")}
              className="flex items-center gap-1 rounded bg-[#1e202d] border border-ink-line px-2 py-0.5 text-[11px] text-zinc-400 hover:text-white transition-colors"
              title="Copy command"
            >
              {copiedKey === "cmd1" ? (
                <>
                  <Check className="h-3 w-3 text-allow" />
                  <span className="text-allow font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="text-zinc-400 text-[11px] sm:text-xs pl-1 space-y-0.5">
            <div># Output:</div>
            <div>#</div>
            <div>
              # Directory: C:\Users\
              <span className="inline-block rounded border border-amber-400/40 bg-amber-400/15 px-1 py-0.2 font-mono text-amber-300 font-semibold">
                username
              </span>
            </div>
            <div>#</div>
            <div># Mode LastWriteTime Length Name</div>
            <div># ---- ------------- ------ ----</div>
            <div># d----- ... agentguard-quickstart</div>
          </div>
        </div>

        {/* 2. Move into the project folder */}
        <div className="space-y-2">
          <div className="text-zinc-400"># 2. Move into the project folder</div>
          <div className="group flex items-center justify-between gap-3 rounded-md bg-[#13151f] border border-ink-line/80 px-3 py-2">
            <span className="text-emerald-400 font-bold tracking-wide">
              cd agentguard-quickstart
            </span>
            <button
              type="button"
              onClick={() => handleCopy("cmd2", "cd agentguard-quickstart")}
              className="flex items-center gap-1 rounded bg-[#1e202d] border border-ink-line px-2 py-0.5 text-[11px] text-zinc-400 hover:text-white transition-colors"
              title="Copy command"
            >
              {copiedKey === "cmd2" ? (
                <>
                  <Check className="h-3 w-3 text-allow" />
                  <span className="text-allow font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="text-zinc-400 text-[11px] sm:text-xs pl-1 space-y-0.5">
            <div># Prompt:</div>
            <div>#</div>
            <div>
              # PS C:\Users\
              <span className="inline-block rounded border border-amber-400/40 bg-amber-400/15 px-1 py-0.2 font-mono text-amber-300 font-semibold">
                username
              </span>
              \agentguard-quickstart&gt;
            </div>
          </div>
        </div>

        {/* 3. Create a Python virtual environment */}
        <div className="space-y-2">
          <div className="text-zinc-400"># 3. Create a Python virtual environment</div>
          <div className="group flex items-center justify-between gap-3 rounded-md bg-[#13151f] border border-ink-line/80 px-3 py-2">
            <span className="text-emerald-400 font-bold tracking-wide">python -m venv venv</span>
            <button
              type="button"
              onClick={() => handleCopy("cmd3", "python -m venv venv")}
              className="flex items-center gap-1 rounded bg-[#1e202d] border border-ink-line px-2 py-0.5 text-[11px] text-zinc-400 hover:text-white transition-colors"
              title="Copy command"
            >
              {copiedKey === "cmd3" ? (
                <>
                  <Check className="h-3 w-3 text-allow" />
                  <span className="text-allow font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="text-zinc-400 text-[11px] sm:text-xs pl-1 space-y-0.5">
            <div># Output:</div>
            <div>#</div>
            <div># No output</div>
            <div>#</div>
            <div># The command completes successfully and creates the &quot;venv&quot; folder.</div>
          </div>
        </div>

        {/* 4. Activate the virtual environment */}
        <div className="space-y-2">
          <div className="text-zinc-400"># 4. Activate the virtual environment</div>
          <div className="group flex items-center justify-between gap-3 rounded-md bg-[#13151f] border border-ink-line/80 px-3 py-2">
            <span className="text-emerald-400 font-bold tracking-wide">
              .\venv\Scripts\Activate.ps1
            </span>
            <button
              type="button"
              onClick={() => handleCopy("cmd4", ".\\venv\\Scripts\\Activate.ps1")}
              className="flex items-center gap-1 rounded bg-[#1e202d] border border-ink-line px-2 py-0.5 text-[11px] text-zinc-400 hover:text-white transition-colors"
              title="Copy command"
            >
              {copiedKey === "cmd4" ? (
                <>
                  <Check className="h-3 w-3 text-allow" />
                  <span className="text-allow font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="text-zinc-400 text-[11px] sm:text-xs pl-1 space-y-0.5">
            <div># Prompt:</div>
            <div>#</div>
            <div>
              # (venv) PS C:\Users\
              <span className="inline-block rounded border border-amber-400/40 bg-amber-400/15 px-1 py-0.2 font-mono text-amber-300 font-semibold">
                username
              </span>
              \agentguard-quickstart&gt;
            </div>
          </div>
        </div>

        {/* 5. Install the AgentGuard SDK */}
        <div className="space-y-2">
          <div className="text-zinc-400"># 5. Install the AgentGuard SDK</div>
          <div className="group flex items-center justify-between gap-3 rounded-md bg-[#13151f] border border-ink-line/80 px-3 py-2">
            <span className="text-emerald-400 font-bold tracking-wide">
              pip install agentguard-governance-sdk
            </span>
            <button
              type="button"
              onClick={() => handleCopy("cmd5", "pip install agentguard-governance-sdk")}
              className="flex items-center gap-1 rounded bg-[#1e202d] border border-ink-line px-2 py-0.5 text-[11px] text-zinc-400 hover:text-white transition-colors"
              title="Copy command"
            >
              {copiedKey === "cmd5" ? (
                <>
                  <Check className="h-3 w-3 text-allow" />
                  <span className="text-allow font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="text-zinc-400 text-[11px] sm:text-xs pl-1 space-y-0.5">
            <div># Output:</div>
            <div>#</div>
            <div># Collecting agentguard-governance-sdk</div>
            <div># ...</div>
            <div># Successfully installed agentguard-governance-sdk-0.1.0</div>
            <div># ...</div>
            <div>#</div>
            <div>
              # (venv) PS C:\Users\
              <span className="inline-block rounded border border-amber-400/40 bg-amber-400/15 px-1 py-0.2 font-mono text-amber-300 font-semibold">
                username
              </span>
              \agentguard-quickstart&gt;
            </div>
          </div>
        </div>

        {/* 6. Verify that the SDK can be imported */}
        <div className="space-y-2">
          <div className="text-zinc-400"># 6. Verify that the SDK can be imported</div>
          <div className="group flex items-center justify-between gap-3 rounded-md bg-[#13151f] border border-ink-line/80 px-3 py-2">
            <span className="text-emerald-400 font-bold tracking-wide break-all">
              python -c &quot;import agentguard; print(&apos;AgentGuard SDK import
              successful&apos;)&quot;
            </span>
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  "cmd6",
                  "python -c \"import agentguard; print('AgentGuard SDK import successful')\"",
                )
              }
              className="flex shrink-0 items-center gap-1 rounded bg-[#1e202d] border border-ink-line px-2 py-0.5 text-[11px] text-zinc-400 hover:text-white transition-colors"
              title="Copy command"
            >
              {copiedKey === "cmd6" ? (
                <>
                  <Check className="h-3 w-3 text-allow" />
                  <span className="text-allow font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="text-zinc-400 text-[11px] sm:text-xs pl-1 space-y-0.5">
            <div># Output:</div>
            <div>#</div>
            <div className="text-signal font-semibold"># AgentGuard SDK import successful</div>
          </div>
        </div>

        {/* 7. Set your AgentGuard API key */}
        <div className="space-y-2">
          <div className="text-zinc-400"># 7. Set your AgentGuard API key</div>
          <div className="text-zinc-400 text-[11px] sm:text-xs pl-1 space-y-0.5">
            <div>
              # Replace{" "}
              <span className="inline-block rounded border border-amber-400/40 bg-amber-400/15 px-1.5 py-0.2 font-mono text-amber-300 font-semibold">
                &lt;YOUR_API_KEY&gt;
              </span>{" "}
              with the API key created in AgentGuard.
            </div>
            <div># Do NOT commit this value to source control.</div>
          </div>
          <div className="group flex items-center justify-between gap-3 rounded-md bg-[#13151f] border border-ink-line/80 px-3 py-2">
            <div className="text-emerald-400 font-bold tracking-wide">
              $env:AGENTGUARD_API_KEY=&quot;
              <span className="inline-block rounded border border-amber-400/40 bg-amber-400/15 px-1.5 py-0.2 font-mono text-amber-300 font-semibold">
                &lt;YOUR_API_KEY&gt;
              </span>
              &quot;
            </div>
            <button
              type="button"
              onClick={() => handleCopy("cmd7", '$env:AGENTGUARD_API_KEY="<YOUR_API_KEY>"')}
              className="flex shrink-0 items-center gap-1 rounded bg-[#1e202d] border border-ink-line px-2 py-0.5 text-[11px] text-zinc-400 hover:text-white transition-colors"
              title="Copy command"
            >
              {copiedKey === "cmd7" ? (
                <>
                  <Check className="h-3 w-3 text-allow" />
                  <span className="text-allow font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="text-zinc-400 text-[11px] sm:text-xs pl-1 space-y-0.5">
            <div># Output:</div>
            <div>#</div>
            <div># No output</div>
          </div>
        </div>

        {/* 8. Create a minimal AgentGuard example */}
        <div className="space-y-2">
          <div className="text-zinc-400"># 8. Create a minimal AgentGuard example</div>
          <div className="relative rounded-md bg-[#13151f] border border-ink-line/80 p-3">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-ink-line/60">
              <span className="text-zinc-400 text-[11px]">PowerShell Script Block</span>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    "cmd8",
                    `@'\nimport os\nfrom agentguard import AgentGuard\n\nclient = AgentGuard(\n    api_key=os.environ["AGENTGUARD_API_KEY"],\n    base_url="https://agentguard-backend-zorh.onrender.com/api/v1",\n)\n\nresult = client.guard(\n    "demo_tool",\n    {"message": "hello"},\n)\n\nprint(f"Allowed: {result.allowed}")\nprint(f"Decision: {result.decision}")\nprint(f"Reason: {result.reason}")\n'@ | Set-Content agent.py`,
                  )
                }
                className="flex items-center gap-1 rounded bg-[#1e202d] border border-ink-line px-2 py-0.5 text-[11px] text-zinc-400 hover:text-white transition-colors"
                title="Copy script"
              >
                {copiedKey === "cmd8" ? (
                  <>
                    <Check className="h-3 w-3 text-allow" />
                    <span className="text-allow font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-emerald-400 font-mono text-[11.5px] sm:text-xs leading-relaxed overflow-x-auto whitespace-pre">
              <code>{`@'
import os
from agentguard import AgentGuard

client = AgentGuard(
    api_key=os.environ["AGENTGUARD_API_KEY"],
    base_url="https://agentguard-backend-zorh.onrender.com/api/v1",
)

result = client.guard(
    "demo_tool",
    {"message": "hello"},
)

print(f"Allowed: {result.allowed}")
print(f"Decision: {result.decision}")
print(f"Reason: {result.reason}")
'@ | Set-Content agent.py`}</code>
            </pre>
          </div>
          <div className="text-zinc-400 text-[11px] sm:text-xs pl-1 space-y-0.5">
            <div># Output:</div>
            <div>#</div>
            <div># No output</div>
          </div>
        </div>

        {/* 9. Run the governed tool call */}
        <div className="space-y-2">
          <div className="text-zinc-400"># 9. Run the governed tool call</div>
          <div className="group flex items-center justify-between gap-3 rounded-md bg-[#13151f] border border-ink-line/80 px-3 py-2">
            <span className="text-emerald-400 font-bold tracking-wide">python agent.py</span>
            <button
              type="button"
              onClick={() => handleCopy("cmd9", "python agent.py")}
              className="flex items-center gap-1 rounded bg-[#1e202d] border border-ink-line px-2 py-0.5 text-[11px] text-zinc-400 hover:text-white transition-colors"
              title="Copy command"
            >
              {copiedKey === "cmd9" ? (
                <>
                  <Check className="h-3 w-3 text-allow" />
                  <span className="text-allow font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="text-zinc-400 text-[11px] sm:text-xs pl-1 space-y-1">
            <div># Successful output:</div>
            <div>#</div>
            <div className="text-zinc-200">
              # Allowed: <span className="text-allow font-bold">True</span>
            </div>
            <div className="text-zinc-200">
              # Decision:{" "}
              <span className="inline-block rounded border border-amber-400/40 bg-amber-400/15 px-1.5 py-0.2 font-mono text-amber-300 font-semibold">
                &lt;decision returned by AgentGuard&gt;
              </span>
            </div>
            <div className="text-zinc-200">
              # Reason:{" "}
              <span className="inline-block rounded border border-amber-400/40 bg-amber-400/15 px-1.5 py-0.2 font-mono text-amber-300 font-semibold">
                &lt;reason returned by AgentGuard&gt;
              </span>
            </div>
          </div>
        </div>

        {/* Summary Footer Comments */}
        <div className="pt-4 border-t border-ink-line/60 text-zinc-400 font-mono text-xs sm:text-[13px] leading-relaxed space-y-1">
          <div># The agent proposes the tool call.</div>
          <div># AgentGuard evaluates it before execution.</div>
          <div className="text-signal font-medium">
            # The tool is allowed to proceed only when AgentGuard returns ALLOW.
          </div>
        </div>
      </div>

      {/* Terminal Footer Status Bar */}
      <div className="flex flex-wrap items-center justify-between border-t border-ink-line/80 bg-[#14151e] px-3 sm:px-4 py-2 text-[11px] text-zinc-400">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-3.5 w-3.5 text-signal" />
          <span>Windows PowerShell 7.4 (venv active)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">9/9 Steps Complete</span>
          <span className="text-signal font-medium">Encoding: UTF-8</span>
        </div>
      </div>
    </div>
  );
}

export function SdkSetupSection({ onScrollToNext }: { onScrollToNext?: () => void }) {
  return (
    <div className="w-full bg-background text-foreground">
      {/* Top Banner Tag */}
      <div className="border-b border-border bg-sand/30 py-4 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <span className="text-signal">04</span> / 06 — Python SDK Setup
      </div>

      {/* Page Intro Header */}
      <PageHeader
        eyebrow="SDK SETUP"
        title="Install the AgentGuard Python SDK and make your first governed request."
        intro="This page shows the complete terminal journey — from an empty folder to a working, governed agent — including exactly what you should see printed back at every step."
      />

      {/* Container Scroll Animation */}
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center">
            <span className="eyebrow mb-2">Live SDK Execution</span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              From Empty Folder to <br className="hidden sm:inline" />
              <span className="text-signal">Governed Agent</span>
            </h2>
            <p className="mt-3 max-w-2xl text-xs sm:text-base text-muted-foreground md:text-lg">
              Scroll down to watch the Python SDK initialize, execute tool calls, and receive
              verified ALLOW decisions in real time.
            </p>
          </div>
        }
      >
        <SdkTerminalPreview />
      </ContainerScroll>

      {/* Subtopics Detailed Breakdown */}
      <section className="container-ag max-w-5xl py-16 md:py-24">
        <div className="space-y-12 md:space-y-16">
          {/* What This SDK Does */}
          <Reveal>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <span className="inline-block h-2 w-2 rounded-full bg-signal" />
                <span className="font-mono text-xs font-medium uppercase tracking-wider text-signal">
                  Overview
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                What This SDK Does
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                The agentguard-governance-sdk package is a small Python library that sends your
                agent's intended tool calls to AgentGuard and turns the response into something your
                code can act on directly — a clean result object for approved actions, and a
                specific, catchable exception for anything denied, pending, or failed. It has two
                dependencies, httpx and pydantic, and nothing else.
              </p>
            </div>
          </Reveal>

          {/* Requirements */}
          <Reveal delay={20}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <span className="inline-block h-2 w-2 rounded-full bg-signal" />
                <span className="font-mono text-xs font-medium uppercase tracking-wider text-signal">
                  Prerequisites
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Requirements
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                Python 3.9 or newer, pip, and a terminal. You'll also need an agent already
                registered in the AgentGuard dashboard and its one-time API key from the Getting
                Started page. Everything below assumes you're starting from a completely empty
                folder.
              </p>
            </div>
          </Reveal>

          {/* Step 1 — Create a Clean Project Folder */}
          <Reveal delay={30}>
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
                Step 1 — Create a Clean Project Folder
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                Open your terminal and create a new folder to work in, then move into it:
              </p>
              <div className="mt-4">
                <CodeBlock code={STEP1_CODE} label="Terminal" copyable={true} />
              </div>
            </div>
          </Reveal>

          {/* Step 2 — Create and Activate a Virtual Environment */}
          <Reveal delay={40}>
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
                Step 2 — Create and Activate a Virtual Environment
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                A virtual environment keeps this package isolated from anything else on your
                machine.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="font-mono text-xs font-semibold text-foreground">
                    On Windows (PowerShell):
                  </p>
                  <div className="mt-2">
                    <CodeBlock code={STEP2_POWERSHELL} label="PowerShell" copyable={true} />
                  </div>
                </div>

                <div>
                  <p className="font-mono text-xs font-semibold text-foreground">
                    On macOS / Linux:
                  </p>
                  <div className="mt-2">
                    <CodeBlock code={STEP2_BASH} label="Bash / Zsh" copyable={true} />
                  </div>
                </div>
              </div>

              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                You'll know it worked when you see{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground">
                  (venv)
                </code>{" "}
                appear at the start of your terminal prompt.
              </p>
            </div>
          </Reveal>

          {/* Step 3 — Install the Package */}
          <Reveal delay={50}>
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
                Step 3 — Install the Package
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                With your virtual environment active, run:
              </p>
              <div className="mt-4">
                <CodeBlock code={STEP3_CMD} label="Terminal" copyable={true} />
              </div>
              <div className="mt-4">
                <p className="font-mono text-xs font-semibold text-foreground">
                  What you should see:
                </p>
                <OutputBlock output={STEP3_OUT} label="pip install output" />
              </div>
            </div>
          </Reveal>

          {/* Step 4 — Confirm the Installation */}
          <Reveal delay={60}>
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
                Step 4 — Confirm the Installation
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                Run this one-line check:
              </p>
              <div className="mt-4">
                <CodeBlock code={STEP4_CMD} label="Terminal" copyable={true} />
              </div>
              <div className="mt-4">
                <p className="font-mono text-xs font-semibold text-foreground">
                  What you should see:
                </p>
                <OutputBlock output={STEP4_OUT} label="Version Output" />
              </div>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                If you see a version number printed with no errors, the package installed correctly
                and is ready to use.
              </p>
            </div>
          </Reveal>

          {/* Step 5 — Write Your First Script */}
          <Reveal delay={70}>
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
                Step 5 — Write Your First Script
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                Create a new file in the same folder called{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground">
                  quickstart.py
                </code>{" "}
                with this content:
              </p>
              <div className="mt-4">
                <CodeBlock code={STEP5_SCRIPT} label="quickstart.py" copyable={true} />
              </div>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                Replace the placeholder with the real API key you saved when you registered your
                agent.
              </p>
            </div>
          </Reveal>

          {/* Step 6 — Run It and Read the Output */}
          <Reveal delay={80}>
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
                Step 6 — Run It and Read the Output
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                Run the script:
              </p>
              <div className="mt-4">
                <CodeBlock code={STEP6_CMD} label="Terminal" copyable={true} />
              </div>
              <div className="mt-4">
                <p className="font-mono text-xs font-semibold text-foreground">
                  If the tool call is approved, you'll see:
                </p>
                <OutputBlock output={STEP6_OUT} label="Execution Output" />
              </div>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                That's it — your agent's action was sent to AgentGuard, checked against real policy,
                and approved, all in one call.
              </p>
            </div>
          </Reveal>

          {/* Trying a Denied or Pending Action */}
          <Reveal delay={90}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <span className="inline-block h-2 w-2 rounded-full bg-deny" />
                <span className="font-mono text-xs font-medium uppercase tracking-wider text-deny">
                  Handling Exceptions
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Trying a Denied or Pending Action
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                Change the{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground">
                  tool
                </code>{" "}
                value in your script to something risky, like{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground">
                  "delete_database"
                </code>
                , and run it again. Instead of printing a result, your program will raise an
                exception — this is intentional, so you can't accidentally ignore a blocked action:
              </p>
              <div className="mt-4">
                <CodeBlock
                  code={DENIED_EXAMPLE_CODE}
                  label="exception_handling.py"
                  copyable={true}
                />
              </div>
              <div className="mt-4">
                <p className="font-mono text-xs font-semibold text-foreground">
                  Example output for a denied action:
                </p>
                <OutputBlock output={DENIED_EXAMPLE_OUT} label="Denied Exception Output" />
              </div>
            </div>
          </Reveal>

          {/* Full Client Reference */}
          <Reveal delay={100}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <span className="inline-block h-2 w-2 rounded-full bg-signal" />
                <span className="font-mono text-xs font-medium uppercase tracking-wider text-signal">
                  API Reference
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Full Client Reference
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                Table of every option available when creating a client:
              </p>
              <ReferenceTable
                headers={["Parameter", "Type", "Default", "What it does"]}
                rows={CLIENT_REF}
              />
            </div>
          </Reveal>

          {/* Full guard() Method Reference */}
          <Reveal delay={110}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <span className="inline-block h-2 w-2 rounded-full bg-signal" />
                <span className="font-mono text-xs font-medium uppercase tracking-wider text-signal">
                  API Reference
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Full guard() Method Reference
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                Table of every option available on each governed call:
              </p>
              <ReferenceTable
                headers={["Parameter", "Type", "Default", "What it does"]}
                rows={GUARD_REF}
              />
            </div>
          </Reveal>

          {/* Exception Reference */}
          <Reveal delay={120}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <span className="inline-block h-2 w-2 rounded-full bg-signal" />
                <span className="font-mono text-xs font-medium uppercase tracking-wider text-signal">
                  Error Handling
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Exception Reference
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                What each exception means and what to do about it:
              </p>
              <ExceptionTable rows={EXCEPTION_REF} />
            </div>
          </Reveal>

          {/* Using the Boolean Mode Instead of Exceptions */}
          <Reveal delay={130}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <span className="inline-block h-2 w-2 rounded-full bg-signal" />
                <span className="font-mono text-xs font-medium uppercase tracking-wider text-signal">
                  Alternative Flow
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Using the Boolean Mode Instead of Exceptions
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                If you'd rather check a simple true/false than catch exceptions, pass{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground">
                  raise_for_status=False
                </code>
                :
              </p>
              <div className="mt-4">
                <CodeBlock code={BOOLEAN_MODE_CODE} label="boolean_mode.py" copyable={true} />
              </div>
            </div>
          </Reveal>

          {/* Where to Run This */}
          <Reveal delay={140}>
            <div className="rounded-xl border border-border bg-sand/30 p-6 md:p-10 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-signal" />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-signal">
                  Deployment
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                Where to Run This
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                This script can run anywhere Python runs — your own laptop, inside your existing
                agent's codebase, in a scheduled job, or inside a container. The only requirement is
                that it can reach the AgentGuard backend URL you configure. For local development
                against your own running backend, use{" "}
                <code className="rounded bg-background px-2 py-0.5 font-mono text-xs font-semibold text-foreground border border-border">
                  http://localhost:8000/api/v1
                </code>{" "}
                instead of the hosted URL shown above.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Continue scroll to Next Section */}
        {onScrollToNext && (
          <div className="mt-16 border-t border-border pt-10 text-center">
            <button
              type="button"
              onClick={onScrollToNext}
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-mono text-xs text-muted-foreground transition-all hover:border-signal hover:text-foreground hover:shadow-sm"
            >
              <span>Continue scroll to Integration</span>
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
