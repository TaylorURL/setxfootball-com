/**
 * SponsorsPage — the sponsor thank-you wall, closed with the sign-up callout.
 */
import MarketingPage from "../../components/layout/MarketingPage";
import SponsorsSection from "../../components/marketing/sections/SponsorsSection";
import JoinCallout from "../../components/marketing/sections/JoinCallout";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";

const SponsorsPage = () => (
  <MarketingPage>
    <Seo {...PAGE_SEO.sponsors} />
    <SponsorsSection />
    <JoinCallout />
  </MarketingPage>
);

export default SponsorsPage;
