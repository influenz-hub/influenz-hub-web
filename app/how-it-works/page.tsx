import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/primitives";
import { GROWTH } from "@/lib/utils";

export const metadata = {
  title: "How Influenz helps",
  description: "How Influenz Hub helps independent businesses get discovered and grow.",
};

const STEPS = [
  {
    n: "01",
    title: "Claim your space",
    body: "Set up a profile that reads like you, not like a listing: your story, your location, your work. It becomes your public page on Influenz Hub.",
  },
  {
    n: "02",
    title: "Add what you offer",
    body: "Stores come first — add products with prices and stock. Services sit alongside them for the work you do to order.",
  },
  {
    n: "03",
    title: "Get in front of people",
    body: "Your work surfaces in discovery, in category browsing, and in recommendations built from what people already follow.",
  },
  {
    n: "04",
    title: "Grow, and show it",
    body: "Followers, views, likes, and reviews accumulate on your profile. As they do, your level moves — and featured creators lead the homepage.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="For creators"
        title="How Influenz helps"
        deck="Influenz Hub exists to make independent work visible. Here's what that looks like in practice."
      />

      <div className="container-page py-16">
        <ol className="max-w-3xl">
          {STEPS.map((step) => (
            <li key={step.n} className="border-b border-line py-10 last:border-b-0">
              <div className="grid gap-5 sm:grid-cols-[4rem_1fr]">
                <span className="font-display text-2xl font-bold text-line-strong tabular-nums">
                  {step.n}
                </span>
                <div>
                  <h2 className="text-display-sm">{step.title}</h2>
                  <p className="measure mt-2.5 leading-relaxed text-ink-muted">{step.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <section className="mt-20 max-w-3xl">
          <Eyebrow>The levels</Eyebrow>
          <h2 className="text-display-md mt-3">Progress you can actually see</h2>
          <p className="measure mt-3 text-ink-muted">
            Every profile carries a level based on how many people follow it. It isn&apos;t a
            vanity metric — it&apos;s the signal a first-time visitor uses to decide you&apos;re
            worth their attention.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {(Object.keys(GROWTH) as (keyof typeof GROWTH)[]).map((key) => (
              <li key={key} className="surface flex items-center gap-4 rounded-[var(--radius-md)] p-5">
                <span className="text-2xl" aria-hidden>
                  {GROWTH[key].emoji}
                </span>
                <div>
                  <p className="font-display font-semibold">{GROWTH[key].label}</p>
                  <p className="text-xs text-ink-subtle">
                    {key === "EMERGING" && "Everyone starts here"}
                    {key === "GROWING" && "100+ followers"}
                    {key === "INFLUENTIAL" && "1,000+ followers"}
                    {key === "FEATURED" && "Selected by Influenz"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-20 border-t border-line pt-14">
          <h2 className="text-display-md measure-tight">
            Ready to put your work in front of people?
          </h2>
          <Button size="lg" className="mt-7" asChild>
            <Link href="/register">
              Become an Indie <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
