/**
 * The site footer: the end-zone stripe, a closing line, the three camp facts
 * with their marks, the ways to reach the camp, and the legal links. It is
 * the one ink band every page ends on.
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
import { MapPin, Phone, Mail } from "lucide-react";
import { REGISTER_PATH } from "./navLinks";
import { actionClass } from "../ui/actionClass";
import CampIcon from "../ui/CampIcon";
import { CAMP_PHONE, CAMP_EMAIL, CAMP_LOCALITY, CAMP_SEASON } from "../../utils/constants";
import { SplitText } from "../reactbits";
import { getCurrentYear } from "../../utils/helpers";

const CONTACTS = [
  { icon: MapPin, label: `${CAMP_LOCALITY}, TX`, href: null },
  { icon: Phone, label: CAMP_PHONE, href: `tel:${CAMP_PHONE}` },
  { icon: Mail, label: CAMP_EMAIL, href: `mailto:${CAMP_EMAIL}` },
];

const CAMP_FACTS = [
  { icon: "calendar", title: CAMP_SEASON, subtitle: "Two half-day sessions" },
  { icon: "field", title: `${CAMP_LOCALITY}, TX`, subtitle: "Liberty County" },
  { icon: "american-football", title: "Ages 5 to 12", subtitle: "No tryouts" },
];

const Footer = ({ children }) => (
  <footer data-surface="navy" className="relative bg-ds-bg text-ds-text">
    <div aria-hidden="true" className="end-zone" />
    <div className="mx-auto w-full max-w-[1160px] px-6 sm:px-10 lg:px-16">
      <div className="grid grid-cols-1 gap-12 py-16 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16 lg:py-20">
        <div>
          <span className="label-caps text-ds-gold">SETX Youth Football Camp</span>
          <p className="display mt-5 text-3xl sm:text-4xl lg:text-5xl">
            <SplitText text="Built for our community." splitType="words" delay={45} />
            <br />
            Open to every kid.
          </p>
          <Link to={REGISTER_PATH} className={actionClass({ className: "mt-8" })}>
            Sign Up Your Camper
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {CAMP_FACTS.map(({ icon, title, subtitle }) => (
            <div
              key={title}
              className="flex items-center gap-4 rounded-ds-md border-rule border-ds-surface-3 bg-ds-surface px-5 py-3"
            >
              <CampIcon name={icon} size={36} />
              <div>
                <p className="numeral text-2xl text-ds-text">{title}</p>
                <p className="body-copy text-sm text-ds-text-muted">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 border-t-rule border-ds-surface-3 py-8 sm:flex-row sm:items-center sm:justify-between">
        {/* `address`, because this is the camp's own contact block rather than
            a list of links: it is what a reader, a screen reader and a crawler
            each look for to find who stands behind the site. */}
        <address className="flex flex-wrap items-center gap-x-8 gap-y-3 not-italic">
          {CONTACTS.map(({ icon: Icon, label, href }) =>
            href ? (
              <a
                key={label}
                href={href}
                className="inline-flex min-h-control items-center gap-3 text-[15px] text-ds-text-muted hover:text-ds-gold"
              >
                <Icon className="h-4 w-4 shrink-0 text-ds-gold" aria-hidden="true" />
                <span className="break-all">{label}</span>
              </a>
            ) : (
              <p
                key={label}
                className="inline-flex min-h-control items-center gap-3 text-[15px] text-ds-text-muted"
              >
                <Icon className="h-4 w-4 shrink-0 text-ds-gold" aria-hidden="true" />
                {label}
              </p>
            ),
          )}
        </address>
        <div className="flex items-center gap-5">
          {[
            ["/privacy", "Privacy"],
            ["/terms", "Terms"],
            ["/contact", "Contact"],
          ].map(([to, label]) => (
            <Link
              key={to}
              to={to}
              className="label-caps inline-flex min-h-control items-center text-ds-text-muted hover:text-ds-gold"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-ds-border py-6">
        {/* The year is read at render time, so a document built in one year and
            read in the next carries the older one until the next build. The
            browser corrects it on load; this says so rather than logging it. */}
        <span className="mono-tag text-ds-text-faint" suppressHydrationWarning>
          © {getCurrentYear()} · SETX Youth Football Camp · All rights reserved
        </span>
      </div>
    </div>
    {children}
  </footer>
);

export default Footer;
