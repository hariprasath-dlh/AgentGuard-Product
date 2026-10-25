import { Link } from "@tanstack/react-router";

export function LogoMark({
  className = "h-8 w-8",
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden rounded-md ${
        inverted ? "bg-white/10 p-0.5" : ""
      }`}
    >
      <img
        src="/logo-96.png"
        alt="AgentGuard logo"
        width={36}
        height={36}
        className={`object-contain rounded shrink-0 ${className} ${
          inverted ? "brightness-105" : ""
        }`}
      />
    </div>
  );
}

export function Logo({
  inverted = false,
  className = "",
}: {
  inverted?: boolean;
  className?: string;
}) {
  return (
    <Link
      to="/"
      className={`flex items-center gap-2.5 transition-opacity hover:opacity-90 ${className}`}
      aria-label="AgentGuard home"
    >
      <LogoMark inverted={inverted} className="h-8 w-8 md:h-9 md:w-9" />
      <span
        className={`text-[16px] font-semibold tracking-tight ${
          inverted ? "text-on-ink" : "text-foreground"
        }`}
      >
        AgentGuard
      </span>
    </Link>
  );
}
