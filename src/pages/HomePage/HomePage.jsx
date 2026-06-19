/**
 * HomePage — the public landing surface. A thin composition of marketing
 * sections: the varsity hero, the scoreboard stat band, the "every camper gets"
 * promise, the how-it-works playbook, and the closing sign-up callout. Section
 * content and the deeper pages (about, gallery, sponsors, register) live on
 * their own routes.
 */
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
    <PerksSection />
    <PlaybookSection />
    <JoinCallout />
  </MarketingPage>
);

export default HomePage;
