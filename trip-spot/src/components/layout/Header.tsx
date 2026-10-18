import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Plus, Menu, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  const catalogActive =
    pathname === "/places" || pathname.startsWith("/places/");
  const linkClass = "site-nav__link";

  return (
    <>
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          isActive ? `${linkClass} is-active` : linkClass
        }
        onClick={onNavigate}
      >
        Начало
      </NavLink>

      <NavLink
        to="/places"
        className={catalogActive ? `${linkClass} is-active` : linkClass}
        onClick={onNavigate}
      >
        Каталог
      </NavLink>

      {isAuthenticated ? (
        <>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              isActive ? `${linkClass} is-active` : linkClass
            }
            onClick={onNavigate}
          >
            Любими
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? `${linkClass} is-active` : linkClass
            }
            onClick={onNavigate}
          >
            Профил
          </NavLink>
        </>
      ) : (
        <>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? `${linkClass} is-active` : linkClass
            }
            onClick={onNavigate}
          >
            Вход
          </NavLink>

          <NavLink
            to="/register"
            className={({ isActive }) =>
              isActive ? `${linkClass} is-active` : linkClass
            }
            onClick={onNavigate}
          >
            Регистрация
          </NavLink>
        </>
      )}
    </>
  );
}

export function Header() {
  const { isAuthenticated, isReady, user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="site-header">
      <div className="container-page">
        <div className="site-header__inner">
          <Link
            to="/"
            className="site-header__logo"
            onClick={() => setMenuOpen(false)}
          >
            Trip<span>Spot</span>
          </Link>

          <nav className="site-nav site-nav--desktop">
            {isReady && <NavLinks />}
          </nav>

          <div className="site-header__end">
            <div className="site-header__actions min-w-0">
              {isAuthenticated && (
                <>
                  <span className="hidden  min-w-0 truncate text-sm text-muted-foreground lg:inline">
                    Здравейте, {user?.username}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    // variant="ghost"
                    // size="icon"
                    onClick={handleLogout}
                    aria-label="Изход"
                  >
                    <LogOut className="h-4 w-4" />
                    Изход
                  </Button>

                  <Button asChild size="lg" className="rounded-xl">
                    <Link to="/places/new" onClick={() => setMenuOpen(false)}>
                      <Plus className="h-4 w-4" />
                      Ново място
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {isReady && (
              <button
                type="button"
                className="site-header__burger"
                aria-label={menuOpen ? "Затвори менюто" : "Отвори менюто"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                {menuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            )}
          </div>

          {menuOpen && isReady && (
            <MobileMenu
              key={pathname}
              isAuthenticated={isAuthenticated}
              username={user?.username}
              onLogout={handleLogout}
              onClose={() => setMenuOpen(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
}

function MobileMenu({
  isAuthenticated,
  username,
  onLogout,
  onClose,
}: {
  isAuthenticated: boolean;
  username?: string;
  onLogout: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div
        className="site-menu-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      <nav className="site-menu" aria-label="Мобилно меню">
        <NavLinks onNavigate={onClose} />

        {isAuthenticated && (
          <>
            <div className="site-menu__divider" />

            <div className="site-menu__user">
              <span className="site-menu__hello">Здравейте, {username}</span>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4" />
                Изход
              </Button>

              <Button asChild size="lg" className="w-full rounded-xl">
                <Link to="/places/new" onClick={onClose}>
                  <Plus className="h-4 w-4" />
                  Ново място
                </Link>
              </Button>
            </div>
          </>
        )}
      </nav>
    </>
  );
}
