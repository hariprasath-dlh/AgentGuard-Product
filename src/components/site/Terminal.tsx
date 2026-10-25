import { useEffect, useRef, useState } from "react";

export interface PowerShellTermLine {
  kind: "banner" | "empty" | "cmd" | "out" | "ok" | "decision";
  text: string;
}

export const POWERSHELL_TERMINAL: PowerShellTermLine[] = [
  { kind: "banner", text: "Windows PowerShell" },
  { kind: "banner", text: "Copyright (C) Microsoft Corporation. All rights reserved." },
  { kind: "empty", text: "" },
  {
    kind: "cmd",
    text: "PS C:\\Users\\User_name> mkdir agentguard-quickstart; cd agentguard-quickstart",
  },
  { kind: "cmd", text: "PS C:\\Users\\User_name\\agentguard-quickstart> python -m venv venv" },
  {
    kind: "cmd",
    text: "PS C:\\Users\\User_name\\agentguard-quickstart> .\\venv\\Scripts\\activate",
  },
  {
    kind: "cmd",
    text: "(venv) PS C:\\Users\\User_name\\agentguard-quickstart> pip install agentguard-governance-sdk",
  },
  { kind: "out", text: "Collecting agentguard-governance-sdk (0.1.0)" },
  {
    kind: "out",
    text: "Installing collected packages: pydantic, httpx, agentguard-governance-sdk",
  },
  { kind: "ok", text: "Successfully installed agentguard-governance-sdk-0.1.0" },
  { kind: "cmd", text: 'python -c "import agentguard; print(agentguard.__version__)"' },
  { kind: "ok", text: "0.1.0" },
  { kind: "cmd", text: "python quickstart.py" },
  { kind: "ok", text: "Allowed: True" },
  { kind: "decision", text: "Decision: ALLOW" },
  { kind: "out", text: "Reason: All policy checks passed." },
];

/** Scroll-driven terminal: progress through the tall section reveals lines in order. */
export function ScrollTerminal() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setP(1);
      return;
    }
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      setP(Math.min(1, Math.max(0, -r.top / (total || 1))));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const totalLines = POWERSHELL_TERMINAL.length;
  const units = p * totalLines * 1.05;
  const full = Math.floor(units);
  const partial = units - full;
  const state = full >= 13 ? "governed" : full >= 10 ? "verify" : full >= 6 ? "install" : "setup";

  return (
    <div ref={ref} className="relative h-[250vh]">
      <div className="sticky top-16 flex min-h-[calc(100vh-4rem)] items-center py-8">
        <div className="container-ag grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="eyebrow">Scroll to run</p>
            <div className="mt-5 space-y-3">
              {[
                ["setup", "Create project folder & activate venv"],
                ["install", "Install agentguard-governance-sdk"],
                ["verify", "Confirm installation (v0.1.0)"],
                ["governed", "Execute governed request (Decision: ALLOW)"],
              ].map(([k, label]) => {
                const order = ["setup", "install", "verify", "governed"];
                const on = order.indexOf(state) >= order.indexOf(k as string);
                return (
                  <div key={k} className="flex items-center gap-3">
                    <span
                      className={`h-2 w-2 rounded-full transition-colors ${on ? "bg-signal" : "bg-border"}`}
                    />
                    <span
                      className={`text-sm transition-colors ${on ? "text-foreground font-medium" : "text-muted-foreground"}`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 h-px w-full bg-border">
              <div className="h-px bg-signal" style={{ width: `${p * 100}%` }} />
            </div>
          </div>

          <div className="[perspective:1600px]">
            <div className="rounded-lg border border-ink-line bg-ink shadow-[0_40px_80px_-40px_oklch(0.17_0.006_60/0.6)] transition-transform duration-500 lg:[transform:rotateY(-9deg)_rotateX(4deg)]">
              <div className="flex items-center gap-2 border-b border-ink-line px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-ink-line" />
                <span className="h-2.5 w-2.5 rounded-full bg-ink-line" />
                <span className="h-2.5 w-2.5 rounded-full bg-ink-line" />
                <span className="ml-3 font-mono text-[11px] text-on-ink-muted">
                  Windows PowerShell — PS C:\Users\User_name
                </span>
                <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-signal">
                  {state}
                </span>
              </div>
              <div className="min-h-[380px] overflow-x-auto p-4 font-mono text-[12px] leading-6 sm:text-[12.5px]">
                {POWERSHELL_TERMINAL.map((l, k) => {
                  if (k > full) return null;
                  const text =
                    k === full ? l.text.slice(0, Math.ceil(l.text.length * partial)) : l.text;
                  const typing = k === full;

                  if (l.kind === "empty") {
                    return <div key={k} className="h-2" />;
                  }

                  return (
                    <div key={k} className="whitespace-pre-wrap break-words">
                      {l.kind === "banner" && <span className="text-on-ink-muted/80">{text}</span>}
                      {l.kind === "cmd" && (
                        <span className="text-on-ink font-semibold">{text}</span>
                      )}
                      {l.kind === "out" && <span className="text-on-ink-muted">{text}</span>}
                      {l.kind === "ok" && <span className="text-signal">{text}</span>}
                      {l.kind === "decision" && (
                        <span className="inline-block rounded-xs border border-allow bg-allow/10 px-1.5 py-0.5 font-bold text-allow">
                          {text}
                        </span>
                      )}
                      {typing && (
                        <span className="caret ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-signal" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">
              Windows PowerShell terminal flow with real SDK v0.1.0 output.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
