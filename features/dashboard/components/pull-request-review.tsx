"use client";

import ReactMarkdown from "react-markdown";

type PullRequestReviewProps = {
  review: string;
};

export function PullRequestReview({
  review,
}: PullRequestReviewProps) {
  return (
  <article className="overflow-hidden rounded-lg border border-border bg-background">
    <div className="px-5 py-6 sm:px-8 sm:py-8">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <div className="mb-5 mt-10 border-b border-border pb-3 first:mt-0">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {children}
              </h2>
            </div>
          ),

          h3: ({ children }) => (
            <h3 className="mb-3 mt-7 text-base font-semibold text-foreground">
              {children}
            </h3>
          ),

          h4: ({ children }) => (
            <h4 className="mb-2 mt-5 text-sm font-semibold text-foreground">
              {children}
            </h4>
          ),

          p: ({ children }) => (
            <p className="mb-4 max-w-3xl text-sm leading-7 text-muted-foreground">
              {children}
            </p>
          ),

          ul: ({ children }) => (
            <ul className="mb-5 ml-5 max-w-3xl list-disc space-y-2 text-sm leading-7 text-muted-foreground marker:text-foreground/50">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="mb-5 ml-5 max-w-3xl list-decimal space-y-2 text-sm leading-7 text-muted-foreground marker:text-foreground/50">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="pl-1">
              {children}
            </li>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),

          em: ({ children }) => (
            <em className="text-foreground/90">
              {children}
            </em>
          ),

          hr: () => (
            <hr className="my-8 border-border" />
          ),

          code: ({ className, children }) => {
            const isBlock = Boolean(className);

            if (isBlock) {
              return (
                <code className="font-mono text-[13px] leading-6 text-foreground">
                  {children}
                </code>
              );
            }

            return (
              <code className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[12px] text-foreground">
                {children}
              </code>
            );
          },

          pre: ({ children }) => (
            <pre className="mb-6 max-w-full overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-[13px] leading-6">
              {children}
            </pre>
          ),

          blockquote: ({ children }) => (
            <blockquote className="mb-6 max-w-3xl border-l-2 border-foreground/20 pl-5 text-sm leading-7 text-muted-foreground">
              {children}
            </blockquote>
          ),

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground"
            >
              {children}
            </a>
          ),

          table: ({ children }) => (
            <div className="mb-6 overflow-x-auto rounded-lg border border-border">
              <table className="w-full border-collapse text-sm">
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead className="bg-muted/40 text-left">
              {children}
            </thead>
          ),

          th: ({ children }) => (
            <th className="border-b border-border px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="border-b border-border px-4 py-3 align-top text-sm text-muted-foreground last:border-b-0">
              {children}
            </td>
          ),
        }}
      >
        {review}
      </ReactMarkdown>
    </div>
  </article>
);
}