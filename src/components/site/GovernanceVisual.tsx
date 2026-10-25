import { useEffect, useState } from "react";

type Status = "ALLOW" | "DENY" | "PENDING";
const SCENARIOS: {
  tool: string;
  args: string;
  status: Status;
  label: string;
  rule: string;
  failAt: number;
}[] = [
  {
    tool: "send_payment",
    args: "amount=1200",
    status: "PENDING",
    label: "PENDING — awaiting approval",
    rule: "requires human approval",
    failAt: 3,
  },
  {
    tool: "delete_user",
    args: "id=4471",
    status: "DENY",
    label: "DENIED",
    rule: "blocked by risk policy",
    failAt: 3,
  },
  {
    tool: "read_customer",
    args: "id=88",
    status: "ALLOW",
    label: "ALLOWED",
    rule: "role:support may read_customer",
    failAt: -1,
  },
];
const CHECKS = ["auth", "rbac", "policy", "risk", "budget"];
const TOTAL = CHECKS.length + 5; // checks + resolve + hold

const tone = (s: Status) =>
  s === "ALLOW"
    ? "text-allow border-allow"
    : s === "DENY"
      ? "text-deny border-deny"
      : "text-pending border-pending";

/** Animated decision trace: request flows agent → AgentGuard checks → outcome. */
export function GovernanceVisual() {
  const [i, setI] = useState(1);
  const [step, setStep] = useState(TOTAL);
  const [hold, setHold] = useState(false);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (!mq.matches) {
      setI(0);
      setStep(0);
    }
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => {
      setStep((s) => {
        if (s < TOTAL) return s + 1;
        if (hold) return s;
        setI((x) => (x + 1) % SCENARIOS.length);
        return 0;
      });
    }, 450);
    return () => clearInterval(t);
  }, [hold, reduced]);

  const sc = SCENARIOS[i]!;
  const stopAt = sc.failAt < 0 ? CHECKS.length : sc.failAt + 1;
  const done = step > stopAt;
  const executes = done && sc.status === "ALLOW";

  const checkState = (k: number) => {
    if (step <= k || k >= stopAt) return "idle";
    if (k === sc.failAt) return sc.status === "DENY" ? "fail" : "hold";
    return "pass";
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-ink-line bg-ink p-5 text-on-ink grid-lines-ink md:p-7">
      <div className="flex items-center justify-between font-mono text-[11px] text-on-ink-muted">
        <span>runtime / decision trace</span>
        <span className="flex items-center gap-2">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-signal" />
          {reduced ? "example" : "live"}
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_1.3fr_auto_1fr] md:items-center">
        <div className="rounded border border-ink-line bg-ink-soft p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-on-ink-muted">
            AI Agent · proposes
          </p>
          <p key={sc.tool} className="page-enter mt-2 break-words font-mono text-sm">
            {sc.tool}(<span className="text-on-ink-muted">{sc.args}</span>)
          </p>
        </div>
        <Connector active={step > 0} />
        <div className="rounded border border-signal/60 bg-ink-soft p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-signal">
            AgentGuard · decides
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {CHECKS.map((c, k) => {
              const st = checkState(k);
              const cls =
                st === "pass"
                  ? "border-signal text-signal"
                  : st === "fail"
                    ? "border-deny text-deny"
                    : st === "hold"
                      ? "border-pending text-pending"
                      : "border-ink-line text-on-ink-muted";
              const mark = st === "pass" ? "✓ " : st === "fail" ? "✕ " : st === "hold" ? "! " : "";
              return (
                <span
                  key={c}
                  className={`rounded-sm border px-1.5 py-0.5 font-mono text-[10.5px] transition-colors duration-300 ${cls}`}
                >
                  {mark}
                  {c}
                </span>
              );
            })}
          </div>
          <p className="mt-4 min-h-5 font-mono text-[11px] text-on-ink-muted">
            {done ? (
              <span className={tone(sc.status).split(" ")[0]}>→ {sc.status}</span>
            ) : (
              "evaluating…"
            )}
          </p>
        </div>
        <Connector active={done} tone={done ? sc.status : undefined} />
        <div
          className={`rounded border p-4 transition-colors duration-300 ${done ? `${tone(sc.status)} bg-ink-soft` : "border-dashed border-ink-line"}`}
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-on-ink-muted">
            Outcome
          </p>
          {done ? (
            <div key={sc.tool} className="page-enter">
              <p className={`mt-2 font-mono text-sm ${tone(sc.status).split(" ")[0]}`}>
                {sc.label}
              </p>
              <p className="mt-2 inline-block rounded-sm border border-ink-line px-1.5 py-0.5 font-mono text-[10px] text-on-ink-muted">
                {sc.rule}
              </p>
              <p className="mt-2 font-mono text-[10.5px] text-on-ink-muted">
                {executes ? "tool executed" : "tool not called"}
              </p>
            </div>
          ) : (
            <p className="mt-2 font-mono text-sm text-on-ink-muted">waiting</p>
          )}
        </div>
      </div>

      <div
        className="mt-6 flex flex-wrap gap-2 border-t border-ink-line pt-4"
        onMouseLeave={() => setHold(false)}
      >
        {SCENARIOS.map((s, k) => (
          <button
            key={s.tool}
            onClick={() => {
              setI(k);
              setStep(reduced ? TOTAL : 0);
              setHold(true);
            }}
            onMouseEnter={() => {
              if (k !== i) {
                setI(k);
                setStep(reduced ? TOTAL : 0);
              }
              setHold(true);
            }}
            className={`min-h-9 rounded-sm border px-3 font-mono text-[11px] transition-colors ${k === i ? "border-signal text-signal" : "border-ink-line text-on-ink-muted hover:text-on-ink"}`}
          >
            {s.tool}
          </button>
        ))}
      </div>
    </div>
  );
}

function Connector({ active, tone: t }: { active: boolean; tone?: Status | undefined }) {
  const stroke = !active
    ? "stroke-ink-line"
    : t === "DENY"
      ? "stroke-deny"
      : t === "PENDING"
        ? "stroke-pending"
        : t === "ALLOW"
          ? "stroke-allow"
          : "stroke-signal";
  return (
    <div className="flex justify-center md:block">
      <svg
        viewBox="0 0 40 12"
        className="h-6 w-6 rotate-90 md:h-3 md:w-10 md:rotate-0"
        aria-hidden="true"
      >
        <line
          x1="0"
          y1="6"
          x2="34"
          y2="6"
          strokeWidth="1.5"
          className={active ? `flow-line ${stroke}` : stroke}
        />
        <path d="M34 2 L40 6 L34 10" fill="none" strokeWidth="1.5" className={stroke} />
      </svg>
    </div>
  );
}
