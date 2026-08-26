import { App } from "octokit";

let githubApp: App | null = null;

export function getGithubApp() {
  if (!githubApp) {
    const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;

    if (!privateKey) {
      throw new Error("GITHUB_APP_PRIVATE_KEY is missing");
    }

    githubApp = new App({
      appId: process.env.GITHUB_APP_ID!,
      privateKey,
      webhooks: {
        secret: process.env.GITHUB_WEBHOOK_SECRET!,
      },
    });
  }

  return githubApp;
}

export function getGithubInstallUrl(userId: string) {
  const url = new URL(
    "https://github.com/apps/code-pilot-by-gunjan/installations/new"
  );

  url.searchParams.set("state", userId);

  return url.toString();
}