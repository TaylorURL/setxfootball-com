/**
 * Navbar — the public top dock: a thin, full-bleed sticky bar with the brand
 * mark, primary nav links, an animated underline indicator for the active
 * route, and the sign-up CTA. The bar uses a translucent backdrop-blurred
 * chrome with a strong border so it stays legible over BOTH the dark hero and
 * the light paper sections beneath as you scroll. The bar itself adopts the
 * register of whichever section is currently behind it (dark or light), so
 * the wordmark, links, hamburger, and active underline always read against
 * the right contrast. On small screens the bar collapses to brand + a menu
 * trigger that opens a full-screen takeover menu (which keeps the dark
 * register regardless of what's behind it, since the takeover paints its own
 * solid surface).
 */
import { useRef } from "react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, User, LogOut, ArrowRight, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import BrandMark from "../brand/BrandMark";
import { PUBLIC_NAV_LINKS, REGISTER_PATH } from "./navLinks";
import useAdaptiveNavSurface from "../../hooks/useAdaptiveNavSurface";

const DockLink = ({ to, label }) => (
  <NavLink
    to={to}
    end={to === "/"}
    className={({ isActive }) =>
      `nav-underline mono-tag relative inline-flex items-center px-3 py-5 transition-colors duration-200 ${
        isActive
          ? "is-active text-ds-text"
          : "text-ds-text-muted hover:text-ds-text"
      }`
    }
  >
    {label}
  </NavLink>
);

const TakeoverLink = ({ to, label, onNavigate }) => (
  <NavLink
    to={to}
    end={to === "/"}
    onClick={onNavigate}
    className={({ isActive }) =>
      `editorial-display editorial-display-tight text-left text-5xl transition-colors duration-200 hover:text-ds-accent-bright sm:text-6xl ${
        isActive ? "text-ds-text" : "text-ds-text-muted"
      }`
    }
  >
    {label}
  </NavLink>
);

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleSignOut = () => {
    signOut();
    closeMenu();
  };

  const authLinkClass =
    "mono-tag inline-flex items-center gap-2 px-3 py-2 text-ds-text-muted transition-colors duration-200 hover:text-ds-text";

  return (
    <>
      {/* The navbar always renders on the dark register (data-theme="gray")
          regardless of the section beneath it, so its tokens, contrast, and
          accent color stay reliable across every route. */}
      <header
        data-theme="gray"
        className="fixed inset-x-0 top-0 z-sticky border-b border-ds-border bg-ds-bg/85 text-ds-text backdrop-blur-md backdrop-saturate-150"
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
              className="press-down group mono-tag inline-flex items-center gap-2 border border-ds-accent bg-ds-accent px-4 py-2.5 text-white transition-colors duration-200 hover:bg-ds-accent-bright hover:border-ds-accent-bright"
            >
              Sign Up
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
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

      {/* Full-screen takeover menu (mobile) — also pinned to the dark register
          so the menu reads consistently regardless of the page beneath it. */}
      <div
        data-theme="gray"
        className={`fixed inset-0 z-modal flex flex-col bg-ds-bg text-ds-text transition-opacity duration-300 md:hidden ${
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
          {PUBLIC_NAV_LINKS.map((link) => (
            <TakeoverLink key={link.to} to={link.to} label={link.label} onNavigate={closeMenu} />
          ))}
        </div>

        <div className="space-y-3 border-t border-ds-border p-5">
          <Link
            to={REGISTER_PATH}
            onClick={closeMenu}
            className="press-down mono-tag flex w-full items-center justify-center gap-2 bg-ds-accent px-5 py-4 text-white hover:bg-ds-accent-bright"
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
