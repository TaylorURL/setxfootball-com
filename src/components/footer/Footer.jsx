/**
 * Footer — the public marketing footer: brand blurb, quick links, contact, and
 * camp facts, capped by a copyright + legal row. Built entirely from design-
 * system layout + typography primitives so it tracks the active theme.
 *
 * Quick links smooth-scroll when `onSectionSelect` is supplied (on the landing
 * page); otherwise they route to the landing anchors.
 */
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Calendar, Users, Shirt } from "lucide-react";
import {
  Container,
  Section,
  Separator,
  Text,
  Eyebrow,
} from "@bradley-t-t/sunday-design-system";
import logo from "../../assets/logo.PNG";

const QUICK_LINKS = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Gallery", id: "gallery" },
  { label: "Sponsors", id: "sponsors" },
  { label: "Registration", id: "register" },
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
    <Eyebrow strong className="mb-5">
      {title}
    </Eyebrow>
    {children}
  </div>
);

const Footer = ({ onSectionSelect }) => (
  <footer className="relative border-t border-ds-border bg-ds-bg-elevated">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ds-accent to-transparent" />
    <Section space="lg">
      <Container size="xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <img src={logo} alt="" className="h-10 w-10 object-contain" />
              <span className="ml-3">
                <span className="block text-[15px] font-bold text-ds-text">SETX Football Camp</span>
                <span className="block text-[10px] uppercase tracking-[0.18em] text-ds-text-muted">
                  Youth · Daisetta, TX
                </span>
              </span>
            </div>
            <Text size="sm" tone="muted" className="max-w-xs">
              Building champions on and off the field. A community-first youth football camp.
            </Text>
          </div>

          <FooterColumn title="Quick Links">
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ label, id }) => (
                <li key={id}>
                  {onSectionSelect ? (
                    <button
                      onClick={() => onSectionSelect(id)}
                      className="text-[13px] text-ds-text-muted transition-colors duration-150 ease-ds-out hover:text-ds-text"
                    >
                      {label}
                    </button>
                  ) : (
                    <Link
                      to={`/#${id}`}
                      className="text-[13px] text-ds-text-muted transition-colors duration-150 ease-ds-out hover:text-ds-text"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Contact Us">
            <div className="space-y-3">
              {CONTACTS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0 text-ds-text-faint" />
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
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-ds-text-faint" />
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

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <Text size="xs" tone="faint">
            © {new Date().getFullYear()} SETX Football Camp. All rights reserved.
          </Text>
          <div className="flex items-center gap-4">
            <Link
              to="/privacy"
              className="text-[12px] text-ds-text-muted transition-colors duration-150 ease-ds-out hover:text-ds-text"
            >
              Privacy Policy
            </Link>
            <span className="text-ds-text-faint">·</span>
            <Link
              to="/terms"
              className="text-[12px] text-ds-text-muted transition-colors duration-150 ease-ds-out hover:text-ds-text"
            >
              Terms of Service
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Text size="xs" tone="faint">
            Site made by{' '}
            <a
              href="https://taylorurl.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ds-text-faint underline decoration-ds-text-faint/30 transition-colors duration-150 ease-ds-out hover:text-ds-text-muted"
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
