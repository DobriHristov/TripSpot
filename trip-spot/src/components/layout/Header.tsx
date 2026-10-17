import { Link } from "react-router-dom";
import { LogOut, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import "./Header.css";

function NavLinks() {
  return (
    <>
      <Link to="/">Начало</Link>
      <Link to="/places">Каталог</Link>
      <Link to="/favorites">Любими</Link>
      <Link to="/profile">Профил</Link>
      <Link to="/login">Вход</Link>
      <Link to="/register">Регистрация</Link>
    </>
  );
}

export function Header() {
  return (
    <header className="site-header">
      <div className="container-page">
        <div className="site-header__inner">
          <Link to="/" className="site-header__logo">
            Trip<span>Spot</span>
          </Link>

          <nav className="site-nav site-nav--desktop">
            <NavLinks />
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground lg:inline">
              Здравей, Тест
            </span>

            <Button asChild size="sm">
              <Link to="/places/new">
                <Plus className="h-4 w-4" />
                Ново място
              </Link>
            </Button>

            <Button variant="ghost" size="icon" aria-label="Изход">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
