"use client";

import ReactMarkdown from "react-markdown";

type PullRequestReviewProps = {
  review: string;
};

export function PullRequestReview({
  review,
}: PullRequestReviewProps) {
  return (
    <div className="prose prose-invert max-w-none text-sm">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 text-xl font-semibold text-foreground">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="mb-3 mt-6 text-lg font-semibold text-foreground">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="mb-2 mt-5 text-base font-semibold text-foreground">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="mb-4 leading-6 text-muted-foreground">
              {children}
            </p>
          ),

          ul: ({ children }) => (
            <ul className="mb-4 ml-5 list-disc space-y-2 text-muted-foreground">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="mb-4 ml-5 list-decimal space-y-2 text-muted-foreground">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="leading-6">
              {children}
            </li>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),

          code: ({ children }) => (
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
              {children}
            </code>
          ),

          pre: ({ children }) => (
            <pre className="mb-4 overflow-x-auto rounded border border-border bg-muted p-4">
              {children}
            </pre>
          ),

          blockquote: ({ children }) => (
            <blockquote className="mb-4 border-l-2 border-border pl-4 text-muted-foreground">
              {children}
            </blockquote>
          ),

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              {children}
            </a>
          ),
        }}
      >
        {review}
      </ReactMarkdown>
    </div>
  );
}