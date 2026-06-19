/**
 * AboutPage — the camp's story: the mission and "started by neighbors" story,
 * the background-checked coaching staff, and the "what sets us apart" band.
 */
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
    <StorySection />
    <CoachesSection />
    <DifferentiatorSection />
    <JoinCallout />
  </MarketingPage>
);

export default AboutPage;
