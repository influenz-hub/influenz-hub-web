"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/primitives";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // The API being down is the failure users are most likely to hit locally, so
  // it gets its own explanation rather than a generic apology.
  const unreachable = error.message.includes("API");

  return (
    <div className="container-page flex min-h-[60dvh] flex-col justify-center py-24">
      <div className="max-w-lg">
        <Eyebrow>Something went wrong</Eyebrow>
        <h1 className="text-display-lg mt-4">
          {unreachable ? "We can't reach the server." : "That didn't work."}
        </h1>
        <p className="mt-4 leading-relaxed text-ink-muted">
          {unreachable
            ? "The Influenz Hub API isn't responding. If you're running this locally, check that the server is started."
            : "An unexpected error stopped this page from loading. Trying again often clears it."}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button variant="secondary" asChild>
            <Link href="/">Back home</Link>
          </Button>
        </div>
        {error.digest && (
          <p className="mt-8 text-xs text-ink-subtle">Reference: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
