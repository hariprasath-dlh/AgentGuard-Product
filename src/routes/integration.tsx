import { createFileRoute } from "@tanstack/react-router";
import { IntegrationSection } from "@/components/sections/IntegrationSection";

export const Route = createFileRoute("/integration")({
  head: () => ({
    meta: [
      { title: "Integration — AgentGuard" },
      {
        name: "description",
        content:
          "One dashboard, any number of agents, all governed the same way. How the dashboard and SDK connect.",
      },
      { property: "og:title", content: "Integration — AgentGuard" },
      {
        property: "og:description",
        content:
          "This page explains how the dashboard and the SDK actually connect, and how to grow from one agent to a whole fleet of them without losing control of who can do what.",
      },
    ],
  }),
  component: Integration,
});

function Integration() {
  return <IntegrationSection />;
}
