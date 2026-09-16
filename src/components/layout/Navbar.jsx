/**
 * The bar is the one navy band at the top of every page: the brand at the
 * left, the five pages across the middle, the way in at the right, and a red
 * hairline along its foot. The current page carries a red bar under its word.
 *
 * The directory drops under the bar as a white sheet: the pages with their
 * marks and a line each, and the two ways to reach the camp beside them. On
 * a phone the same pages open as a navy takeover.
 */
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown, Phone, Mail } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import BrandMark from "./BrandMark";
import { PUBLIC_NAV_LINKS, REGISTER_PATH, NAV_PANEL } from "./navLinks";
import { actionClass } from "../ui/actionClass";
import CampIcon from "../ui/CampIcon";
import { CAMP_PHONE, CAMP_EMAIL } from "../../utils/constants";

// A plain string className lets React Router add its own `active` class, which
// is what the red bar keys off.
const BAR_LINK_CLASS =
  "nav-link inline-flex h-[var(--header-height)] items-center whitespace-nowrap px-3 text-[14px] font-bold";

const TAKEOVER_LINK_CLASS =
  "display text-left text-5xl text-ds-text hover:text-ds-accent-bright sm:text-6xl [&.active]:text-ds-accent-bright";

const PANEL_ID = "site-directory";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const headerRef = useRef(null);

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
      <header
        ref={headerRef}
        data-surface="navy"
        className="fixed inset-x-0 top-0 z-sticky-nav border-b-[3px] border-ds-accent bg-ds-bg text-ds-text"
      >
        <nav
          aria-label="Primary"
          className="relative mx-auto flex h-[var(--header-height)] w-full max-w-[1160px] items-center gap-6 px-6 sm:px-10 lg:px-16"
        >
          <BrandMark size="sm" to="/" className="shrink-0" />

          <div className="mx-auto hidden items-center lg:flex">
            {PUBLIC_NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === "/"} className={BAR_LINK_CLASS}>
                {link.label}
              </NavLink>
            ))}
            <button
              type="button"
              aria-expanded={panelOpen}
              aria-haspopup="true"
              aria-controls={PANEL_ID}
              onClick={() => setPanelOpen((open) => !open)}
              className={`${BAR_LINK_CLASS} gap-1.5`}
            >
              Everything
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-state ease-out ${
                  panelOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="ml-auto hidden items-center gap-4 lg:flex">
            {user ? (
              <Link to="/dashboard" className={`${BAR_LINK_CLASS} gap-2 px-0`}>
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" /> Dashboard
              </Link>
            ) : (
              <Link to="/auth" className={`${BAR_LINK_CLASS} gap-2 px-0`}>
                <User className="h-4 w-4" aria-hidden="true" /> Log In
              </Link>
            )}
            <Link
              to={REGISTER_PATH}
              className={actionClass({ size: "sm", className: "whitespace-nowrap" })}
            >
              Sign Up
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <button
              type="button"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className={actionClass({ tone: "outline", size: "sm" })}
            >
              <Menu className="h-4 w-4" aria-hidden="true" /> Menu
            </button>
          </div>
        </nav>

        {/* The directory hangs under the bar as its own white sheet, with the
            page rule under it, so it reads as a drawer rather than a taller
            bar. */}
        <div
          id={PANEL_ID}
          data-surface="paper"
          className={`absolute inset-x-0 top-full hidden border-b-rule border-ds-border-strong bg-ds-bg text-ds-text transition-[opacity,transform] duration-state ease-out lg:block ${
            panelOpen ? "opacity-100" : "pointer-events-none invisible -translate-y-2 opacity-0"
          }`}
        >
          <div className="mx-auto grid w-full max-w-[1160px] grid-cols-[1fr_1fr_auto] gap-12 px-6 py-9 sm:px-10 lg:px-16">
            {NAV_PANEL.map(({ heading, items }) => (
              <div key={heading}>
                <p className="eyebrow">{heading}</p>
                <ul className="mt-5 -ml-3 space-y-0.5">
                  {items.map(({ label, to, icon, note }) => (
                    <li key={to}>
                      <Link
                        to={to}
                        onClick={closePanel}
                        className="flex items-start gap-3.5 rounded-ds-sm px-3 py-2.5 hover:bg-ds-surface-2"
                      >
                        <CampIcon name={icon} size={28} className="mt-0.5" />
                        <span>
                          <span className="block text-[15px] font-bold text-ds-text">{label}</span>
                          <span className="block text-[13px] leading-snug text-ds-text-muted">
                            {note}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="w-[260px] border-l-rule border-ds-border pl-12">
              <p className="eyebrow">Reach the Camp</p>
              <p className="body-copy mt-5 text-[13px] text-ds-text-muted">
                Two coaches run the camp around full-time jobs. A call reaches them fastest.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <a
                  href={`tel:${CAMP_PHONE}`}
                  onClick={closePanel}
                  className={actionClass({ tone: "outline", size: "sm", block: true })}
                >
                  <Phone className="h-4 w-4" aria-hidden="true" /> Call the Camp
                </a>
                <a
                  href={`mailto:${CAMP_EMAIL}`}
                  onClick={closePanel}
                  className={actionClass({ tone: "outline", size: "sm", block: true })}
                >
                  <Mail className="h-4 w-4" aria-hidden="true" /> Send an Email
                </a>
                <Link
                  to={REGISTER_PATH}
                  onClick={closePanel}
                  className={actionClass({ size: "sm", block: true })}
                >
                  Sign Up Your Camper
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* `invisible` rather than opacity alone: an opacity-0 panel keeps every
          link in the tab order, so a keyboard lands inside a closed menu. */}
      <div
        data-surface="navy"
        aria-label="Site Menu"
        className={`fixed inset-0 z-modal flex flex-col bg-ds-bg text-ds-text transition-opacity duration-state lg:hidden ${
          menuOpen ? "opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="flex h-[var(--header-height)] items-center justify-between border-b-[3px] border-ds-accent px-6 sm:px-10">
          <BrandMark size="sm" to="/" className="control" onClick={closeMenu} />
          <button
            type="button"
            onClick={closeMenu}
            className={actionClass({ tone: "outline", size: "sm" })}
          >
            <X className="h-4 w-4" aria-hidden="true" /> Close
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-5 px-6 sm:px-10">
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

        <div className="space-y-3 border-t border-ds-border px-6 py-5 sm:px-10">
          <Link
            to={REGISTER_PATH}
            onClick={closeMenu}
            className={actionClass({ size: "lg", block: true })}
          >
            Sign Up Your Camper
          </Link>
          {user ? (
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/dashboard"
                onClick={closeMenu}
                className={actionClass({ tone: "outline", block: true })}
              >
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" /> Dashboard
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className={actionClass({ tone: "outline", block: true })}
              >
                <LogOut className="h-4 w-4" aria-hidden="true" /> Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              onClick={closeMenu}
              className={actionClass({ tone: "outline", block: true })}
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
