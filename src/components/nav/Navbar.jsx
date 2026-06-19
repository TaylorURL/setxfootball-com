/**
 * Navbar — the public "command dock": a centered, always-floating pill nav.
 *
 * A single compact rounded dock holds the brand, the in-page section links
 * (with a scroll-spy active indicator on the landing page), and the action
 * cluster (Sign Up, auth, theme). On small screens the dock collapses to brand
 * + a menu trigger that opens a full-screen takeover menu — a deliberately
 * immersive pattern rather than a dropdown.
 *
 * Section links smooth-scroll when `onSectionSelect` is supplied (landing page);
 * otherwise they route to the landing anchors.
 *
 * @param {object} props
 * @param {string[]} [props.sections] - In-page section ids to surface as links.
 * @param {(id: string) => void} [props.onSectionSelect] - Smooth-scroll handler.
 */
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, ArrowRight, LayoutDashboard } from "lucide-react";
import { Button, IconButton, ThemeToggle } from "@bradley-t-t/sunday-design-system";
import { useAuth } from "../../context/AuthContext";
import { useScrollSpy } from "../../hooks/useScrollSpy";
import BrandMark from "../brand/BrandMark";

const SectionLink = ({ id, active, onSelect, large }) =>
  large ? (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className="ds-press heading-stencil flex items-center gap-4 text-left text-4xl text-ds-text transition-colors duration-150 ease-ds-out hover:text-ds-accent-bright sm:text-5xl"
    >
      <span
        aria-hidden="true"
        className={`inline-block h-2.5 w-2.5 rounded-full transition-colors duration-150 ${active ? "bg-ds-accent" : "bg-ds-border-strong"}`}
      />
      {id}
    </button>
  ) : (
    <button
      type="button"
      onClick={() => onSelect(id)}
      aria-current={active ? "true" : undefined}
      className={`ds-press relative rounded-ds-full px-3.5 py-2 text-[13px] font-bold uppercase tracking-[0.08em] capitalize transition-colors duration-150 ease-ds-out ${
        active ? "text-ds-text" : "text-ds-text-muted hover:text-ds-text"
      }`}
    >
      {active && (
        <span aria-hidden="true" className="absolute inset-0 -z-0 rounded-ds-full bg-ds-surface-2" />
      )}
      <span className="relative z-10">{id}</span>
    </button>
  );

const Navbar = ({ sections = [], onSectionSelect }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const spySections = useMemo(() => (onSectionSelect ? sections : []), [onSectionSelect, sections]);
  const activeSection = useScrollSpy(spySections);

  const goToSection = (id) => {
    setMenuOpen(false);
    if (onSectionSelect) onSectionSelect(id);
    else navigate(`/#${id}`);
  };

  const handleSignOut = () => {
    signOut();
    setMenuOpen(false);
  };

  const authLinkClass =
    "ds-press inline-flex items-center gap-1.5 rounded-ds-full px-3 py-2 text-[13px] font-bold uppercase tracking-[0.08em] text-ds-text-muted transition-colors duration-150 ease-ds-out hover:text-ds-text";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-sticky px-4 pt-4 sm:pt-5">
        <nav className="relative mx-auto flex max-w-5xl items-center gap-2 overflow-hidden rounded-ds-full border border-ds-border bg-ds-bg-elevated/85 p-2 pl-3 shadow-ds-lg backdrop-blur-xl sm:gap-3 sm:pl-4">
          <span aria-hidden="true" className="sideline-stripes pointer-events-none absolute inset-x-10 top-0 h-0.5 opacity-70" />
          <BrandMark
            size="sm"
            onClick={() => goToSection(sections[0] ?? "home")}
            className="shrink-0"
          />

          <div className="mx-auto hidden items-center gap-0.5 md:flex">
            {sections.map((section) => (
              <SectionLink
                key={section}
                id={section}
                active={activeSection === section}
                onSelect={goToSection}
              />
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
            <ThemeToggle variant="icon" />
            <Button
              variant="primary"
              size="sm"
              className="font-bold uppercase tracking-[0.08em]"
              onClick={() => goToSection("register")}
            >
              Sign Up <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="ml-auto flex items-center gap-1.5 md:hidden">
            <ThemeToggle variant="icon" />
            <IconButton
              label="Open menu"
              variant="ghost"
              onClick={() => setMenuOpen(true)}
            >
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
        <div aria-hidden="true" className="sideline-stripes h-1.5 w-full opacity-80" />
        <div className="flex items-center justify-between px-5 py-4">
          <BrandMark size="sm" to="/" />
          <IconButton label="Close menu" variant="ghost" onClick={() => setMenuOpen(false)}>
            <X className="h-5 w-5" />
          </IconButton>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-6 px-7">
          {sections.map((section) => (
            <SectionLink
              key={section}
              id={section}
              active={activeSection === section}
              onSelect={goToSection}
              large
            />
          ))}
        </div>

        <div className="space-y-3 border-t border-ds-border p-5">
          <Button
            variant="primary"
            size="lg"
            block
            className="font-bold uppercase tracking-[0.08em]"
            onClick={() => goToSection("register")}
          >
            Sign Up Your Camper <ArrowRight className="h-4 w-4" />
          </Button>
          {user ? (
            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="secondary" size="lg" onClick={() => setMenuOpen(false)}>
                <Link to="/dashboard">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
              </Button>
              <Button variant="outline" size="lg" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </div>
          ) : (
            <Button asChild variant="secondary" size="lg" block onClick={() => setMenuOpen(false)}>
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
