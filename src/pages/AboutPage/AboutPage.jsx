// Surface rhythm: paper story, navy coaches, recessed differentiator, paper
// FAQ, recessed join.
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
    <StorySection />
    <CoachesSection surface="navy" />
    <DifferentiatorSection />
    <FaqSection />
    <JoinCallout />
  </MarketingPage>
);

export default AboutPage;
