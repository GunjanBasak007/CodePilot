# CodePilot

> AI-powered GitHub code reviewer. Install the GitHub App on a repo, and CodePilot automatically indexes your codebase and posts AI-generated review comments on every pull request.

<p align="left">
  <img alt="Build Status" src="https://img.shields.io/badge/build-passing-brightgreen?style=flat-square" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" />
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" />
  <img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-orange?style=flat-square" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Database](#database)
- [Background Jobs](#background-jobs)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

CodePilot connects to a user's GitHub account via a **GitHub App**, watches their repositories for pull request activity, and uses an LLM (via **OpenRouter**) to generate contextual, codebase-aware review comments that get posted directly back to the PR.

To ground reviews in real code context (rather than just the raw diff), CodePilot chunks and embeds both the full repository and each individual pull request into a **Pinecone** vector index, then retrieves relevant snippets at review time. All long-running work — repo sync, PR review generation, embedding — is handled asynchronously through **Inngest** event-driven functions so that webhook requests return instantly.

Billing/subscriptions are handled through **Razorpay**, and authentication (including the GitHub OAuth + GitHub App installation flow) is handled through **better-auth** backed by **Prisma/PostgreSQL**.

## Architecture

```
                          ┌─────────────────────────┐
                          │        GitHub           │
                          │  (App installation, PR   │
                          │   webhooks, OAuth)       │
                          └───────────┬──────────────┘
                                      │ webhook / OAuth
                                      ▼
                     ┌───────────────────────────────────┐
                     │           Next.js App Router       │
                     │  app/api/github/*  (webhooks,      │
                     │  callback, repos)                  │
                     │  app/api/auth/*    (better-auth)   │
                     │  app/api/razorpay/webhook          │
                     │  app/(protected)/dashboard/*        │
                     └───────────────┬─────────────────────┘
                                     │ emits events
                                     ▼
                     ┌───────────────────────────────────┐
                     │            Inngest                 │
                     │  app/api/inngest  (event bus /     │
                     │  durable step functions)           │
                     │                                     │
                     │  • repo/sync.requested              │
                     │    → chunk repo → embed → Pinecone  │
                     │  • github/pr.received               │
                     │    → chunk diff → embed → retrieve  │
                     │      context → generate review      │
                     │      (OpenRouter) → post PR comment │
                     └───────┬─────────────────┬───────────┘
                             │                 │
                             ▼                 ▼
                 ┌───────────────────┐  ┌────────────────────┐
                 │   PostgreSQL       │  │     Pinecone       │
                 │   (Prisma ORM)     │  │  (vector search:   │
                 │  users, sessions,  │  │  repo + PR         │
                 │  installations,    │  │  namespaces)        │
                 │  pull requests,    │  └────────────────────┘
                 │  repo syncs        │
                 └───────────────────┘
                             │
                             ▼
                 ┌───────────────────┐
                 │    OpenRouter      │
                 │  (LLM inference    │
                 │   for review text) │
                 └───────────────────┘
```

**Key flows:**

1. **Auth & Installation** — Users sign in with GitHub via `better-auth`; a GitHub App installation links a `User` to a `GithubInstallation`.
2. **Repo Sync** (`repo/sync.requested`) — On demand, CodePilot fetches all files for a repo/branch, chunks the code, embeds it, and stores it in a per-repo Pinecone namespace for future context retrieval.
3. **PR Review** (`github/pr.received`) — Triggered by a GitHub webhook when a PR is opened/updated. The diff is chunked and embedded into a per-PR namespace, relevant context is retrieved from both the PR and (if available) the synced repo namespace, an AI review is generated, and the result is posted as a PR comment and persisted to Postgres.
4. **Billing** — Razorpay handles subscription checkout and webhooks to gate paid plan usage.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, React 19) |
| Language | TypeScript |
| Styling / UI | Tailwind CSS v4, shadcn/ui, Radix / Base UI primitives |
| Auth | [better-auth](https://www.better-auth.com/) (GitHub OAuth) |
| Database / ORM | PostgreSQL + [Prisma 7](https://www.prisma.io/) (`@prisma/adapter-pg`) |
| Background jobs / events | [Inngest](https://www.inngest.com/) |
| Vector search | [Pinecone](https://www.pinecone.io/) |
| LLM inference | [OpenRouter](https://openrouter.ai/) via Vercel AI SDK |
| GitHub integration | GitHub App + [Octokit](https://github.com/octokit/octokit.js) |
| Payments / billing | [Razorpay](https://razorpay.com/) |
| Data fetching (client) | TanStack Query |

## Prerequisites

- Node.js 20+
- A PostgreSQL database
- A [GitHub App](https://docs.github.com/en/apps/creating-github-apps) with a private key, webhook secret, and repository/PR permissions
- A [Pinecone](https://www.pinecone.io/) account and index
- An [OpenRouter](https://openrouter.ai/) API key
- A [Razorpay](https://razorpay.com/) account (for billing)

## Environment Variables

Create a `.env` file in the project root with the following keys:

```bash
# --- Database ---
DATABASE_URL=

# --- Auth: GitHub OAuth (better-auth) ---
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# --- GitHub App (PR sync, code review, webhooks) ---
GITHUB_APP_ID=
GITHUB_APP_PRIVATE_KEY=
GITHUB_WEBHOOK_SECRET=

# --- Vector store ---
PINECONE_API_KEY=
PINECONE_INDEX=

# --- LLM inference ---
OPENROUTER_API_KEY=

# --- Billing (Razorpay) ---
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_PLAN_ID=
RAZORPAY_WEBHOOK_SECRET=

# Public key exposed to the client checkout widget
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

> `GITHUB_APP_PRIVATE_KEY` should be the PEM-formatted private key for your GitHub App (keep newlines escaped as `\n` if stored as a single-line value).

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env   # create this file using the keys listed above
```

### 3. Set up the database

```bash
npx prisma migrate deploy
npx prisma generate
```

### 4. Run in development

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000). Next.js will hot-reload as you edit files under `app/`.

Since GitHub webhooks and Inngest events need publicly reachable URLs, use a tunneling tool (e.g. `ngrok`) or the [Inngest Dev Server](https://www.inngest.com/docs/local-development) when testing PR review and repo sync flows locally:

```bash
npx inngest-cli@latest dev
```

### 5. Build & run in production

```bash
npm run build
npm run start
```

> No `Dockerfile` is currently included in this repository. To containerize the app, build a standard multi-stage Node.js image that runs `npm ci`, `npm run build`, and `npm run start` (exposing port `3000`), and inject the environment variables listed above at runtime.

## Database

Schema is defined in [`prisma/schema.prisma`](./prisma/schema.prisma) and includes models for `User`, `Session`/`Account`/`Verification` (auth), `GithubInstallation`, `PullRequest`, and `RepoSync`.

```bash
# Create a new migration after editing the schema
npx prisma migrate dev --name <migration-name>

# Apply existing migrations (production)
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio
```

## Background Jobs

All async workflows run through Inngest functions served from `app/api/inngest`:

| Event | Function | Purpose |
|---|---|---|
| `repo/sync.requested` | `syncRepoCodebaseFunction` | Chunks and embeds an entire repo into Pinecone for context retrieval |
| `github/pr.received` | `reviewPullRequest` | Chunks a PR diff, retrieves context, generates an AI review, and posts it as a PR comment |

## Project Structure

```
app/
├── (auth)/                # Sign-in routes
├── (protected)/dashboard/ # Authenticated dashboard (repos, settings)
└── api/
    ├── auth/               # better-auth handler
    ├── github/             # OAuth callback, repo listing, webhooks
    ├── inngest/            # Inngest function registration
    └── razorpay/webhook/   # Billing webhooks

features/
├── ai/            # OpenRouter client
├── auth/          # Auth actions & components
├── billing/       # Razorpay integration & subscription/usage logic
├── dashboard/     # Dashboard UI
├── github/        # GitHub App client, installation & repo logic
├── inngest/       # Inngest client
├── pinecone/      # Pinecone client
├── repo-sync/     # Full-repo embedding pipeline
├── reviews/       # PR review pipeline (chunking, generation, posting)
└── settings/      # Plan/settings logic

lib/                # Shared clients (db, auth, billing, utils)
prisma/             # Schema & migrations
components/ui/      # shadcn/ui component library
```

## Deployment

The easiest way to deploy is via [Vercel](https://vercel.com/new), the creators of Next.js. Make sure to:

1. Set all environment variables listed above in your hosting provider's dashboard.
2. Point your GitHub App's webhook URL to `https://<your-domain>/api/github/webhooks`.
3. Point your Razorpay webhook to `https://<your-domain>/api/razorpay/webhook`.
4. Run `npx prisma migrate deploy` against your production database as part of your deploy pipeline.
5. Register your Inngest app/functions endpoint (`/api/inngest`) with [Inngest Cloud](https://www.inngest.com/docs/platform/deploy) for production event delivery.

## License

This project does not currently include a `LICENSE` file. Add one (e.g. MIT) to clarify usage terms before open-sourcing or distributing.
