// The site's own chrome, so a mistyped URL still lands somewhere that looks
// like the camp and offers a way back.
import { Link } from "react-router-dom";
import MarketingPage from "../../components/layout/MarketingPage";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";
import { actionClass } from "../../components/ui/actionClass";
import { PUBLIC_NAV_LINKS, REGISTER_PATH } from "../../components/nav/navLinks";

const NotFoundPage = () => (
  <MarketingPage>
    <Seo {...PAGE_SEO.notfound} />
    <section className="bg-ds-bg py-20 sm:py-28 lg:py-32">
      <div className="mx-auto w-full max-w-3xl px-5 sm:px-8 lg:px-10">
        <span className="mono-tag inline-flex items-center gap-3 text-ds-accent-bright">
          <span aria-hidden="true" className="accent-tick is-on w-10" />
          Error 404
        </span>
        <h1 className="editorial-display editorial-display-tight mt-5 text-5xl text-ds-text sm:text-6xl lg:text-7xl">
          No play by
          <br />
          <span className="text-ds-accent-bright">that name.</span>
        </h1>
        <p className="mt-6 max-w-[60ch] text-lg text-ds-text-muted">
          The address you followed does not match a page on this site. The camp, the roster form,
          and the photographs are all one link away.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to={REGISTER_PATH} className={actionClass()}>
            Sign Up Your Camper
          </Link>
          <Link to="/contact" className={actionClass({ tone: "outline" })}>
            Get in Touch
          </Link>
        </div>

        <nav aria-label="Site pages" className="mt-12 border-t border-ds-border pt-8">
          <h2 className="mono-tag text-ds-text-faint">Every Page</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
            {[...PUBLIC_NAV_LINKS, { label: "Contact", to: "/contact" }].map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="inline-flex min-h-control items-center text-[15px] text-ds-text-muted hover:text-ds-text"
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
