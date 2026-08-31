// Surface rhythm: light story, dark coaches, dark differentiator, light FAQ,
// light join.
import MarketingPage from "../../components/layout/MarketingPage";
import StorySection from "../../components/marketing/sections/StorySection";
import CoachesSection from "../../components/marketing/sections/CoachesSection";
import DifferentiatorSection from "../../components/marketing/sections/DifferentiatorSection";
import FaqSection from "../../components/marketing/sections/FaqSection";
import JoinCallout from "../../components/marketing/sections/JoinCallout";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";
import Breadcrumbs from "../../components/seo/Breadcrumbs";

const AboutPage = () => (
  <MarketingPage>
    <Seo {...PAGE_SEO.about} />
    <Breadcrumbs label="About" to="/about" />
    <StorySection surface="light" />
    <CoachesSection />
    <DifferentiatorSection />
    <FaqSection surface="light" />
    <JoinCallout surface="light" />
  </MarketingPage>
);

export default AboutPage;
