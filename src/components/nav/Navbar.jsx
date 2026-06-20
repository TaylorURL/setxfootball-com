/**
 * Navbar — the public top dock: a thin, full-bleed sticky bar with minimal
 * monospace labels and an underline indicator for the active route. Editorial
 * register, restrained surface (translucent over the page beneath), sharp
 * edges. On small screens the bar collapses to brand + a menu trigger that
 * opens a full-screen takeover menu — deliberately immersive.
 */
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, User, LogOut, ArrowRight, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import BrandMark from "../brand/BrandMark";
import { PUBLIC_NAV_LINKS, REGISTER_PATH } from "./navLinks";

const DockLink = ({ to, label }) => (
  <NavLink
    to={to}
    end={to === "/"}
    className={({ isActive }) =>
      `mono-tag relative inline-flex items-center px-3 py-5 transition-colors duration-200 ${
        isActive ? "text-ds-text" : "text-ds-text-muted hover:text-ds-text"
      }`
    }
  >
    {({ isActive }) => (
      <>
        {label}
        {isActive && (
          <span
            aria-hidden="true"
            className="absolute inset-x-3 bottom-0 h-px bg-ds-accent"
          />
        )}
      </>
    )}
  </NavLink>
);

const TakeoverLink = ({ to, label, onNavigate }) => (
  <NavLink
    to={to}
    end={to === "/"}
    onClick={onNavigate}
    className={({ isActive }) =>
      `editorial-display editorial-display-tight flex items-baseline gap-5 text-left text-5xl transition-colors duration-200 hover:text-ds-accent-bright sm:text-6xl ${
        isActive ? "text-ds-text" : "text-ds-text-muted"
      }`
    }
  >
    {({ isActive }) => (
      <>
        <span
          aria-hidden="true"
          className={`mono-tag-sm inline-block min-w-[28px] translate-y-[-0.6em] ${
            isActive ? "text-ds-accent-bright" : "text-ds-text-faint"
          }`}
        >
          0{PUBLIC_NAV_LINKS.findIndex((l) => l.to === to) + 1}
        </span>
        {label}
      </>
    )}
  </NavLink>
);

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleSignOut = () => {
    signOut();
    closeMenu();
  };

  const authLinkClass =
    "mono-tag inline-flex items-center gap-2 px-3 py-2 text-ds-text-muted transition-colors duration-200 hover:text-ds-text";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-sticky transition-colors duration-300 ${
          scrolled
            ? "border-b border-ds-border bg-ds-bg/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="relative mx-auto flex w-full max-w-[1440px] items-center gap-6 px-5 sm:px-8 lg:px-10"
        >
          <BrandMark size="sm" to="/" className="shrink-0" />

          <div className="mx-auto hidden items-center md:flex">
            {PUBLIC_NAV_LINKS.map((link) => (
              <DockLink key={link.to} to={link.to} label={link.label} />
            ))}
          </div>

          <div className="ml-auto hidden items-center gap-2 md:flex">
            {user ? (
              <Link to="/dashboard" className={authLinkClass}>
                <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
              </Link>
            ) : (
              <Link to="/auth" className={authLinkClass}>
                <User className="h-3.5 w-3.5" /> Login
              </Link>
            )}
            <Link
              to={REGISTER_PATH}
              className="mono-tag inline-flex items-center gap-2 border border-ds-accent bg-ds-accent px-4 py-2.5 text-white transition-colors duration-200 hover:bg-ds-accent-bright hover:border-ds-accent-bright"
            >
              Sign Up <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-1.5 md:hidden">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="mono-tag inline-flex items-center gap-2 border border-ds-border-strong px-3 py-2 text-ds-text-muted transition-colors duration-200 hover:text-ds-text hover:border-ds-text-muted"
            >
              <Menu className="h-4 w-4" /> Menu
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen takeover menu (mobile) */}
      <div
        className={`fixed inset-0 z-modal flex flex-col bg-ds-bg transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ds-border px-5 py-4">
          <BrandMark size="sm" to="/" onClick={closeMenu} />
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="mono-tag inline-flex items-center gap-2 border border-ds-border-strong px-3 py-2 text-ds-text-muted hover:text-ds-text"
          >
            <X className="h-4 w-4" /> Close
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-7 px-8">
          <span className="mono-tag-sm text-ds-text-faint">/ Navigation</span>
          {PUBLIC_NAV_LINKS.map((link) => (
            <TakeoverLink key={link.to} to={link.to} label={link.label} onNavigate={closeMenu} />
          ))}
        </div>

        <div className="space-y-3 border-t border-ds-border p-5">
          <Link
            to={REGISTER_PATH}
            onClick={closeMenu}
            className="mono-tag flex w-full items-center justify-center gap-2 bg-ds-accent px-5 py-4 text-white hover:bg-ds-accent-bright"
          >
            Sign Up Your Camper <ArrowRight className="h-4 w-4" />
          </Link>
          {user ? (
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/dashboard"
                onClick={closeMenu}
                className="mono-tag inline-flex items-center justify-center gap-2 border border-ds-border-strong px-3 py-3 text-ds-text-muted hover:text-ds-text"
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="mono-tag inline-flex items-center justify-center gap-2 border border-ds-border-strong px-3 py-3 text-ds-text-muted hover:text-ds-text"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              onClick={closeMenu}
              className="mono-tag flex w-full items-center justify-center gap-2 border border-ds-border-strong px-3 py-3 text-ds-text-muted hover:text-ds-text"
            >
              <User className="h-4 w-4" /> Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
