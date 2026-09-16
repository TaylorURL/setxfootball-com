// Logos on paper, the sponsor callout on navy, then the join callout on paper.
import MarketingPage from "../../components/layout/MarketingPage";
import SponsorsSection from "../../components/marketing/sections/SponsorsSection";
import JoinCallout from "../../components/marketing/sections/JoinCallout";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";
import Breadcrumbs from "../../components/seo/Breadcrumbs";

const SponsorsPage = () => (
  <MarketingPage>
    <Seo {...PAGE_SEO.sponsors} />
    <Breadcrumbs label="Sponsors" to="/sponsors" />
    <SponsorsSection />
    <JoinCallout />
  </MarketingPage>
);

export default SponsorsPage;
