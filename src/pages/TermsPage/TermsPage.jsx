// Long-form legal copy, at reading measure, in one ruled panel.
import MarketingPage from "../../components/layout/MarketingPage";
import LegalPage from "../../components/layout/LegalPage";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";
import Breadcrumbs from "../../components/seo/Breadcrumbs";
import { CAMP_PHONE, CAMP_EMAIL } from "../../utils/constants";
import { TERMS, TERMS_UPDATED } from "../../content/terms";

const TermsPage = () => (
  <MarketingPage>
    <Seo {...PAGE_SEO.terms} />
    <Breadcrumbs label="Terms of Service" to="/terms" />
    <LegalPage eyebrow="Legal · Terms" title="Terms of Service." updated={TERMS_UPDATED}>
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
    </LegalPage>
  </MarketingPage>
);

export default TermsPage;
