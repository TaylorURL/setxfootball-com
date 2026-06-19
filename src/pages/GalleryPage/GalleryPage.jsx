/**
 * GalleryPage — the past-seasons photo mosaic, closed with the sign-up callout.
 */
import MarketingPage from "../../components/layout/MarketingPage";
import GallerySection from "../../components/marketing/sections/GallerySection";
import JoinCallout from "../../components/marketing/sections/JoinCallout";

const GalleryPage = () => (
  <MarketingPage>
    <GallerySection />
    <JoinCallout />
  </MarketingPage>
);

export default GalleryPage;
