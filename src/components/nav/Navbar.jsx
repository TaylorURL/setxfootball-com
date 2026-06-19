/**
 * Navbar — the public "command dock": a centered, always-floating pill nav.
 *
 * A single compact rounded dock holds the brand, the routed section links (with
 * an active indicator driven by the current route), and the action cluster
 * (Login / Dashboard, Sign Up). On small screens the dock collapses to brand +
 * a menu trigger that opens a full-screen takeover menu — a deliberately
 * immersive pattern rather than a dropdown.
 */
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, User, LogOut, ArrowRight, LayoutDashboard } from "lucide-react";
import { Button, IconButton } from "@bradley-t-t/sunday-design-system";
import { useAuth } from "../../context/AuthContext";
import BrandMark from "../brand/BrandMark";
import { PUBLIC_NAV_LINKS, REGISTER_PATH } from "./navLinks";

const DockLink = ({ to, label }) => (
  <NavLink
    to={to}
    end={to === "/"}
    className={({ isActive }) =>
      `ds-press relative rounded-ds-full px-3.5 py-2 text-[13px] font-bold uppercase tracking-[0.08em] transition-colors duration-150 ease-ds-out ${
        isActive ? "text-ds-text" : "text-ds-text-muted hover:text-ds-text"
      }`
    }
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <span aria-hidden="true" className="absolute inset-0 -z-0 rounded-ds-full bg-ds-surface-2" />
        )}
        <span className="relative z-10">{label}</span>
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
      `ds-press heading-stencil flex items-center gap-4 text-left text-4xl transition-colors duration-150 ease-ds-out hover:text-ds-accent-bright sm:text-5xl ${
        isActive ? "text-ds-text" : "text-ds-text-muted"
      }`
    }
  >
    {({ isActive }) => (
      <>
        <span
          aria-hidden="true"
          className={`inline-block h-2.5 w-2.5 rounded-full transition-colors duration-150 ${isActive ? "bg-ds-accent" : "bg-ds-border-strong"}`}
        />
        {label}
      </>
    )}
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
    "ds-press inline-flex items-center gap-1.5 rounded-ds-full px-3 py-2 text-[13px] font-bold uppercase tracking-[0.08em] text-ds-text-muted transition-colors duration-150 ease-ds-out hover:text-ds-text";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-sticky px-4 pt-4 sm:pt-5">
        <nav className="relative mx-auto flex max-w-5xl items-center gap-2 overflow-hidden rounded-ds-full border border-ds-border bg-ds-bg-elevated/85 p-2 pl-3 shadow-ds-lg backdrop-blur-xl sm:gap-3 sm:pl-4">
          <BrandMark size="sm" to="/" className="shrink-0" />

          <div className="mx-auto hidden items-center gap-0.5 md:flex">
            {PUBLIC_NAV_LINKS.map((link) => (
              <DockLink key={link.to} to={link.to} label={link.label} />
            ))}
          </div>

          <div className="ml-auto hidden items-center gap-1.5 md:flex">
            {user ? (
              <Link to="/dashboard" className={authLinkClass}>
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
            ) : (
              <Link to="/auth" className={authLinkClass}>
                <User className="h-4 w-4" /> Login
              </Link>
            )}
            <Button asChild variant="primary" size="sm" className="font-bold uppercase tracking-[0.08em]">
              <Link to={REGISTER_PATH}>
                Sign Up <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <div className="ml-auto flex items-center gap-1.5 md:hidden">
            <IconButton label="Open menu" variant="ghost" onClick={() => setMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </IconButton>
          </div>
        </nav>
      </header>

      {/* Full-screen takeover menu (mobile) */}
      <div
        className={`fixed inset-0 z-modal flex flex-col bg-ds-bg transition-opacity duration-200 ease-ds-out md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div aria-hidden="true" className="accent-edge h-1.5 w-full" />
        <div className="flex items-center justify-between px-5 py-4">
          <BrandMark size="sm" to="/" onClick={closeMenu} />
          <IconButton label="Close menu" variant="ghost" onClick={closeMenu}>
            <X className="h-5 w-5" />
          </IconButton>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-6 px-7">
          {PUBLIC_NAV_LINKS.map((link) => (
            <TakeoverLink key={link.to} to={link.to} label={link.label} onNavigate={closeMenu} />
          ))}
        </div>

        <div className="space-y-3 border-t border-ds-border p-5">
          <Button
            asChild
            variant="primary"
            size="lg"
            block
            className="font-bold uppercase tracking-[0.08em]"
            onClick={closeMenu}
          >
            <Link to={REGISTER_PATH}>
              Sign Up Your Camper <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          {user ? (
            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="secondary" size="lg" onClick={closeMenu}>
                <Link to="/dashboard">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
              </Button>
              <Button variant="outline" size="lg" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </div>
          ) : (
            <Button asChild variant="secondary" size="lg" block onClick={closeMenu}>
              <Link to="/auth">
                <User className="h-4 w-4" /> Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
