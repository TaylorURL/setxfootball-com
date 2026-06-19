/**
 * GalleryPage — the past-seasons photo mosaic, closed with the sign-up callout.
 */
import MarketingPage from "../../components/layout/MarketingPage";
import GallerySection from "../../components/marketing/sections/GallerySection";
import JoinCallout from "../../components/marketing/sections/JoinCallout";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";

const GalleryPage = () => (
  <MarketingPage>
    <Seo {...PAGE_SEO.gallery} />
    <GallerySection />
    <JoinCallout />
  </MarketingPage>
);

export default GalleryPage;
