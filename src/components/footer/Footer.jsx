/**
 * Footer — the public marketing footer.
 *
 * Large left-aligned wordmark wall, four-column nav grid with small uppercase
 * eyebrows, a hairline divider, and a bottom row with copyright and legal
 * links. Sharp corners throughout.
 */
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Calendar, Users, Shirt, ArrowUpRight } from "lucide-react";
import { PUBLIC_NAV_LINKS, REGISTER_PATH } from "../nav/navLinks";

const QUICK_LINKS = [
  ...PUBLIC_NAV_LINKS,
  { label: "Sign Up", to: REGISTER_PATH },
  { label: "Design", to: "/design" },
];

const CONTACTS = [
  { icon: MapPin, text: "Daisetta, TX" },
  { icon: Phone, text: "936-641-0681" },
  { icon: Mail, text: "hanksclayton81@gmail.com" },
];

const CAMP_FACTS = [
  { icon: Calendar, title: "July 2026", subtitle: "Two half-day sessions" },
  { icon: Users, title: "Ages 5–12", subtitle: "All skill levels welcome" },
  { icon: Shirt, title: "$5 per shirt", subtitle: "Includes drinks & snacks" },
];

const FooterColumn = ({ title, children }) => (
  <div>
    <span className="mono-tag mb-6 inline-flex items-center gap-2 text-ds-accent-bright">
      <span aria-hidden="true" className="inline-block h-px w-4 bg-ds-accent" />
      {title}
    </span>
    {children}
  </div>
);

const Footer = () => (
  <footer className="relative border-t border-ds-border bg-ds-bg">
    <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
      <div className="grid grid-cols-1 gap-10 border-b border-ds-border py-16 lg:grid-cols-[1.4fr_1fr] lg:py-20">
        <div>
          <span className="mono-tag inline-flex items-center gap-2 text-ds-accent-bright">
            <span aria-hidden="true" className="inline-block h-px w-4 bg-ds-accent" />
            SETX Youth Football Camp
          </span>
          <p className="editorial-display editorial-display-tight mt-6 text-4xl text-ds-text sm:text-5xl lg:text-6xl">
            Built for our community.<br />
            <span className="text-ds-text-faint">Open to every kid.</span>
          </p>
          <Link
            to={REGISTER_PATH}
            className="mono-tag mt-8 inline-flex items-center gap-2 border border-ds-accent bg-ds-accent px-5 py-3 text-white transition-colors duration-200 hover:bg-ds-accent-bright hover:border-ds-accent-bright"
          >
            Sign Up Your Camper <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:gap-6">
          {CAMP_FACTS.map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="left-rule-accent pl-4">
              <Icon className="h-4 w-4 text-ds-accent-bright" aria-hidden="true" />
              <p className="editorial-display mt-3 text-2xl text-ds-text">{title}</p>
              <p className="mono-tag-sm mt-2 text-ds-text-faint">{subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 py-14 md:grid-cols-2 lg:grid-cols-4">
        <FooterColumn title="Pages">
          <ul className="space-y-3">
            {QUICK_LINKS.map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="inline-flex items-center gap-2 text-[15px] text-ds-text-muted transition-colors duration-200 hover:text-ds-text"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>

        <FooterColumn title="Contact">
          <div className="space-y-3">
            {CONTACTS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <Icon className="h-3.5 w-3.5 shrink-0 text-ds-accent-bright" />
                <span className="text-[15px] text-ds-text-muted">{text}</span>
              </div>
            ))}
          </div>
        </FooterColumn>

        <FooterColumn title="When">
          <div className="left-rule-accent pl-4">
            <p className="editorial-display text-2xl text-ds-text">
              July 2026
            </p>
            <p className="mono-tag-sm mt-2 text-ds-text-faint">
              Now in our third year
            </p>
          </div>
        </FooterColumn>

        <FooterColumn title="Where">
          <p className="text-[15px] text-ds-text-muted">
            Daisetta, Texas
          </p>
          <p className="mono-tag-sm mt-2 text-ds-text-faint">
            Liberty County · Southeast Texas
          </p>
        </FooterColumn>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 border-t border-ds-border py-6 sm:flex-row sm:items-center">
        <span className="mono-tag-sm text-ds-text-faint">
          © {new Date().getFullYear()} · SETX Youth Football Camp · All rights reserved
        </span>
        <div className="flex items-center gap-5">
          <Link
            to="/privacy"
            className="mono-tag-sm text-ds-text-muted transition-colors duration-200 hover:text-ds-text"
          >
            Privacy
          </Link>
          <Link
            to="/terms"
            className="mono-tag-sm text-ds-text-muted transition-colors duration-200 hover:text-ds-text"
          >
            Terms
          </Link>
          <a
            href="https://taylorurl.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mono-tag-sm inline-flex items-center gap-1 text-ds-text-muted transition-colors duration-200 hover:text-ds-text"
          >
            Built by TaylorURL <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
