import type { ReactNode } from "react";
import { AlertTriangle, Compass, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";

export function Loader({ label = "Зареждане…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground" role="status">
      <Loader2 className="h-7 w-7 animate-spin text-primary" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center" role="alert">
      <AlertTriangle className="h-7 w-7 text-destructive" />
      <p className="font-medium">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Опитай отново
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-dashed p-10 text-center">
      <Compass className="h-8 w-8 text-accent" />
      <h3 className="text-xl">{title}</h3>
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
      {action}
    </div>
  );
}
