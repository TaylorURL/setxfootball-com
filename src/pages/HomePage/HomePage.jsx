// Surface rhythm: dark hero, dark scoreboard, light perks, dark playbook,
// light join callout.
import MarketingPage from "../../components/layout/MarketingPage";
import HeroSection from "../../components/marketing/sections/HeroSection";
import ScoreboardSection from "../../components/marketing/sections/ScoreboardSection";
import PerksSection from "../../components/marketing/sections/PerksSection";
import PlaybookSection from "../../components/marketing/sections/PlaybookSection";
import JoinCallout from "../../components/marketing/sections/JoinCallout";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";

const HomePage = () => (
  <MarketingPage padded={false}>
    <Seo {...PAGE_SEO.home} />
    <HeroSection />
    <ScoreboardSection />
    <PerksSection surface="light" />
    <PlaybookSection />
    <JoinCallout surface="light" />
  </MarketingPage>
);

export default HomePage;
