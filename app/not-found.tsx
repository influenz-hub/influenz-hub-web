import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60dvh] flex-col justify-center py-24">
      <div className="max-w-lg">
        <Eyebrow>404</Eyebrow>
        <h1 className="text-display-lg mt-4">This page isn&apos;t here.</h1>
        <p className="mt-4 leading-relaxed text-ink-muted">
          The link may be old, or the creator may have taken it down. There&apos;s plenty else
          worth finding.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/discover">Explore Influenz Hub</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
