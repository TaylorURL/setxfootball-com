// Sponsors go light: logos on paper read better than logos on coal.
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
    <SponsorsSection surface="light" />
    <JoinCallout />
  </MarketingPage>
);

export default SponsorsPage;
