import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

function NavLinks() {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  const catalogActive =
    pathname === "/places" || pathname.startsWith("/places/");

  return (
    <>
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          isActive ? "site-nav__link is-active" : "site-nav__link"
        }
      >
        Начало
      </NavLink>

      <Link
        to="/places"
        className={
          catalogActive ? "site-nav__link is-active" : "site-nav__link"
        }
      >
        Каталог
      </Link>

      {isAuthenticated ? (
        <>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              isActive ? "site-nav__link is-active" : "site-nav__link"
            }
          >
            Любими
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "site-nav__link is-active" : "site-nav__link"
            }
          >
            Профил
          </NavLink>
        </>
      ) : (
        <>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? "site-nav__link is-active" : "site-nav__link"
            }
          >
            Вход
          </NavLink>

          <NavLink
            to="/register"
            className={({ isActive }) =>
              isActive ? "site-nav__link is-active" : "site-nav__link"
            }
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

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="site-header">
      <div className="container-page">
        <div className="site-header__inner">
          <Link to="/" className="site-header__logo">
            Trip<span>Spot</span>
          </Link>

          <nav className="site-nav site-nav--desktop">
            {isReady && <NavLinks />}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <span className="hidden text-sm text-muted-foreground lg:inline">
                  Здравей, {user?.username}
                </span>

                <Button asChild size="sm">
                  <Link to="/places/new">
                    <Plus className="h-4 w-4" />
                    Ново място
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  aria-label="Изход"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        <nav className="site-nav site-nav--mobile">
          {isReady && <NavLinks />}
        </nav>
      </div>
    </header>
  );
}
