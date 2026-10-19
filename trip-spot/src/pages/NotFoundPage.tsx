import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";

import { Button } from "../components/ui/button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-background px-4 py-16 sm:px-6">
      <section className="relative mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <p className="font-heading text-8xl font-bold leading-none tracking-tight text-primary sm:text-9xl">
          404
        </p>

        <h1 className="mt-6 font-heading text-2xl font-bold tracking-tight text-primary sm:text-4xl">
          Изглежда, че се изгуби!
        </h1>

        <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground sm:text-lg">
          Мястото, което търсиш, не е тук. Нека ти помогнем да намериш пътя
          обратно към следващото си приключение.
        </p>

        <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
          <Button asChild className="w-full sm:w-auto" variant="outline">
            <Link to="/">
              Към начална страница
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-14 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span>
            Продължи да откриваш нови места с{" "}
            <Link
              to="/"
              className="font-semibold text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              TripSpot
            </Link>
          </span>
        </div>
      </section>
    </main>
  );
}
