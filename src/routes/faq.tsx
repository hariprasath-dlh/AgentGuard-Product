import { createFileRoute } from "@tanstack/react-router";
import { FaqSection } from "@/components/sections/FaqSection";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — AgentGuard" },
      {
        name: "description",
        content:
          "Straight answers to the questions people ask first about AgentGuard runtime governance, policies, HITL approvals, and SDK setup.",
      },
      { property: "og:title", content: "FAQ — AgentGuard" },
      {
        property: "og:description",
        content:
          "Straight answers to the questions people ask first. Pre-dispatch governance, decisions, audit log, and Python SDK.",
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return <FaqSection />;
}
