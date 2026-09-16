// The photographs sit on paper; the callout closes the page on navy.
import MarketingPage from "../../components/layout/MarketingPage";
import GallerySection from "../../components/marketing/sections/GallerySection";
import JoinCallout from "../../components/marketing/sections/JoinCallout";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";
import Breadcrumbs from "../../components/seo/Breadcrumbs";

const GalleryPage = () => (
  <MarketingPage>
    <Seo {...PAGE_SEO.gallery} />
    <Breadcrumbs label="Gallery" to="/gallery" />
    <GallerySection />
    <JoinCallout surface="navy" />
  </MarketingPage>
);

export default GalleryPage;
