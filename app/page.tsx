"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { UserMenuWithSession } from "@/features/auth/components/user-menu";
import { authClient } from "@/lib/auth-client";
import { PLAN_DETAILS } from "@/features/settings/lib/plan-details";
import { UpgradeButton } from "@/features/billing/components/upgrade-button";

type IconProps = {
  className?: string;
};

function ArrowRightIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ArrowUpRightIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function CheckIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function GitHubIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 .7a11.3 11.3 0 0 0-3.57 21.99c.57.1.77-.25.77-.55v-2.02c-3.13.68-3.79-1.32-3.79-1.32-.52-1.3-1.28-1.65-1.28-1.65-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.18 1.77 1.18 1.03 1.76 2.7 1.25 3.36.95.1-.74.4-1.25.73-1.54-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.11 1.15A10.8 10.8 0 0 1 12 6.26c.97 0 1.94.13 2.85.38 2.16-1.46 3.1-1.15 3.1-1.15.62 1.55.23 2.7.12 2.98a4.45 4.45 0 0 1 1.15 3.02c0 4.32-2.63 5.27-5.14 5.55.41.36.78 1.07.78 2.16v3.2c0 .31.21.67.78.55A11.3 11.3 0 0 0 12 .7Z" />
    </svg>
  );
}

function MenuIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function CloseIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

function SparkIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={className}
      aria-hidden="true"
    >
      <path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z" />
      <path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
    </svg>
  );
}

function ShieldIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3 19 6v5c0 4.8-3 8.3-7 10-4-1.7-7-5.2-7-10V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CodeIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={className}
      aria-hidden="true"
    >
      <path d="m8 9-4 3 4 3" />
      <path d="m16 9 4 3-4 3" />
      <path d="m14 5-4 14" />
    </svg>
  );
}

function GitPullRequestIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={className}
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M6 8v8" />
      <path d="M18 16V8" />
      <path d="M18 10c0-2.2-1.8-4-4-4h-2" />
      <path d="m12 4 2 2-2 2" />
    </svg>
  );
}

function DatabaseIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="12" cy="5" rx="7" ry="3" />
      <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
      <path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" />
    </svg>
  );
}

function ZapIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={className}
      aria-hidden="true"
    >
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

function CircleNumber({
  number,
  className,
}: {
  number: string;
  className: string;
}) {
  return (
    <div
      className={`flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${className}`}
    >
      {number}
    </div>
  );
}

export default function Home() {
  const { data: session } = authClient.useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isSignedIn = Boolean(session?.user);

  const pricing = {
    free: {
      ...PLAN_DETAILS.free,
      price: "₹0",
      period: "/month",
      description: "A simple starting point for individual developers.",
    },
    pro: {
      ...PLAN_DETAILS.pro,
      price: "₹999",
      period: "/month",
      description: "For developers who want unlimited AI reviews.",
    },
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/90">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo1.png"
              alt="CodePilot"
              width={40}
              height={40}
              priority
              className="size-9 object-contain"
            />

            <span className="text-[15px] font-semibold tracking-tight">
              Code<span className="text-violet-500">Pilot</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <button
              type="button"
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
            >
              How it works
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("reviews")}
              className="text-sm text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
            >
              Reviews
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("pricing")}
              className="text-sm text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
            >
              Pricing
            </button>
          </nav>

          <div className="hidden items-center gap-2.5 md:flex">
            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-3.5 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-100 dark:hover:bg-white/[0.08]"
                >
                  Open dashboard
                </Link>

                <UserMenuWithSession variant="compact" />
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  Sign in
                </Link>

                <Link
                  href="/sign-in"
                  className="inline-flex h-9 items-center rounded-lg bg-zinc-950 px-3.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                  Get started
                  <ArrowRightIcon className="ml-1.5 size-3.5" />
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="flex size-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 md:hidden dark:border-white/10 dark:text-zinc-200"
          >
            {mobileMenuOpen ? (
              <CloseIcon className="size-5" />
            ) : (
              <MenuIcon className="size-5" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-zinc-200/70 bg-white px-5 py-5 md:hidden dark:border-white/10 dark:bg-zinc-950">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              <button
                type="button"
                onClick={() => scrollToSection("how-it-works")}
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/5"
              >
                How it works
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("reviews")}
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/5"
              >
                Reviews
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("pricing")}
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/5"
              >
                Pricing
              </button>

              <div className="my-3 h-px bg-zinc-200 dark:bg-white/10" />

              {isSignedIn ? (
                <div className="flex items-center justify-between gap-3">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white dark:bg-white dark:text-zinc-950"
                  >
                    Open dashboard
                  </Link>

                  <UserMenuWithSession variant="compact" />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-200 text-sm font-medium text-zinc-800 dark:border-white/10 dark:text-zinc-100"
                  >
                    Sign in
                  </Link>

                  <Link
                    href="/sign-in"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-zinc-950 text-sm font-medium text-white dark:bg-white dark:text-zinc-950"
                  >
                    Get started
                    <ArrowRightIcon className="size-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-200/80 dark:border-white/10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-12rem] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/10" />
          <div className="absolute right-[-10rem] top-24 h-[22rem] w-[22rem] rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/10" />
          <div className="absolute left-[-12rem] top-52 h-[18rem] w-[18rem] rounded-full bg-cyan-400/10 blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-24 lg:px-8 lg:pb-24 lg:pt-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
              <span className="flex size-5 items-center justify-center rounded-full bg-violet-500/10 text-violet-500">
                <SparkIcon className="size-3.5" />
              </span>
              AI-powered pull request reviews
            </div>

            <h1 className="mx-auto max-w-4xl text-balance text-4xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-6xl lg:text-7xl dark:text-white">
              AI reviews that{" "}
              <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 bg-clip-text text-transparent">
                understand your codebase.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8 dark:text-zinc-400">
              CodePilot indexes your repository, reviews incoming pull requests
              with that context, and posts actionable feedback directly to
              GitHub.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={isSignedIn ? "/dashboard" : "/sign-in"}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                {isSignedIn ? "Open dashboard" : "Get started with GitHub"}
                <ArrowRightIcon className="size-4" />
              </Link>

              <button
                type="button"
                onClick={() => scrollToSection("how-it-works")}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:bg-white/[0.08]"
              >
                See how it works
              </button>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-500 dark:text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon className="size-3.5 text-emerald-500" />
                Reviews pull requests
              </span>

              <span className="inline-flex items-center gap-1.5">
                <CheckIcon className="size-3.5 text-emerald-500" />
                Posts feedback to GitHub
              </span>
            </div>
          </div>

          {/* Product preview */}
          <div className="mx-auto mt-14 max-w-6xl sm:mt-16">
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/10 dark:border-white/10 dark:bg-zinc-900 dark:shadow-black/30">
              <div className="flex h-10 items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-4 dark:border-white/10 dark:bg-zinc-900">
                <div className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-red-400/80" />
                  <span className="size-2.5 rounded-full bg-yellow-400/80" />
                  <span className="size-2.5 rounded-full bg-green-400/80" />
                </div>

                <div className="mx-auto flex h-6 max-w-sm flex-1 items-center justify-center rounded-md border border-zinc-200 bg-white text-[10px] text-zinc-400 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-500">
                  app.codepilot.dev/dashboard/pull-request
                </div>

                <div className="w-12" />
              </div>

              <div className="grid min-h-[500px] md:grid-cols-[190px_1fr]">
                <aside className="hidden border-r border-zinc-200 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-zinc-950/60 md:block">
                  <div className="mb-7 flex items-center gap-2.5">
                    <Image
                      src="/logo1.png"
                      alt="CodePilot"
                      width={52}
                      height={52}
                      className="size-8 object-contain"
                    />

                    <span className="text-xs font-semibold">CodePilot</span>
                  </div>

                  <div className="space-y-1 text-[11px] text-zinc-500">
                    <div className="rounded-md bg-white px-2.5 py-2 font-medium text-zinc-900 shadow-sm dark:bg-white/10 dark:text-white">
                      Overview
                    </div>

                    <div className="rounded-md px-2.5 py-2">Repositories</div>

                    <div className="rounded-md bg-violet-500/10 px-2.5 py-2 font-medium text-violet-600 dark:text-violet-300">
                      Pull Requests
                    </div>

                    <div className="rounded-md px-2.5 py-2">GitHub App</div>

                    <div className="rounded-md px-2.5 py-2">Settings</div>
                  </div>

                  <div className="mt-12 rounded-lg border border-zinc-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.03]">
                    <div className="text-[10px] font-medium text-zinc-400">
                      AI reviews
                    </div>

                    <div className="mt-1 text-lg font-semibold">3 / 5</div>

                    <div className="mt-2 h-1 rounded-full bg-zinc-100 dark:bg-white/10">
                      <div className="h-1 w-3/5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                    </div>
                  </div>
                </aside>

                <div className="min-w-0 bg-white dark:bg-zinc-900">
                  <div className="border-b border-zinc-200 px-5 py-5 dark:border-white/10 sm:px-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-medium text-zinc-400">
                            Pull Request
                          </span>

                          <span className="text-[11px] text-zinc-400">#42</span>

                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                            Reviewed
                          </span>
                        </div>

                        <h3 className="mt-2 text-lg font-semibold tracking-tight">
                          Improve authentication flow
                        </h3>

                        <p className="mt-1 text-xs text-zinc-500">
                          3 files changed · 2 comments · reviewed by CodePilot
                        </p>
                      </div>

                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-right dark:border-white/10 dark:bg-white/[0.03]">
                        <div className="text-[10px] uppercase tracking-wide text-zinc-400">
                          Repository
                        </div>

                        <div className="mt-0.5 text-xs font-medium">
                          codepilot/app
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-[1fr_310px]">
                    <div className="space-y-4">
                      <div className="rounded-xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.02]">
                        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-white/10">
                          <div className="flex items-center gap-2">
                            <SparkIcon className="size-4 text-violet-500" />

                            <span className="text-xs font-semibold">
                              AI Review
                            </span>
                          </div>

                          <span className="text-[10px] text-zinc-400">
                            18 sec
                          </span>
                        </div>

                        <div className="space-y-4 p-4">
                          <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.05] p-4">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                                <ShieldIcon className="size-4" />
                              </div>

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-semibold">
                                    Reliability
                                  </span>

                                  <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-medium text-amber-600 dark:text-amber-400">
                                    Suggestion
                                  </span>
                                </div>

                                <p className="mt-1.5 text-[11px] leading-5 text-zinc-600 dark:text-zinc-400">
                                  The session refresh path can return a stale
                                  token when the refresh request fails. Handle
                                  the error before updating the active session.
                                </p>

                                <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-950 dark:border-white/10">
                                  <div className="border-b border-white/10 px-3 py-2 text-[9px] text-zinc-500">
                                    auth/session.ts
                                  </div>

                                  <pre className="overflow-x-auto px-3 py-3 font-mono text-[10px] leading-5 text-zinc-300">
                                    {`const refreshed = await refreshToken();

if (!refreshed) {
  return null;
}

return setSession(refreshed);`}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-lg border border-zinc-200 p-4 dark:border-white/10">
                            <div className="flex items-center gap-2 text-xs font-semibold">
                              <CodeIcon className="size-4 text-blue-500" />
                              Review context
                            </div>

                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                              <div className="rounded-lg bg-zinc-50 p-3 dark:bg-white/[0.03]">
                                <div className="text-[10px] text-zinc-400">
                                  Indexed codebase
                                </div>

                                <div className="mt-1 text-xs font-medium">
                                  Available
                                </div>
                              </div>

                              <div className="rounded-lg bg-zinc-50 p-3 dark:bg-white/[0.03]">
                                <div className="text-[10px] text-zinc-400">
                                  Changed files
                                </div>

                                <div className="mt-1 text-xs font-medium">
                                  3 files
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-xl border border-zinc-200 p-4 dark:border-white/10">
                        <div className="text-xs font-semibold">Summary</div>

                        <div className="mt-4 space-y-3">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-zinc-500">Findings</span>
                            <span className="font-medium">1</span>
                          </div>

                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-zinc-500">
                              Review context
                            </span>

                            <span className="font-medium text-emerald-500">
                              Complete
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-zinc-500">
                              Posted to GitHub
                            </span>

                            <span className="font-medium text-emerald-500">
                              Yes
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl bg-zinc-950 p-4 text-white dark:bg-white/[0.06]">
                        <div className="flex items-center gap-2">
                          <GitPullRequestIcon className="size-4 text-violet-300" />

                          <span className="text-xs font-semibold">
                            Connected workflow
                          </span>
                        </div>

                        <div className="mt-4 space-y-3">
                          <div className="flex items-center gap-2 text-[10px] text-zinc-300">
                            <span className="size-1.5 rounded-full bg-emerald-400" />
                            GitHub webhook received
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-zinc-300">
                            <span className="size-1.5 rounded-full bg-emerald-400" />
                            Repository context retrieved
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-zinc-300">
                            <span className="size-1.5 rounded-full bg-emerald-400" />
                            AI review generated
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-zinc-300">
                            <span className="size-1.5 rounded-full bg-emerald-400" />
                            Feedback posted to GitHub
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-[11px] text-zinc-400">
              A review surface designed around the workflow your team already
              uses.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-20 border-b border-zinc-200/80 dark:border-white/10"
      >
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">
              How it works
            </div>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Four steps from repository to review.
            </h2>

            <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
              CodePilot fits into the GitHub workflow you already have instead
              of creating another place where developers need to work.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative rounded-2xl border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.02]">
              <CircleNumber
                number="1"
                className="border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-300"
              />

              <h3 className="mt-5 text-base font-semibold">Connect GitHub</h3>

              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Sign in and install the CodePilot GitHub App so your
                repositories and pull requests can be connected.
              </p>
            </div>

            <div className="relative rounded-2xl border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.02]">
              <CircleNumber
                number="2"
                className="border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-300"
              />

              <h3 className="mt-5 text-base font-semibold">
                Index the codebase
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                CodePilot syncs repository files, chunks source code, generates
                embeddings, and stores repository context for retrieval.
              </p>
            </div>

            <div className="relative rounded-2xl border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.02]">
              <CircleNumber
                number="3"
                className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
              />

              <h3 className="mt-5 text-base font-semibold">
                Open a pull request
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Continue opening pull requests normally. Supported PR events
                trigger the review workflow automatically.
              </p>
            </div>

            <div className="relative rounded-2xl border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.02]">
              <CircleNumber
                number="4"
                className="border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-300"
              />

              <h3 className="mt-5 text-base font-semibold">Review in GitHub</h3>

              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                CodePilot generates actionable review feedback and posts the
                result back to the GitHub pull request.
              </p>
            </div>
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-white/[0.02]">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="p-7 sm:p-9">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  <DatabaseIcon className="size-4" />
                  The important part
                </div>

                <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                  PR changes + indexed repository context
                </h3>

                <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                  Reviews are built from the pull request changes together with
                  retrieved repository context. That gives the model more
                  information than the diff alone.
                </p>
              </div>

              <div className="border-t border-zinc-200 bg-white p-7 dark:border-white/10 dark:bg-zinc-900 lg:border-l lg:border-t-0 sm:p-9">
                <div className="grid gap-3">
                  <div className="flex items-center gap-3 rounded-xl border border-zinc-200 p-4 dark:border-white/10">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                      <GitPullRequestIcon className="size-4" />
                    </div>

                    <div>
                      <div className="text-xs font-semibold">
                        Pull request diff
                      </div>

                      <div className="mt-0.5 text-[11px] text-zinc-500">
                        Changed files and review target
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center py-1 text-zinc-400">
                    +
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-zinc-200 p-4 dark:border-white/10">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
                      <DatabaseIcon className="size-4" />
                    </div>

                    <div>
                      <div className="text-xs font-semibold">
                        Indexed repository
                      </div>

                      <div className="mt-0.5 text-[11px] text-zinc-500">
                        Relevant codebase context
                      </div>
                    </div>
                  </div>

                  <div className="my-1 h-px bg-zinc-200 dark:bg-white/10" />

                  <div className="flex items-center gap-3 rounded-xl bg-zinc-950 p-4 text-white dark:bg-white/[0.06]">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-violet-500/20 text-violet-300">
                      <SparkIcon className="size-4" />
                    </div>

                    <div>
                      <div className="text-xs font-semibold">
                        Context-aware AI review
                      </div>

                      <div className="mt-0.5 text-[11px] text-zinc-400">
                        Actionable feedback on the changes
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Review criteria */}
      <section className="border-b border-zinc-200/80 dark:border-white/10">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-500">
              What CodePilot reviews
            </div>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Focused on the things that matter in a pull request.
            </h2>

            <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
              Review criteria are designed around practical engineering concerns
              rather than generic code style suggestions.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Correctness",
                description:
                  "Look for logic errors, incorrect assumptions, and behavior that does not match the intended change.",
                icon: CodeIcon,
              },
              {
                title: "Security",
                description:
                  "Surface risky patterns and changes that could introduce security issues.",
                icon: ShieldIcon,
              },
              {
                title: "Performance",
                description:
                  "Identify changes that can create unnecessary work, expensive operations, or avoidable bottlenecks.",
                icon: ZapIcon,
              },
              {
                title: "Reliability",
                description:
                  "Check failure paths, error handling, edge cases, and behavior that can make systems fragile.",
                icon: ShieldIcon,
              },
              {
                title: "Readability",
                description:
                  "Point out code that is difficult to understand or that can be made clearer.",
                icon: CodeIcon,
              },
              {
                title: "Maintainability",
                description:
                  "Highlight patterns that can make future changes harder or increase unnecessary complexity.",
                icon: SparkIcon,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-zinc-200 bg-white p-6 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800 dark:bg-white/[0.06] dark:text-zinc-200">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="mt-5 text-base font-semibold">{item.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section
        id="reviews"
        className="scroll-mt-20 border-b border-zinc-200/80 dark:border-white/10"
      >
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">
                Reviews
              </div>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Feedback stays where your code lives.
              </h2>

              <p className="mt-5 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                CodePilot posts the generated review back to the GitHub pull
                request, so developers can see findings alongside the changes
                they are already discussing.
              </p>

              <div className="mt-8 space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
                <div className="flex items-center gap-2.5">
                  <CheckIcon className="size-4 text-emerald-500" />
                  Review feedback appears on the pull request
                </div>

                <div className="flex items-center gap-2.5">
                  <CheckIcon className="size-4 text-emerald-500" />
                  Review status is tracked in the dashboard
                </div>

                <div className="flex items-center gap-2.5">
                  <CheckIcon className="size-4 text-emerald-500" />
                  Generated review details remain accessible in CodePilot
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-6">
              <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
                <div className="border-b border-zinc-200 px-5 py-4 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/logo1.png"
                      alt="CodePilot"
                      width={40}
                      height={40}
                      className="size-8 object-contain"
                    />

                    <div>
                      <div className="text-xs font-semibold">CodePilot bot</div>

                      <div className="text-[10px] text-zinc-400">
                        commented on pull request
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-5">
                  <div>
                    <div className="text-sm font-semibold">AI Review</div>

                    <p className="mt-2 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                      I found one reliability issue worth addressing before
                      merging this change.
                    </p>
                  </div>

                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4">
                    <div className="flex gap-3">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                        <ShieldIcon className="size-4" />
                      </div>

                      <div>
                        <div className="text-xs font-semibold">Reliability</div>

                        <p className="mt-1.5 text-[11px] leading-5 text-zinc-600 dark:text-zinc-400">
                          Consider handling the failed refresh path before
                          persisting the new session state.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-3 text-[10px] dark:bg-white/[0.03]">
                    <span className="text-zinc-500">
                      Review posted by CodePilot
                    </span>

                    <span className="font-medium text-emerald-500">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="scroll-mt-20 border-b border-zinc-200/80 dark:border-white/10"
      >
        <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">
              Pricing
            </div>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Start free. Upgrade when you need more.
            </h2>

            <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
              Simple pricing based on how much you use CodePilot.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {/* Free */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-7 dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <div className="text-sm font-semibold">{pricing.free.label}</div>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {pricing.free.description}
              </p>

              <div className="mt-7 flex items-end gap-1">
                <span className="text-4xl font-semibold tracking-tight">
                  {pricing.free.price}
                </span>

                <span className="pb-1 text-sm text-zinc-500">
                  {pricing.free.period}
                </span>
              </div>

              <div className="my-7 h-px bg-zinc-200 dark:bg-white/10" />

              <div className="space-y-3">
                {pricing.free.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300"
                  >
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href={isSignedIn ? "/dashboard" : "/sign-in"}
                className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-lg border border-zinc-200 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:text-zinc-100 dark:hover:bg-white/[0.05]"
              >
                {isSignedIn ? "Open dashboard" : "Get started"}
              </Link>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl border border-violet-500/30 bg-gradient-to-b from-violet-500/[0.06] to-white p-7 shadow-xl shadow-violet-500/5 dark:to-white/[0.02] sm:p-8">
              <div className="absolute right-6 top-6 rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold text-violet-600 dark:text-violet-300">
                Pro
              </div>

              <div className="text-sm font-semibold">{pricing.pro.label}</div>

              <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-500">
                {pricing.pro.description}
              </p>

              <div className="mt-7 flex items-end gap-1">
                <span className="text-4xl font-semibold tracking-tight">
                  {pricing.pro.price}
                </span>

                <span className="pb-1 text-sm text-zinc-500">
                  {pricing.pro.period}
                </span>
              </div>

              <div className="my-7 h-px bg-violet-500/15 dark:bg-white/10" />

              <div className="space-y-3">
                {pricing.pro.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300"
                  >
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-violet-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {isSignedIn ? (
                <UpgradeButton className="mt-8 h-11 w-full rounded-lg bg-zinc-950 text-sm font-medium text-white shadow-none hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200" />
              ) : (
                <Link
                  href="/sign-in"
                  className="mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                  Upgrade to Pro
                  <ArrowRightIcon className="size-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-zinc-200/80 dark:border-white/10">
        <div className="mx-auto w-full max-w-4xl px-5 py-20 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              FAQ
            </div>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Questions, answered.
            </h2>
          </div>

          <div className="mt-10 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 dark:divide-white/10 dark:border-white/10">
            <details className="group p-5 sm:p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                <span>What does CodePilot review?</span>

                <span className="text-zinc-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                CodePilot reviews pull requests across correctness, security,
                performance, reliability, readability, and maintainability.
              </p>
            </details>

            <details className="group p-5 sm:p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                <span>How does a review start?</span>

                <span className="text-zinc-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                When a supported pull request event reaches CodePilot, the
                webhook is validated and the review workflow runs
                asynchronously.
              </p>
            </details>

            <details className="group p-5 sm:p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                <span>Where does the review appear?</span>

                <span className="text-zinc-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                The generated feedback is posted back to the GitHub pull
                request, and the review can also be viewed from the CodePilot
                dashboard.
              </p>
            </details>

            <details className="group p-5 sm:p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                <span>Does CodePilot use repository context?</span>

                <span className="text-zinc-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Yes. CodePilot indexes repository source and retrieves relevant
                context together with the pull request changes during review.
              </p>
            </details>

            <details className="group p-5 sm:p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                <span>What&apos;s included in Free?</span>

                <span className="text-zinc-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                The Free plan includes up to 5 AI reviews per month, public and
                private repository access, and community support.
              </p>
            </details>

            <details className="group p-5 sm:p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                <span>How much does Pro cost?</span>

                <span className="text-zinc-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Pro is{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  ₹999/month
                </span>{" "}
                and includes unlimited AI reviews with public and private
                repository access.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-950 px-6 py-14 text-white sm:px-10 sm:py-16">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-16 -top-24 size-80 rounded-full bg-violet-600/20 blur-3xl" />
              <div className="absolute -bottom-24 left-20 size-72 rounded-full bg-blue-500/15 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-3xl text-center">
              <div className="mx-auto flex size-10 items-center justify-center rounded-2xl bg-white/10">
                <SparkIcon className="size-5 text-violet-300" />
              </div>

              <h2 className="mt-6 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Put another review layer between your code and production.
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                Connect GitHub, index your repositories, and let CodePilot bring
                another engineering perspective to the pull requests your team
                is already reviewing.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href={isSignedIn ? "/dashboard" : "/sign-in"}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
                >
                  <GitHubIcon className="size-4" />

                  {isSignedIn ? "Open dashboard" : "Get started with GitHub"}

                  <ArrowRightIcon className="size-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => scrollToSection("pricing")}
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-white/15 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  View pricing
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-7 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo1.png"
                alt="CodePilot"
                width={36}
                height={36}
                className="size-8 object-contain"
              />

              <span className="text-sm font-semibold">
                Code<span className="text-violet-500">Pilot</span>
              </span>
            </Link>

            <p className="mt-2 text-xs text-zinc-500">
              AI-powered pull request reviews for GitHub.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-zinc-500">
            <button
              type="button"
              onClick={() => scrollToSection("how-it-works")}
              className="transition-colors hover:text-zinc-900 dark:hover:text-white"
            >
              How it works
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("reviews")}
              className="transition-colors hover:text-zinc-900 dark:hover:text-white"
            >
              Reviews
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("pricing")}
              className="transition-colors hover:text-zinc-900 dark:hover:text-white"
            >
              Pricing
            </button>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-zinc-900 dark:hover:text-white"
            >
              GitHub
              <ArrowUpRightIcon className="size-3" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
