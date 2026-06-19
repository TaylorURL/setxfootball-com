/**
 * Footer — the public marketing footer.
 *
 * Reads like the back of a programme: a brand column with mission line and
 * season mark, quick links, contact, and camp facts, capped with a copyright
 * + legal row. Composed from design-system layout + typography primitives so
 * it tracks the active theme.
 *
 * Quick links smooth-scroll when `onSectionSelect` is supplied (on the landing
 * page); otherwise they route to the landing anchors.
 */
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Calendar, Users, Shirt } from "lucide-react";
import {
  Container,
  Section,
  Text,
  Eyebrow,
} from "@bradley-t-t/sunday-design-system";
import BrandMark from "../brand/BrandMark";

const QUICK_LINKS = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Gallery", id: "gallery" },
  { label: "Sponsors", id: "sponsors" },
  { label: "Sign Up", id: "register" },
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
    <Eyebrow strong className="mb-5 inline-flex items-center gap-2 text-ds-accent-bright">
      <span className="inline-block h-0.5 w-3 bg-ds-accent" /> {title}
    </Eyebrow>
    {children}
  </div>
);

const Footer = ({ onSectionSelect }) => (
  <footer className="relative border-t border-ds-border bg-ds-bg-elevated">
    <div aria-hidden="true" className="sideline-stripes absolute inset-x-0 top-0 h-1.5 opacity-70" />
    <Section space="lg">
      <Container size="xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-5">
            <div className="flex items-center">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-ds-md bg-ds-accent ring-1 ring-white/15">
                <img src={logo} alt="" className="h-9 w-9 object-contain" />
              </span>
              <span className="ml-3">
                <span className="block text-[15px] font-black uppercase tracking-[0.04em] text-ds-text">
                  SETX Football
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-ds-text-muted">
                  <span className="inline-block h-0.5 w-3 bg-ds-accent" /> Youth Camp · Daisetta TX
                </span>
              </span>
            </div>
            <Text size="sm" tone="muted" className="max-w-xs">
              Building champions on and off the field — a community-first youth
              football camp, run by neighbors for neighbors.
            </Text>
            <div className="inline-flex items-center gap-2 rounded-ds-full border border-ds-border-strong bg-ds-surface-2 px-3 py-1.5">
              <span className="inline-flex h-2 w-2 rounded-full bg-ds-positive" />
              <Eyebrow strong className="text-ds-text">
                Season 03 · July 2026
              </Eyebrow>
            </div>
          </div>

          <FooterColumn title="Quick Links">
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ label, id }) => (
                <li key={id}>
                  {onSectionSelect ? (
                    <button
                      onClick={() => onSectionSelect(id)}
                      className="text-[13px] font-medium text-ds-text-muted transition-colors duration-150 ease-ds-out hover:text-ds-accent-bright"
                    >
                      {label}
                    </button>
                  ) : (
                    <Link
                      to={`/#${id}`}
                      className="text-[13px] font-medium text-ds-text-muted transition-colors duration-150 ease-ds-out hover:text-ds-accent-bright"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Contact">
            <div className="space-y-3">
              {CONTACTS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-ds-sm bg-ds-accent-softer text-ds-accent-bright">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <Text size="sm" tone="muted">
                    {text}
                  </Text>
                </div>
              ))}
            </div>
          </FooterColumn>

          <FooterColumn title="Camp Info">
            <div className="space-y-3">
              {CAMP_FACTS.map(({ icon: Icon, title, subtitle }) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-ds-sm bg-ds-accent-softer text-ds-accent-bright">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <Text size="sm" weight="semibold">
                      {title}
                    </Text>
                    <Text size="xs" tone="faint">
                      {subtitle}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </FooterColumn>
        </div>

        <div className="mt-12 yard-rule" aria-hidden="true" />

        <div className="mt-8 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <Text size="xs" tone="faint" className="uppercase tracking-[0.16em]">
            © {new Date().getFullYear()} SETX Youth Football Camp · Built in Daisetta
          </Text>
          <div className="flex items-center gap-4">
            <Link
              to="/privacy"
              className="text-[12px] font-medium text-ds-text-muted transition-colors duration-150 ease-ds-out hover:text-ds-accent-bright"
            >
              Privacy
            </Link>
            <span className="text-ds-text-faint">·</span>
            <Link
              to="/terms"
              className="text-[12px] font-medium text-ds-text-muted transition-colors duration-150 ease-ds-out hover:text-ds-accent-bright"
            >
              Terms
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Text size="xs" tone="faint">
            Site by{" "}
            <a
              href="https://taylorurl.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-ds-text-faint/30 transition-colors duration-150 ease-ds-out hover:text-ds-accent-bright"
            >
              TaylorURL.com
            </a>
          </Text>
        </div>
      </Container>
    </Section>
  </footer>
);

export default Footer;
