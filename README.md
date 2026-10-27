# AgentGuard — Product Website

**A technical introduction to runtime governance for autonomous AI agents.**

<p align="center">
  <a href="https://agentguard-product-site.vercel.app/">
    <strong>Live Website</strong>
  </a>
  &nbsp; · &nbsp;
  <a href="https://github.com/hariprasath-dlh/AgentGuard">
    <strong>Core Project Repository</strong>
  </a>
  &nbsp; · &nbsp;
  <a href="https://agentguard-frontend-theta.vercel.app/">
    <strong>AgentGuard Dashboard</strong>
  </a>
</p>

---

## Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [The AgentGuard Approach](#the-agentguard-approach)
- [Project Scope](#project-scope)
- [Website Features](#website-features)
- [Technical Architecture](#technical-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [Related Resources](#related-resources)
- [Future Improvements](#future-improvements)
- [Author](#author)
- [License](#license)

---

## Overview

AgentGuard Product Website is the introduction and documentation-style website for **AgentGuard**, a runtime governance layer designed to help control the actions of autonomous AI agents.

As AI agents become capable of interacting with APIs, databases, and external tools, it becomes important to evaluate their proposed actions before those actions are executed.

AgentGuard addresses this challenge by introducing a governance layer between an AI agent and the tools it wants to use.

The core principle is:

> **The agent proposes. AgentGuard decides.**

This repository contains the frontend website that introduces the project, explains its architecture, and provides a starting point for understanding its installation and integration concepts.

The website is also designed to demonstrate practical frontend development, technical communication, responsive interface design, and product documentation.

### Live Website

https://agentguard-product-site.vercel.app/

### Related Projects

- **AgentGuard core repository:** https://github.com/hariprasath-dlh/AgentGuard
- **AgentGuard dashboard:** https://agentguard-frontend-theta.vercel.app/

---

## The Problem

Autonomous AI agents can select and execute tool calls as part of their workflows. Without appropriate runtime controls, an agent may attempt actions that exceed its permissions, violate a policy, or consume more resources than intended.

Common engineering challenges include:

- **Uncontrolled tool execution:** An agent may attempt an action that should not be permitted.
- **Permission management:** Different agents and users may require different levels of access.
- **Resource consumption:** Repeated tool calls can increase usage and operating costs.
- **Risk management:** Some actions require additional checks or human approval.
- **Auditability:** Teams need a useful record of governance decisions and system activity.
- **Integration complexity:** Developers need a practical way to connect governance controls to existing agent workflows.

These challenges motivate the need for a governance mechanism that evaluates proposed actions before they reach external tools.

---

## The AgentGuard Approach

AgentGuard is designed around pre-dispatch governance.

Instead of relying only on records of actions after execution, the system introduces a decision point before a proposed tool call reaches its destination.

At a conceptual level, the workflow is:

1. An AI agent proposes a tool action.
2. AgentGuard intercepts the proposed request.
3. The request is evaluated against applicable identity, permission, policy, risk, and resource controls.
4. AgentGuard produces a governance decision.
5. An allowed action can proceed to its intended tool.
6. A denied action is blocked.
7. An action requiring additional review can enter a pending approval workflow.
8. Governance activity can be recorded for auditing.

The intended decision states are:

| Decision | Meaning |
|---|---|
| `ALLOW` | The action is permitted to proceed. |
| `DENY` | The action is blocked. |
| `PENDING` | The action requires a further decision, such as human approval. |

The exact checks, execution behavior, and integration requirements depend on the implementation of the core AgentGuard system.

---

## Project Scope

This repository focuses on the **AgentGuard product introduction website**.

It presents the project in a structured, developer-friendly format and provides an interface for exploring its purpose, workflow, setup concepts, and integration approach.

The website should not be confused with the governance engine itself.

| Component | Responsibility |
|---|---|
| AgentGuard Product Website | Introduces the project and explains its concepts. |
| AgentGuard Core Project | Contains the main runtime governance implementation. |
| AgentGuard Dashboard | Provides the deployed dashboard experience. |

These components have separate responsibilities and should be evaluated independently.

---

## Website Features

### 1. Product Introduction

Introduces AgentGuard, explains the problem it addresses, and communicates the core principle of runtime governance.

### 2. System Workflow

Explains the conceptual path from an agent's proposed action through governance checks to the final decision.

### 3. Getting Started

Provides an organized place for developers to understand the steps involved in preparing an existing project for AgentGuard integration.

### 4. SDK Setup Documentation

Provides a structure for explaining SDK installation, configuration, terminal commands, and basic usage.

Actual commands should match the supported version of the AgentGuard SDK.

### 5. Integration Guide

Explains how an existing AI agent can connect to the AgentGuard governance layer and how decisions relate to tool execution.

### 6. Frequently Asked Questions

Answers common questions about runtime governance, permissions, policy evaluation, approval workflows, and integration.

### 7. Responsive Interface

The website is intended to provide a usable experience across desktop, tablet, and mobile screen sizes.

### 8. Product-Oriented Design

The interface uses a restrained visual identity based on premium black, orange, white, and warm cream tones, with an emphasis on technical clarity and readable content.

---

## Technical Architecture

### Website Architecture

The website is built as a React application using the TanStack Start framework and Vite-based tooling.

At a high level, the frontend is responsible for presenting content, rendering the user interface, handling navigation and interactions, and providing responsive layouts.

```text
Visitor
   |
   v
AgentGuard Product Website
   |
   +-- Product Introduction
   |
   +-- How It Works
   |
   +-- Getting Started
   |
   +-- SDK Setup
   |
   +-- Integration Guide
   |
   +-- FAQ
```

This diagram represents the website's documentation-oriented information structure, not the internal runtime architecture of the AgentGuard engine.

### Core Governance Architecture

The related AgentGuard project follows a different conceptual workflow:

```text
AI Agent
   |
   | Proposed tool request
   v
AgentGuard Governance Layer
   |
   +-- Identity and Agent Validation
   +-- Permission and Policy Checks
   +-- Risk Evaluation
   +-- Budget and Rate Limits
   +-- Human Approval, When Required
   |
   v
Governance Decision
   |
   +-- ALLOW
   +-- DENY
   +-- PENDING
   |
   v
External Tool or Approval Workflow
```

The actual implementation and execution behavior should be verified in the core repository.

---

## Technology Stack

The following technologies are declared in the website repository's project configuration.

| Technology | Purpose |
|---|---|
| React | Component-based user interface development. |
| TypeScript | Static typing for application code. |
| TanStack Start | Application framework and routing/runtime foundation. |
| Vite | Development server and build tooling. |
| Tailwind CSS | Utility-based styling. |
| GSAP | Animation tooling available in the project dependencies. |
| Framer Motion | UI animation tooling available in the project dependencies. |
| Lucide React | Icon components. |
| Vitest | Automated test runner. |
| ESLint | Code-quality and lint checks. |
| Prettier | Code formatting. |
| Vercel | Website hosting and deployment. |
| Git and GitHub | Version control and source-code hosting. |

**Note:** A dependency being present in `package.json` does not necessarily mean it is used throughout the application. The technologies used by individual features should be confirmed from the implementation.

---

## Project Structure

The repository uses a TanStack Start and Vite-based project setup.

Important root-level files include:

```text
AgentGuard-Product/
├── public/                 # Public static assets, if present
├── src/                    # Application source code
├── package.json            # Dependencies and npm scripts
├── vite.config.ts          # Vite and TanStack configuration
├── tsconfig.json           # TypeScript configuration, if present
├── README.md               # Project documentation
└── ...
```

The exact source directories and route organization may evolve as the application develops.

For the complete structure, refer to the repository:

https://github.com/hariprasath-dlh/AgentGuard-Product

---

## Getting Started

Follow these steps to run the website locally.

### Prerequisites

Install the following:

- Node.js compatible with the project's dependencies.
- npm, which is included with Node.js.
- Git.
- A code editor such as Visual Studio Code.

Check the installed versions:

```bash
node --version
npm --version
git --version
```

### Step 1 — Clone the Repository

```bash
git clone https://github.com/hariprasath-dlh/AgentGuard-Product.git
```

### Step 2 — Enter the Project Directory

```bash
cd AgentGuard-Product
```

### Step 3 — Install Dependencies

```bash
npm install
```

This installs the dependencies declared in `package.json`.

### Step 4 — Start the Development Server

```bash
npm run dev
```

The project's development script starts Vite on port `3000`.

Open the local address shown in the terminal. With the current script, this is typically:

http://localhost:3000

Keep the terminal running while developing.

### Step 5 — Build the Website

```bash
npm run build
```

This runs the production build configured for the project.

Review the terminal output and resolve any build errors before deploying changes.

---

## Available Scripts

The following scripts are defined in `package.json`.

| Command | Purpose |
|---|---|
| `npm run dev` | Starts the development server. |
| `npm run build` | Creates a production build. |
| `npm run build:dev` | Creates a build using development mode. |
| `npm run preview` | Starts Vite's preview server. |
| `npm run lint` | Runs ESLint. |
| `npm run format` | Runs Prettier formatting across the project. |
| `npm test` | Runs the Vitest test suite once. |
| `npm run test:watch` | Starts Vitest in watch mode. |

Use the scripts as appropriate for your development workflow. A configured test script does not guarantee that a complete test suite already exists.

---

## Development Workflow

A simple development workflow is:

1. Clone the repository.
2. Install the dependencies.
3. Start the local development server.
4. Make a focused change.
5. Review the application in the browser.
6. Run relevant tests and lint checks.
7. Create a Git commit.
8. Push the changes to GitHub.
9. Verify the deployed website.

### Example Git Workflow

```bash
git status
git add .
git commit -m "docs: improve project README"
git push origin main
```

Review `git status` before staging files. Avoid committing credentials, private environment files, or unrelated changes.

---

## Deployment

The AgentGuard Product Website is deployed on Vercel.

### Live Deployment

https://agentguard-product-site.vercel.app/

### Deployment Workflow

The repository can be connected to Vercel for Git-based deployment.

A typical workflow is:

1. Import the GitHub repository into Vercel.
2. Confirm the framework and build configuration.
3. Deploy the application.
4. Open the generated deployment URL.
5. Verify page navigation, responsive layouts, links, and interactive elements.
6. Push future changes to the connected branch and check the resulting deployment.

### Build Configuration

The repository uses TanStack Start with Vite. Build and output behavior should follow the project's actual framework configuration.

Do not replace its framework settings with a generic static Vite configuration without checking the application requirements.

### Environment Variables

If the application requires environment variables, configure them in the hosting provider's project settings.

Never commit API keys, tokens, passwords, or other secrets to GitHub.

---

## Related Resources

| Resource | Link |
|---|---|
| Live product website | https://agentguard-product-site.vercel.app/ |
| Product website source code | https://github.com/hariprasath-dlh/AgentGuard-Product |
| AgentGuard core repository | https://github.com/hariprasath-dlh/AgentGuard |
| AgentGuard dashboard | https://agentguard-frontend-theta.vercel.app/ |
| Contact | hariprasathdlhdlh@gmail.com |

---

## Future Improvements

Potential improvements for the website include:

- Expanding the technical workflow documentation.
- Adding verified SDK installation and integration examples.
- Improving architecture diagrams and code examples.
- Adding automated tests for important user interactions.
- Reviewing accessibility and reduced-motion behavior.
- Checking responsive layouts across common viewport sizes.
- Improving technical documentation as the core project evolves.

These are potential improvements, not claims that every item is currently implemented.

---

## Author

**Hariprasath L V**

AI & Software Engineer

- GitHub: https://github.com/hariprasath-dlh
- AgentGuard Core: https://github.com/hariprasath-dlh/AgentGuard
- Email: hariprasathdlhdlh@gmail.com

---

## License

A license has not been specified in this README.

Before distributing or reusing the project, add a `LICENSE` file and update this section to reflect the license you choose.

---

**AgentGuard — The agent proposes. AgentGuard decides.**
