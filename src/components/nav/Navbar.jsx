/**
 * The bar is translucent and sits over alternating light and dark sections, so
 * it adopts the register of whatever is currently behind it rather than picking
 * one contrast and hoping. The mobile takeover is the exception: it paints its
 * own solid surface, so it stays dark regardless.
 */
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, User, LogOut, ArrowRight, LayoutDashboard, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import BrandMark from "../brand/BrandMark";
import { PUBLIC_NAV_LINKS, REGISTER_PATH, NAV_PANEL } from "./navLinks";
import { actionClass } from "../ui/actionClass";
import useAdaptiveNavSurface from "../../hooks/useAdaptiveNavSurface";

// A plain string className lets React Router add its own `active` class, which
// is what the underline and the current-page colour key off.
const DOCK_LINK_CLASS =
  "nav-underline mono-tag relative inline-flex min-h-control items-center px-3 text-ds-text-muted hover:text-ds-text [&.active]:text-ds-text";

const TAKEOVER_LINK_CLASS =
  "editorial-display editorial-display-tight text-left text-5xl text-ds-text-muted hover:text-ds-accent-bright sm:text-6xl [&.active]:text-ds-text";

const AUTH_LINK_CLASS =
  "mono-tag inline-flex min-h-control items-center gap-2 px-3 text-ds-text-muted hover:text-ds-text";

const PANEL_ID = "site-directory";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const headerRef = useRef(null);
  const surface = useAdaptiveNavSurface(headerRef);

  const closeMenu = () => setMenuOpen(false);
  const closePanel = () => setPanelOpen(false);

  const handleSignOut = () => {
    signOut();
    closeMenu();
  };

  // The panel closes on Escape and on a click outside the bar, so it never
  // outlives the reader's attention.
  useEffect(() => {
    if (!panelOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setPanelOpen(false);
    };
    const onPointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) setPanelOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [panelOpen]);

  // A full-screen takeover has to be escapable, and the page behind it must not
  // scroll while it is up.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <>
      {/* Setting data-surface here is what swaps every --ds-* token for the bar
          and its children at once. */}
      <header
        ref={headerRef}
        data-theme="gray"
        data-surface={surface === "light" ? "light" : undefined}
        className="fixed inset-x-0 top-0 z-sticky-nav border-b border-ds-border bg-ds-bg/85 text-ds-text backdrop-blur-md backdrop-saturate-150"
      >
        <nav
          aria-label="Primary"
          className="relative mx-auto flex min-h-[var(--header-height)] w-full max-w-[1440px] items-center gap-6 px-5 sm:px-8 lg:px-10"
        >
          <BrandMark size="sm" to="/" className="shrink-0" />

          <div className="mx-auto hidden items-center md:flex">
            {PUBLIC_NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === "/"} className={DOCK_LINK_CLASS}>
                {link.label}
              </NavLink>
            ))}
            <button
              type="button"
              aria-expanded={panelOpen}
              aria-haspopup="true"
              aria-controls={PANEL_ID}
              onClick={() => setPanelOpen((open) => !open)}
              className={`${DOCK_LINK_CLASS} gap-1.5`}
            >
              Everything
              <ChevronDown
                className={`h-3 w-3 transition-transform duration-state ease-out ${
                  panelOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="ml-auto hidden items-center gap-2 md:flex">
            {user ? (
              <Link to="/dashboard" className={AUTH_LINK_CLASS}>
                <LayoutDashboard className="h-3.5 w-3.5" aria-hidden="true" /> Dashboard
              </Link>
            ) : (
              <Link to="/auth" className={AUTH_LINK_CLASS}>
                <User className="h-3.5 w-3.5" aria-hidden="true" /> Log In
              </Link>
            )}
            <Link to={REGISTER_PATH} className={actionClass({ size: "sm" })}>
              Sign Up
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-2 md:hidden">
            <button
              type="button"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className={actionClass({ tone: "secondary", size: "sm" })}
            >
              <Menu className="h-4 w-4" aria-hidden="true" /> Menu
            </button>
          </div>
        </nav>

        {/* The panel is part of the bar's own surface rather than a card
            floating under it, so the two read as one sheet. */}
        <div
          id={PANEL_ID}
          className={`nav-mega-panel absolute inset-x-0 top-full hidden border-b border-ds-border bg-ds-bg/95 backdrop-blur-md transition-[opacity,transform] duration-state ease-out md:block ${
            panelOpen ? "opacity-100" : "pointer-events-none invisible -translate-y-2 opacity-0"
          }`}
        >
          <div className="mx-auto grid w-full max-w-[1440px] grid-cols-2 gap-10 px-5 py-8 sm:px-8 lg:px-10">
            {NAV_PANEL.map(({ heading, items }) => (
              <div key={heading}>
                <p className="mono-tag-sm text-ds-text-faint">{heading}</p>
                <ul className="mt-4 space-y-1">
                  {items.map(({ label, to, note }) => (
                    <li key={to}>
                      <Link
                        to={to}
                        onClick={closePanel}
                        className="block border-l border-transparent py-2 pl-4 hover:border-ds-accent"
                      >
                        <span className="block text-base font-semibold text-ds-text">{label}</span>
                        <span className="block text-[13px] text-ds-text-muted">{note}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* `invisible` rather than opacity alone: an opacity-0 panel keeps every
          link in the tab order, so a keyboard lands inside a closed menu. */}
      <div
        data-theme="gray"
        aria-label="Site Menu"
        className={`fixed inset-0 z-modal flex flex-col bg-ds-bg text-ds-text transition-opacity duration-state md:hidden ${
          menuOpen ? "opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ds-border px-5 py-4">
          <BrandMark size="sm" to="/" className="control" onClick={closeMenu} />
          <button
            type="button"
            onClick={closeMenu}
            className={actionClass({ tone: "secondary", size: "sm" })}
          >
            <X className="h-4 w-4" aria-hidden="true" /> Close
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-7 px-8">
          {PUBLIC_NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={closeMenu}
              className={TAKEOVER_LINK_CLASS}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="space-y-3 border-t border-ds-border p-5">
          <Link
            to={REGISTER_PATH}
            onClick={closeMenu}
            className={actionClass({ size: "lg", block: true })}
          >
            Sign Up Your Camper <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          {user ? (
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/dashboard"
                onClick={closeMenu}
                className={actionClass({ tone: "secondary", block: true })}
              >
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" /> Dashboard
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className={actionClass({ tone: "secondary", block: true })}
              >
                <LogOut className="h-4 w-4" aria-hidden="true" /> Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              onClick={closeMenu}
              className={actionClass({ tone: "secondary", block: true })}
            >
              <User className="h-4 w-4" aria-hidden="true" /> Log In
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
