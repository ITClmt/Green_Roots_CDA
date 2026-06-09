import { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Link, NavLink } from 'react-router';
import { useAuth } from '../../features/auth/AuthContext';
import { useCart } from '../../features/cart/useCart';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className=" sticky top-0 z-50 bg-[#F9FAF5] ">
      {/* Main bar */}
      <div className="flex items-center px-5 sm:px-8 py-3">
        {/* ── MOBILE / TABLET layout ── */}

        {/* Hamburger - left, mobile only */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[#134d37] p-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Logo - center, mobile only */}
        <Link
          to="/"
          className="md:hidden flex-1 text-center text-lg font-bold text-[#134d37] tracking-tight"
        >
          GreenRoots
        </Link>

        {/* Cart - right, mobile only */}
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `md:hidden relative transition-colors ${isActive ? "text-[#134d37]" : "text-gray-500 hover:text-[#134d37]"}`
          }
          aria-label={`Panier${totalItems > 0 ? ` (${totalItems} article${totalItems > 1 ? "s" : ""})` : ""}`}
        >
          <ShoppingCart className="w-[18px] h-[18px]" />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </NavLink>

        {/* ── DESKTOP layout ── */}

        {/* Logo - left */}
        <Link
          to="/"
          className="hidden md:block text-lg font-bold text-[#134d37] tracking-tight"
        >
          GreenRoots
        </Link>

        {/* Spacer pushes nav + cart to the right */}
        <div className="hidden md:flex flex-1" />

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 mr-6">
          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive
                  ? "text-[#134d37] border-b-2 border-[#134d37]"
                  : "text-gray-500 hover:text-[#134d37]"
              }`
            }
          >
            Catalogue
          </NavLink>
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <NavLink
                  to="/admin/trees"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[#134d37] border-b-2 border-[#134d37]"
                        : "text-gray-500 hover:text-[#134d37]"
                    }`
                  }
                >
                  Admin
                </NavLink>
              )}
              <NavLink
                to="/profil"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#134d37] border-b-2 border-[#134d37]"
                      : "text-gray-500 hover:text-[#134d37]"
                  }`
                }
              >
                Profil
              </NavLink>
              <button
                onClick={() => logout()}
                className="text-sm font-medium text-gray-500 hover:text-[#134d37] transition-colors"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#134d37] border-b-2 border-[#134d37]"
                    : "text-gray-500 hover:text-[#134d37]"
                }`
              }
            >
              Créer un compte
            </NavLink>
          )}
        </nav>

        {/* Cart - right */}
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `hidden md:block relative transition-colors ${isActive ? "text-[#134d37]" : "text-gray-500 hover:text-[#134d37]"}`
          }
          aria-label={`Panier${totalItems > 0 ? ` (${totalItems} article${totalItems > 1 ? "s" : ""})` : ""}`}
        >
          <ShoppingCart className="w-[18px] h-[18px]" />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </NavLink>
      </div>

      {/* Mobile dropdown menu */}
      <nav
        className={`md:hidden flex flex-col bg-white border-t border-gray-100 px-5 overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-40 py-2" : "max-h-0 py-0"
        }`}
      >
        <NavLink
          to="/catalog"
          onClick={() => setMenuOpen(false)}
          className={({ isActive }) =>
            `font-medium text-sm py-3 border-b border-gray-100 transition-colors ${
              isActive
                ? "text-[#134d37] font-semibold"
                : "text-gray-500 hover:text-[#134d37]"
            }`
          }
        >
          Catalogue
        </NavLink>
        {user ? (
          <>
            {user.role === "ADMIN" && (
              <NavLink
                to="/admin/trees"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `font-medium text-sm py-3 border-b border-gray-100 transition-colors ${
                    isActive ? "text-[#134d37] font-semibold" : "text-gray-500 hover:text-[#134d37]"
                  }`
                }
              >
                Admin
              </NavLink>
            )}
            <NavLink
              to="/profil"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `font-medium text-sm py-3 border-b border-gray-100 transition-colors ${
                  isActive ? "text-[#134d37] font-semibold" : "text-gray-500 hover:text-[#134d37]"
                }`
              }
            >
              Profil
            </NavLink>
            <button
              onClick={() => { logout(); setMenuOpen(false); }}
              className="font-medium text-sm py-3 text-left text-gray-500 hover:text-[#134d37] transition-colors"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <NavLink
            to="/register"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `font-medium text-sm py-3 transition-colors ${
                isActive ? "text-[#134d37] font-semibold" : "text-gray-500 hover:text-[#134d37]"
              }`
            }
          >
            Créer un compte
          </NavLink>
        )}
      </nav>
    </header>
  );
}
