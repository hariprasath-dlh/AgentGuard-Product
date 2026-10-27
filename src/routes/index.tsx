import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import FlowArt, { FlowSection } from "@/components/ui/story-scroll";
import { HomeSection } from "@/components/sections/HomeSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { GettingStartedSection } from "@/components/sections/GettingStartedSection";
import { SdkSetupSection } from "@/components/sections/SdkSetupSection";
import { IntegrationSection } from "@/components/sections/IntegrationSection";
import { FaqSection } from "@/components/sections/FaqSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgentGuard — The agent proposes. AgentGuard decides." },
      {
        name: "description",
        content:
          "AgentGuard is a runtime governance layer that sits between an AI agent and the tools it's allowed to call.",
      },
      { property: "og:title", content: "AgentGuard — The agent proposes. AgentGuard decides." },
      {
        property: "og:description",
        content:
          "Runtime governance for autonomous AI agents: permissions, policy, risk, limits, approval and audit.",
      },
    ],
  }),
  component: ContinuousHome,
});

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const headerOffset = 64;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
}

function ContinuousHome() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const timer = setTimeout(() => {
        scrollToSection(hash);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <FlowArt aria-label="AgentGuard Continuous Story Scroll" className="w-full">
      {/* 01. Home Page Section */}
      <FlowSection
        id="home"
        aria-label="AgentGuard Home"
        className="bg-background text-foreground"
        innerClassName="!block !p-0"
      >
        <HomeSection onScrollToNext={() => scrollToSection("how-it-works")} />
      </FlowSection>

      {/* 02. How It Works Section */}
      <FlowSection
        id="how-it-works"
        aria-label="How AgentGuard Works"
        className="border-t border-border bg-[#FBF9F5] text-foreground"
        innerClassName="!block !p-0"
      >
        <HowItWorksSection onScrollToNext={() => scrollToSection("getting-started")} />
      </FlowSection>

      {/* 03. Getting Started Section */}
      <FlowSection
        id="getting-started"
        aria-label="Getting Started"
        className="border-t border-border bg-background text-foreground"
        innerClassName="!block !p-0"
      >
        <GettingStartedSection onScrollToNext={() => scrollToSection("sdk-setup")} />
      </FlowSection>

      {/* 04. Python SDK Setup Section */}
      <FlowSection
        id="sdk-setup"
        aria-label="Python SDK Setup"
        className="border-t border-border bg-[#F8F6F1] text-foreground"
        innerClassName="!block !p-0"
      >
        <SdkSetupSection onScrollToNext={() => scrollToSection("integration")} />
      </FlowSection>

      {/* 05. Integration Section */}
      <FlowSection
        id="integration"
        aria-label="AgentGuard Integration"
        className="border-t border-border bg-background text-foreground"
        innerClassName="!block !p-0"
      >
        <IntegrationSection onScrollToNext={() => scrollToSection("faq")} />
      </FlowSection>

      {/* 06. FAQ & Closing CTA Section */}
      <FlowSection
        id="faq"
        aria-label="Frequently Asked Questions"
        className="border-t border-border bg-background text-foreground"
        innerClassName="!block !p-0"
      >
        <FaqSection onScrollToTop={() => scrollToSection("home")} />
      </FlowSection>
    </FlowArt>
  );
}
