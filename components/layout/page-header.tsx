import { Deck, Eyebrow } from "@/components/ui/primitives";

/** Consistent masthead for every listing page. */
export function PageHeader({
  eyebrow,
  title,
  deck,
  children,
}: {
  eyebrow?: string;
  title: string;
  deck?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b border-line">
      <div className="container-page py-14 sm:py-20">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="text-display-lg mt-4">{title}</h1>
        {deck && <Deck className="mt-4">{deck}</Deck>}
        {children && <div className="mt-9">{children}</div>}
      </div>
    </header>
  );
}
