import { createFileRoute } from "@tanstack/react-router";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How AgentGuard Works — AgentGuard" },
      {
        name: "description",
        content:
          "Step by step: how AgentGuard intercepts, evaluates and decides on AI agent tool calls.",
      },
      { property: "og:title", content: "How AgentGuard Works" },
      {
        property: "og:description",
        content: "From proposed action to ALLOW, DENY or PENDING, and the audit event behind it.",
      },
    ],
  }),
  component: HowItWorks,
});

function HowItWorks() {
  return <HowItWorksSection />;
}
