/**
 * SponsorsPage — the sponsor thank-you wall, closed with the sign-up callout.
 */
import MarketingPage from "../../components/layout/MarketingPage";
import SponsorsSection from "../../components/marketing/sections/SponsorsSection";
import JoinCallout from "../../components/marketing/sections/JoinCallout";

const SponsorsPage = () => (
  <MarketingPage>
    <SponsorsSection />
    <JoinCallout />
  </MarketingPage>
);

export default SponsorsPage;
