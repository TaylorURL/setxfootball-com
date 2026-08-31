// Paper register, same as the legal pages: a page a parent reads a phone number
// off is easier on the light surface.
import { Phone, Mail, MapPin } from "lucide-react";
import MarketingPage from "../../components/layout/MarketingPage";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";
import Breadcrumbs from "../../components/seo/Breadcrumbs";
import { FadeContent } from "../../components/reactbits";
import { actionClass } from "../../components/ui/actionClass";
import { Link } from "react-router-dom";
import { CAMP_PHONE, CAMP_EMAIL, CAMP_LOCALITY, CAMP_SEASON } from "../../utils/constants";

const ROUTES = [
  {
    icon: Phone,
    label: "Phone",
    value: CAMP_PHONE,
    href: `tel:${CAMP_PHONE}`,
    note: "Fastest on a camp weekend.",
  },
  {
    icon: Mail,
    label: "Email",
    value: CAMP_EMAIL,
    href: `mailto:${CAMP_EMAIL}`,
    note: "Answered within a day or two.",
  },
  {
    icon: MapPin,
    label: "Field",
    value: `${CAMP_LOCALITY}, Texas`,
    href: null,
    note: "Liberty County, Southeast Texas.",
  },
];

const ContactPage = () => (
  <MarketingPage>
    <Seo {...PAGE_SEO.contact} />
    <Breadcrumbs label="Contact" to="/contact" />
    <section data-surface="light" className="bg-ds-bg py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-3xl px-5 sm:px-8 lg:px-10">
        <header className="border-b border-ds-border pb-10">
          <span className="mono-tag inline-flex items-center gap-3 text-ds-accent-bright">
            <span aria-hidden="true" className="accent-tick is-on w-10" />
            Contact
          </span>
          <h1 className="editorial-display editorial-display-tight mt-5 text-5xl text-ds-text sm:text-6xl lg:text-7xl">
            Ask us
            <br />
            <span className="text-ds-accent-bright">anything.</span>
          </h1>
          <p className="mt-5 max-w-[60ch] text-lg text-ds-text-muted">
            Two coaches run this camp around full-time jobs. A phone call reaches them fastest.
          </p>
        </header>

        <FadeContent as="div" className="mt-12" blur>
          <ul className="grid grid-cols-1 gap-px border border-ds-border bg-ds-border sm:grid-cols-3">
            {ROUTES.map(({ icon: Icon, label, value, href, note }) => (
              <li key={label} className="bg-ds-bg p-6">
                <span className="mono-tag inline-flex items-center gap-2 text-ds-accent-bright">
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {label}
                </span>
                {href ? (
                  <a
                    href={href}
                    className="mt-4 block break-all text-base font-semibold text-ds-text hover:text-ds-accent-bright"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="mt-4 text-base font-semibold text-ds-text">{value}</p>
                )}
                <p className="mono-tag-sm mt-2 text-ds-text-faint">{note}</p>
              </li>
            ))}
          </ul>

          <div className="mt-12 border-t border-ds-border pt-10">
            <h2 className="editorial-display text-3xl text-ds-text">
              Signing a camper up takes about two minutes
            </h2>
            <p className="mt-4 max-w-[60ch] text-lg text-ds-text-muted">
              A name, an age, a shirt size, and somebody to call in an emergency. Camp runs{" "}
              {CAMP_SEASON}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className={actionClass()}>
                Sign Up Your Camper
              </Link>
              <Link to="/about" className={actionClass({ tone: "outline" })}>
                Read About the Camp
              </Link>
            </div>
          </div>
        </FadeContent>
      </div>
    </section>
  </MarketingPage>
);

export default ContactPage;
