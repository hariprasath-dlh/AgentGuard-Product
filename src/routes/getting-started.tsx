import { createFileRoute } from "@tanstack/react-router";
import { GettingStartedSection } from "@/components/sections/GettingStartedSection";

export const Route = createFileRoute("/getting-started")({
  head: () => ({
    meta: [
      { title: "Getting Started — AgentGuard" },
      {
        name: "description",
        content: "Add real governance to your own AI agent in about fifteen minutes.",
      },
      { property: "og:title", content: "Getting Started with AgentGuard" },
      {
        property: "og:description",
        content:
          "This guide walks you through everything from creating your account to seeing your first real decision show up in the dashboard.",
      },
    ],
  }),
  component: GettingStarted,
});

function GettingStarted() {
  return <GettingStartedSection />;
}
