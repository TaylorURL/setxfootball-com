/**
 * The site footer: a closing line, the ways to reach the camp, and the legal
 * links.
 *
 * The page index lives in the bar's directory panel rather than here, so the
 * footer closes the page instead of repeating the navigation.
 *
 * The phone and email are real `tel:` and `mailto:` links rather than plain
 * text, because on a phone this is the fastest way for a parent to reach the
 * camp.
 *
 * @param {object} props
 * @param {React.ReactNode} [props.children] - The closing band, rendered as the
 *   last thing inside the footer element so it takes the footer's own ground
 *   rather than the page body's.
 */
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Calendar, Users, Shirt, ArrowUpRight } from "lucide-react";
import { REGISTER_PATH } from "./navLinks";
import { actionClass } from "../ui/actionClass";
import { CAMP_PHONE, CAMP_EMAIL, CAMP_LOCALITY, CAMP_SEASON } from "../../utils/constants";
import { SplitText } from "../reactbits";
import { getCurrentYear } from "../../utils/helpers";

const CONTACTS = [
  { icon: MapPin, label: `${CAMP_LOCALITY}, TX`, href: null },
  { icon: Phone, label: CAMP_PHONE, href: `tel:${CAMP_PHONE}` },
  { icon: Mail, label: CAMP_EMAIL, href: `mailto:${CAMP_EMAIL}` },
];

const CAMP_FACTS = [
  { icon: Calendar, title: CAMP_SEASON, subtitle: "Two half-day sessions" },
  { icon: Users, title: "Ages 5 to 12", subtitle: "All skill levels welcome" },
  { icon: Shirt, title: "$5 per shirt", subtitle: "Includes drinks and snacks" },
];

const Footer = ({ children }) => (
  <footer className="relative border-t border-ds-border bg-ds-bg">
    <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
      <div className="grid grid-cols-1 gap-10 border-b border-ds-border py-16 lg:grid-cols-[1.4fr_1fr] lg:py-20">
        <div>
          <span className="mono-tag inline-flex items-center gap-2 text-ds-accent-bright">
            <span aria-hidden="true" className="inline-block h-px w-4 bg-ds-accent" />
            SETX Youth Football Camp
          </span>
          <p className="editorial-display editorial-display-tight mt-8 text-4xl text-ds-text sm:text-5xl lg:text-6xl">
            <SplitText text="Built for our community." splitType="words" delay={45} />
            <br />
            <span className="text-ds-text-faint">Open to every kid.</span>
          </p>
          <Link to={REGISTER_PATH} className={actionClass({ className: "mt-8" })}>
            Sign Up Your Camper <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:gap-6">
          {CAMP_FACTS.map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="left-rule-accent pl-4">
              <Icon className="h-4 w-4 text-ds-accent-bright" aria-hidden="true" />
              <p className="editorial-display mt-2 text-2xl text-ds-text">{title}</p>
              <p className="mono-tag-sm mt-2 text-ds-text-faint">{subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        {/* `address`, because this is the camp's own contact block rather than
            a list of links: it is what a reader, a screen reader and a crawler
            each look for to find who stands behind the site. */}
        <address className="flex flex-wrap items-center gap-x-8 gap-y-3 not-italic">
          {CONTACTS.map(({ icon: Icon, label, href }) =>
            href ? (
              <a
                key={label}
                href={href}
                className="inline-flex min-h-control items-center gap-3 text-[15px] text-ds-text-muted hover:text-ds-text"
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-ds-accent-bright" aria-hidden="true" />
                <span className="break-all">{label}</span>
              </a>
            ) : (
              <p
                key={label}
                className="inline-flex min-h-control items-center gap-3 text-[15px] text-ds-text-muted"
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-ds-accent-bright" aria-hidden="true" />
                {label}
              </p>
            ),
          )}
        </address>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 border-t border-ds-border py-6 sm:flex-row sm:items-center">
        {/* The year is read at render time, so a document built in one year and
            read in the next carries the older one until the next build. The
            browser corrects it on load; this says so rather than logging it. */}
        <span className="mono-tag-sm text-ds-text-faint" suppressHydrationWarning>
          © {getCurrentYear()} · SETX Youth Football Camp · All rights reserved
        </span>
        <div className="flex items-center gap-5">
          <Link
            to="/privacy"
            className="mono-tag-sm inline-flex min-h-control items-center text-ds-text-muted hover:text-ds-text"
          >
            Privacy
          </Link>
          <Link
            to="/terms"
            className="mono-tag-sm inline-flex min-h-control items-center text-ds-text-muted hover:text-ds-text"
          >
            Terms
          </Link>
          <Link
            to="/contact"
            className="mono-tag-sm inline-flex min-h-control items-center text-ds-text-muted hover:text-ds-text"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
    {children}
  </footer>
);

export default Footer;
