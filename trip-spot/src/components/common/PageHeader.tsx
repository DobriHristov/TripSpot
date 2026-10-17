import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string | undefined;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
        )}
        <h1 className="text-4xl sm:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {actions}
    </header>
  );
}
