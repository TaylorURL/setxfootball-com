/**
 * Navbar — the public marketing top navigation.
 *
 * Two presentations from one component:
 *  - Over the hero (`transparent`): floats over the dark hero imagery, condenses
 *    into a glassy floating card after the first scroll threshold.
 *  - On inner pages (default): a solid, blurred header bound to the active
 *    theme with section entries linking back to the landing anchors.
 *
 * Carries the brand mark with a sideline-stripe accent, varsity Register CTA,
 * auth entry, and the design-system ThemeToggle.
 */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, ArrowRight } from "lucide-react";
import { Button, IconButton, ThemeToggle } from "@bradley-t-t/sunday-design-system";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.PNG";

const SCROLL_THRESHOLD = 32;

const Brand = ({ onClick, light }) => {
  const wordmarkTone = light ? "text-white" : "text-ds-text";
  const subTone = light ? "text-white/65" : "text-ds-text-muted";
  const content = (
    <>
      <span className="relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-ds-md bg-ds-accent shadow-[0_4px_14px_-6px_rgba(191,10,48,0.6)] ring-1 ring-white/15">
        <img src={logo} alt="" className="h-9 w-9 object-contain" />
      </span>
      <span className="ml-3 hidden text-left sm:block">
        <span className={`block text-[15px] font-black uppercase tracking-[0.04em] ${wordmarkTone}`}>
          SETX Football
        </span>
        <span className={`mt-0.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.22em] ${subTone}`}>
          <span className="inline-block h-0.5 w-3 bg-ds-accent" />
          Youth Camp · Daisetta TX
        </span>
      </span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="group flex items-center" aria-label="Go to top">
        {content}
      </button>
    );
  }
  return (
    <Link to="/" className="group flex items-center" aria-label="SETX Football home">
      {content}
    </Link>
  );
};

const Navbar = ({ transparent = false, sections = [], onSectionSelect }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!transparent) return undefined;
    const handleScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [transparent]);

  const light = transparent && !scrolled;

  const goToSection = (id) => {
    setMobileOpen(false);
    if (onSectionSelect) {
      onSectionSelect(id);
    } else {
      navigate(`/#${id}`);
    }
  };

  const linkTone = light
    ? "text-white/80 hover:text-white hover:bg-white/10"
    : "text-ds-text-muted hover:text-ds-text hover:bg-ds-surface-2";

  const renderAuth = (mobile = false) => {
    const base = `inline-flex items-center gap-1.5 rounded-ds-sm px-3 py-2 text-sm font-semibold transition-colors duration-150 ease-ds-out ${linkTone} ${mobile ? "w-full" : ""}`;
    if (user) {
      return (
        <>
          <Link to="/dashboard" onClick={() => setMobileOpen(false)} className={base}>
            <User className="h-4 w-4" /> Dashboard
          </Link>
          <button
            type="button"
            onClick={() => {
              signOut();
              setMobileOpen(false);
            }}
            className={base}
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </>
      );
    }
    return (
      <Link to="/auth" onClick={() => setMobileOpen(false)} className={base}>
        <User className="h-4 w-4" /> Login
      </Link>
    );
  };

  const shellClass = transparent
    ? `mx-auto max-w-7xl px-4 transition-[background-color,box-shadow,border-color] duration-200 ease-ds-out sm:px-6 lg:px-8 ${
        scrolled
          ? "rounded-ds-2xl border border-ds-border bg-ds-bg-elevated/90 shadow-ds-lg backdrop-blur-xl"
          : "border border-transparent"
      }`
    : "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

  return (
    <nav
      className={
        transparent
          ? `fixed inset-x-0 top-0 z-sticky transition-[padding] duration-200 ease-ds-out ${scrolled ? "py-2" : "py-4"}`
          : "sticky top-0 z-sticky border-b border-ds-border bg-ds-bg-elevated/85 backdrop-blur-xl"
      }
    >
      <div className={shellClass}>
        <div className="flex items-center justify-between py-2">
          <Brand onClick={transparent ? () => goToSection(sections[0] ?? "home") : undefined} light={light} />

          <div className="hidden items-center gap-1 md:flex">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => goToSection(section)}
                className={`rounded-ds-sm px-3.5 py-2 text-sm font-semibold capitalize tracking-wide transition-colors duration-150 ease-ds-out ${linkTone}`}
              >
                {section}
              </button>
            ))}
            <Button
              variant="primary"
              size="sm"
              className="ml-3 font-bold uppercase tracking-[0.06em]"
              onClick={() => goToSection("register")}
            >
              Sign Up
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            {renderAuth()}
            <ThemeToggle variant="icon" className={light ? "ml-1 border-white/20 bg-white/10 text-white" : "ml-1"} />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle variant="icon" className={light ? "border-white/20 bg-white/10 text-white" : ""} />
            <IconButton
              label={mobileOpen ? "Close menu" : "Open menu"}
              variant="ghost"
              onClick={() => setMobileOpen((open) => !open)}
              className={light ? "text-white hover:bg-white/10" : ""}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </IconButton>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-ds-out md:hidden ${
            mobileOpen ? "mt-2 max-h-[520px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-1 rounded-ds-xl border border-ds-border bg-ds-bg-elevated p-2 shadow-ds-lg">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => goToSection(section)}
                className="block w-full rounded-ds-sm px-4 py-3 text-left text-sm font-semibold capitalize text-ds-text-muted transition-colors duration-150 ease-ds-out hover:bg-ds-surface-2 hover:text-ds-text"
              >
                {section}
              </button>
            ))}
            <Button variant="primary" block className="font-bold uppercase tracking-[0.06em]" onClick={() => goToSection("register")}>
              Sign Up
            </Button>
            {renderAuth(true)}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
