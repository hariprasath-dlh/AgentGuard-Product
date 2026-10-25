import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="border-b border-border grid-lines">
      <div className="container-ag py-16 md:py-24">
        <p className="eyebrow">
          <span className="text-signal">●</span> {eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">{intro}</p>
      </div>
    </section>
  );
}

export function CodeBlock({
  code,
  label,
  copyable = true,
}: {
  code: string;
  label?: string;
  copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-md border border-ink-line bg-ink shadow-sm">
      <div className="flex items-center justify-between border-b border-ink-line px-4 py-2 font-mono text-[11px] text-on-ink-muted">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-signal" />
          <span>{label || "Code"}</span>
        </div>
        {copyable && (
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-[11px] transition-colors focus:outline-none focus:ring-1 focus:ring-signal ${
              copied
                ? "border-signal bg-signal/20 text-signal font-medium"
                : "border-ink-line bg-ink-soft text-on-ink-muted hover:border-on-ink-muted hover:text-on-ink cursor-pointer"
            }`}
            aria-label={copied ? "Copied to clipboard" : "Copy code"}
            title="Click to copy"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-signal" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-on-ink">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function Decision({ status }: { status: "ALLOW" | "DENY" | "PENDING" }) {
  const cls =
    status === "ALLOW"
      ? "border-on-ink text-on-ink"
      : status === "DENY"
        ? "border-deny text-deny"
        : "border-pending text-pending";
  return (
    <span
      className={`inline-flex rounded-sm border px-2 py-0.5 font-mono text-[11px] tracking-wider transition-colors ${cls}`}
    >
      {status}
    </span>
  );
}
