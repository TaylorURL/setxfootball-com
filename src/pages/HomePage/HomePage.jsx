// Surface rhythm: ice hero, white trust strip, white perks, the playbook on
// navy, the red ticket on ice, ink footer.
import MarketingPage from "../../components/layout/MarketingPage";
import HeroSection from "../../components/marketing/sections/HeroSection";
import PerksSection from "../../components/marketing/sections/PerksSection";
import PlaybookSection from "../../components/marketing/sections/PlaybookSection";
import JoinCallout from "../../components/marketing/sections/JoinCallout";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";

const HomePage = () => (
  <MarketingPage padded={false}>
    <Seo {...PAGE_SEO.home} />
    <HeroSection />
    <PerksSection />
    <PlaybookSection surface="navy" />
    <JoinCallout />
  </MarketingPage>
);

export default HomePage;
