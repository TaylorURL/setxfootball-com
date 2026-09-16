// The site's own chrome, so a mistyped URL still lands somewhere that looks
// like the camp and offers a way back.
import { Link } from "react-router-dom";
import MarketingPage from "../../components/layout/MarketingPage";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";
import { actionClass } from "../../components/ui/actionClass";
import { PUBLIC_NAV_LINKS, REGISTER_PATH } from "../../components/layout/navLinks";
import CampIcon from "../../components/ui/CampIcon";

const NotFoundPage = () => (
  <MarketingPage>
    <Seo {...PAGE_SEO.notfound} />
    <section data-surface="navy" className="bg-ds-bg py-24 text-ds-text sm:py-32 lg:py-40">
      <div className="mx-auto w-full max-w-3xl px-5 text-center sm:px-8 lg:px-10">
        <CampIcon name="referee" size={72} className="mx-auto" />
        <p className="numeral text-[5rem] text-ds-gold sm:text-[7rem]" aria-hidden="true">
          404
        </p>
        <h1 className="display mt-2 text-4xl sm:text-5xl lg:text-6xl">No play by that name.</h1>
        <p className="body-copy mx-auto mt-6 max-w-measure text-lg text-ds-text-muted">
          The address you followed does not match a page on this site. The camp, the roster form,
          and the photographs are all one link away.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to={REGISTER_PATH} className={actionClass({ size: "lg" })}>
            Sign Up Your Camper
          </Link>
          <Link to="/contact" className={actionClass({ tone: "outline", size: "lg" })}>
            Get in Touch
          </Link>
        </div>

        <nav aria-label="Site pages" className="mt-12">
          <h2 className="label-caps text-ds-text-faint">Every Page</h2>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {[...PUBLIC_NAV_LINKS, { label: "Contact", to: "/contact" }].map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="label-caps inline-flex min-h-[40px] items-center rounded-ds-sm border-rule border-ds-surface-3 bg-ds-surface px-4 text-ds-text hover:border-ds-gold"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  </MarketingPage>
);

export default NotFoundPage;
