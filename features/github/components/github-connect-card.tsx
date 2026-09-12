"use client";

import {
  ArrowSquareOut,
  CheckCircle,
  GithubLogo,
  Plugs,
} from "@phosphor-icons/react";

import type { GithubInstallationStatus } from "@/features/dashboard/lib/types";
import {
  statusBadge,
  statusButtonClass,
} from "@/features/dashboard/lib/status-style";
import { getGithubInstallUrl } from "@/features/github/utils/github-app";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { disconnectGithubApp } from "../actions";

type GithubConnectCardProps = {
  userId: string;
  installation: GithubInstallationStatus;
};

const capabilities = [
  "Repository metadata",
  "Pull request webhooks",
  "AI-generated review comments",
];

function CapabilityList() {
  return (
    <div className="space-y-3">
      {capabilities.map((capability) => (
        <div
          key={capability}
          className="flex items-center gap-2.5 text-sm text-muted-foreground"
        >
          <CheckCircle className="size-4 shrink-0 text-emerald-500" weight="fill" />
          <span>{capability}</span>
        </div>
      ))}
    </div>
  );
}

function ConnectedActions() {
  return (
    <form action={disconnectGithubApp}>
      <Button
        type="submit"
        variant="outline"
        className={cn(
          "w-full sm:w-auto",
          statusButtonClass.danger,
        )}
      >
        <Plugs className="size-4" />
        Disconnect GitHub App
      </Button>
    </form>
  );
}

function DisconnectedActions({
  installUrl,
}: {
  installUrl: string;
}) {
  return (
    <Button
      nativeButton={false}
      render={<a href={installUrl} />}
      className="w-full sm:w-auto"
    >
      <GithubLogo className="size-4" />
      Install GitHub App
      <ArrowSquareOut className="size-3.5 opacity-70" />
    </Button>
  );
}

export function GithubConnectCard({
  userId,
  installation,
}: GithubConnectCardProps) {
  const { connected, accountLogin } = installation;

  // Install URL encodes the userId so the callback can associate
  // the GitHub installation with the authenticated CodePilot user.
  const installUrl = getGithubInstallUrl(userId);

  const statusTone: "success" | "neutral" = connected
    ? "success"
    : "neutral";

  const statusLabel = connected
    ? "Connected"
    : "Not connected";

  return (
    <div className="flex flex-1 flex-col p-6">
      <Card
        className={cn(
          "w-full max-w-3xl overflow-hidden",
          connected
            ? "border-emerald-500/20"
            : "border-border",
        )}
      >
        <CardHeader className="border-b border-border px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-lg border",
                  connected
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-border bg-muted text-foreground",
                )}
              >
                <GithubLogo className="size-6" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Integration
                </p>

                <h2 className="mt-1 text-lg font-semibold tracking-tight">
                  GitHub App
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                  Connect GitHub so CodePilot can access your repositories
                  and process pull request events.
                </p>
              </div>
            </div>

            <span className={statusBadge(statusTone)}>
              {statusLabel}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-7 px-6 py-7 sm:px-8">
          {connected ? (
            <>
              <section>
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Connected account
                </p>

                <p className="mt-2 text-base font-medium">
                  {accountLogin
                    ? `@${accountLogin}`
                    : "GitHub account"}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  The CodePilot GitHub App is installed and ready to
                  receive repository and pull request events.
                </p>
              </section>

              <section className="border-t border-border pt-6">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  App capabilities
                </p>

                <div className="mt-4">
                  <CapabilityList />
                </div>
              </section>
            </>
          ) : (
            <>
              <section>
                <p className="text-sm font-medium">
                  Connect your GitHub workspace
                </p>

                <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                  Install the CodePilot GitHub App on your account or
                  organization and select the repositories you want
                  CodePilot to work with.
                </p>
              </section>

              <section className="border-t border-border pt-6">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  CodePilot will be able to
                </p>

                <div className="mt-4">
                  <CapabilityList />
                </div>
              </section>
            </>
          )}
        </CardContent>

        <CardFooter className="border-t border-border px-6 py-5 sm:px-8">
          {connected ? (
            <ConnectedActions />
          ) : (
            <DisconnectedActions installUrl={installUrl} />
          )}
        </CardFooter>
      </Card>
    </div>
  );
}