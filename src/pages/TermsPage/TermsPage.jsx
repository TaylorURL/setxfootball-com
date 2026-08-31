// Paper register, same as the Privacy page, because long-form legal copy is unpleasant
// on the dark surface.
import { Prose } from "@bradley-t-t/sunday-design-system";
import MarketingPage from "../../components/layout/MarketingPage";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";
import Breadcrumbs from "../../components/seo/Breadcrumbs";
import { FadeContent } from "../../components/reactbits";
import { CAMP_PHONE, CAMP_EMAIL } from "../../utils/constants";
import { TERMS, TERMS_UPDATED } from "../../content/terms";

const TermsPage = () => (
  <MarketingPage>
    <Seo {...PAGE_SEO.terms} />
    <Breadcrumbs label="Terms of Service" to="/terms" />
    <section data-surface="light" className="bg-ds-bg py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-3xl px-5 sm:px-8 lg:px-10">
        <header className="border-b border-ds-border pb-10">
          <span className="mono-tag inline-flex items-center gap-3 text-ds-accent-bright">
            <span aria-hidden="true" className="accent-tick is-on w-10" />
            Legal · Terms
          </span>
          <h1 className="editorial-display editorial-display-tight mt-5 text-5xl text-ds-text sm:text-6xl lg:text-7xl">
            Terms of
            <br />
            <span className="text-ds-accent-bright">Service.</span>
          </h1>
          <p className="mono-tag-sm mt-5 text-ds-text-faint">Last updated · {TERMS_UPDATED}</p>
        </header>

        <FadeContent as="article" className="mt-12" blur>
          <Prose>
            {TERMS.map(({ heading, paragraphs }) => (
              <section key={heading}>
                <h2>{heading}</h2>
                {paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </section>
            ))}

            <section>
              <h2>11. Contact</h2>
              <p>
                For questions regarding these terms, please contact us at{" "}
                <a href={`mailto:${CAMP_EMAIL}`}>{CAMP_EMAIL}</a> or call{" "}
                <a href={`tel:${CAMP_PHONE}`}>{CAMP_PHONE}</a>.
              </p>
            </section>
          </Prose>
        </FadeContent>
      </div>
    </section>
  </MarketingPage>
);

export default TermsPage;
