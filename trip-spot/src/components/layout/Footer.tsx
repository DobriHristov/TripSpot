import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="container-page mt-24 pb-6">
      <div className="rounded-[2rem] bg-primary px-8 py-10 text-primary-foreground">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-display text-3xl font-bold tracking-tight">
              TripSpot
            </p>
            <p className="mt-2 max-w-sm text-sm opacity-75">
              Открий, сподели и оцени любимите си места.
            </p>
          </div>

          <nav className="flex gap-5 text-sm font-semibold">
            <Link to="/" className="opacity-80 hover:opacity-100">
              Начало
            </Link>
            <Link to="/places" className="opacity-80 hover:opacity-100">
              Каталог
            </Link>
          </nav>
        </div>

        <p className="mt-8 border-t border-primary-foreground/15 pt-5 text-xs opacity-60">
          © {new Date().getFullYear()} TripSpot
        </p>
      </div>
    </footer>
  );
}
