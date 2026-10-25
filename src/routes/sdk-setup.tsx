import { createFileRoute } from "@tanstack/react-router";
import { SdkSetupSection } from "@/components/sections/SdkSetupSection";

export const Route = createFileRoute("/sdk-setup")({
  head: () => ({
    meta: [
      { title: "SDK Setup — AgentGuard" },
      {
        name: "description",
        content: "Install the AgentGuard Python SDK and make your first governed request.",
      },
      { property: "og:title", content: "AgentGuard SDK Setup" },
      {
        property: "og:description",
        content:
          "This page shows the complete terminal journey — from an empty folder to a working, governed agent — including exactly what you should see printed back at every step.",
      },
    ],
  }),
  component: SdkSetup,
});

function SdkSetup() {
  return <SdkSetupSection />;
}
