import { requireUnauth } from "@/features/auth/actions";

export default async function AuthLayout(
    {children} : {
        children : React.ReactNode;
    }
){
    await requireUnauth()
    return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">CodePilot</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Build, review, and improve your code with AI
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          {children}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © 2026 CodePilot. All rights reserved.
        </p>
      </div>
    </div>
  );
}

