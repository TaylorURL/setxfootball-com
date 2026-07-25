// Surface rhythm: light story, dark coaches, dark differentiator, light join.
import MarketingPage from "../../components/layout/MarketingPage";
import StorySection from "../../components/marketing/sections/StorySection";
import CoachesSection from "../../components/marketing/sections/CoachesSection";
import DifferentiatorSection from "../../components/marketing/sections/DifferentiatorSection";
import JoinCallout from "../../components/marketing/sections/JoinCallout";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";

const AboutPage = () => (
  <MarketingPage>
    <Seo {...PAGE_SEO.about} />
    <StorySection surface="light" />
    <CoachesSection />
    <DifferentiatorSection />
    <JoinCallout surface="light" />
  </MarketingPage>
);

export default AboutPage;
