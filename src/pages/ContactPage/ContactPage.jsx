// A page a parent reads a phone number off: the three routes to the camp as
// cards with their marks, the short answers under them, and the sign-up nudge.
import { Link } from "react-router-dom";
import MarketingPage from "../../components/layout/MarketingPage";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";
import Breadcrumbs from "../../components/seo/Breadcrumbs";
import SectionIntro from "../../components/marketing/SectionIntro";
import Reveal from "../../components/marketing/Reveal";
import { actionClass } from "../../components/ui/actionClass";
import CampIcon from "../../components/ui/CampIcon";
import { REGISTER_PATH } from "../../components/layout/navLinks";
import {
  CAMP_PHONE,
  CAMP_EMAIL,
  CAMP_LOCALITY,
  CAMP_SEASON,
  SHIRT_PRICE,
} from "../../utils/constants";

const ROUTES = [
  {
    icon: "fans-megaphone",
    label: "Call or Text",
    value: CAMP_PHONE,
    href: `tel:${CAMP_PHONE}`,
    note: "Fastest on a camp weekend. Leave a message if nobody picks up.",
    cta: "Call the Camp",
    tone: "primary",
  },
  {
    icon: "ticket",
    label: "Email",
    value: CAMP_EMAIL,
    href: `mailto:${CAMP_EMAIL}`,
    note: "We answer within a day or two. Best for sponsor questions and anything with an attachment.",
    cta: "Send an Email",
    tone: "outline",
  },
  {
    icon: "stadium",
    label: "Find the Field",
    value: `${CAMP_LOCALITY}, Texas`,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${CAMP_LOCALITY}, Texas`)}`,
    external: true,
    note: "Liberty County, Southeast Texas.",
    cta: "Get Directions",
    tone: "outline",
  },
];

const ANSWERS = [
  {
    icon: "calendar",
    title: "When",
    body: `${CAMP_SEASON}, two half-day sessions.`,
  },
  {
    icon: "american-football",
    title: "Who",
    body: "Ages 5 to 12, any experience level, no tryouts. Every kid plays.",
  },
  {
    icon: "jersey",
    title: "What It Costs",
    body: `$${SHIRT_PRICE} per shirt, paid by CashApp after you sign up. The camp itself is free.`,
  },
  {
    icon: "nachos",
    title: "What to Bring",
    body: "Snacks and drinks are on us.",
  },
];

const ContactPage = () => (
  <MarketingPage>
    <Seo {...PAGE_SEO.contact} />
    <Breadcrumbs label="Contact" to="/contact" />

    <section className="bg-ds-bg py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1160px] px-6 sm:px-10 lg:px-16">
        <SectionIntro as="h1" eyebrow="Contact" title="Ask us anything." className="max-w-3xl">
          Two coaches run this camp around full-time jobs. A phone call reaches them fastest, and a
          text works when they are on the field.
        </SectionIntro>
      </div>
    </section>

    <section className="border-y-rule border-ds-border bg-ds-bg-elevated py-16 sm:py-20 lg:py-24">
      <ul className="mx-auto grid w-full max-w-[1160px] grid-cols-1 gap-6 px-5 sm:px-8 lg:grid-cols-3 lg:px-10">
        {ROUTES.map(({ icon, label, value, href, external, note, cta, tone }, index) => (
          <Reveal as="li" key={label} variant="up" delay={index + 1} className="flex">
            <div className="card card-lift flex w-full flex-col bg-ds-bg p-7 sm:p-8">
              <CampIcon name={icon} size={56} />
              <span className="label-caps mt-5 text-ds-text-muted">{label}</span>
              {/* `break-all`, because an email address has no space to wrap
                  at and would otherwise push the card wider than its column. */}
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="heading mt-2 break-all text-xl text-ds-text hover:text-ds-accent-bright"
              >
                {value}
              </a>
              <p className="body-copy mt-3 flex-1 text-[15px] text-ds-text-muted">{note}</p>
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className={actionClass({ tone, className: "mt-6 self-start" })}
              >
                {cta}
              </a>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>

    <section data-deferred="" className="bg-ds-bg py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid w-full max-w-[1160px] grid-cols-1 gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_400px] lg:items-start lg:px-10">
        <Reveal
          data-surface="navy"
          className="rounded-ds-xl border-rule border-ds-ink bg-ds-bg p-8 text-ds-text shadow-hard-xl sm:p-12"
        >
          <span className="eyebrow">Before You Call</span>
          <h2 className="display mt-5 max-w-2xl text-3xl sm:text-4xl">
            Most questions have a short answer.
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {ANSWERS.map(({ icon, title, body }) => (
              <div
                key={title}
                className="rounded-ds-md border-rule border-ds-surface-3 bg-ds-surface p-5"
              >
                <CampIcon name={icon} size={40} />
                <h3 className="display mt-3 text-xl text-ds-gold">{title}</h3>
                <p className="body-copy mt-2 text-sm text-ds-text-muted">{body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal
          delay={2}
          className="rounded-ds-xl border-rule border-ds-ink bg-ds-gold p-8 text-ds-on-gold shadow-hard-lg sm:p-9"
        >
          <CampIcon name="strategy" size={56} />
          <h2 className="display mt-5 text-3xl">Signing a camper up takes about two minutes.</h2>
          <p className="body-copy mt-4 text-[15px]">
            A name, an age, a shirt size, and somebody to call in an emergency.
          </p>
          <Link
            to={REGISTER_PATH}
            className={actionClass({ tone: "navy", size: "lg", className: "mt-7" })}
          >
            Sign Up Your Camper
          </Link>
        </Reveal>
      </div>
    </section>
  </MarketingPage>
);

export default ContactPage;
