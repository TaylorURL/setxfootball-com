/**
 * @param {object} props
 * @param {React.ReactNode} props.children - Page body.
 * @param {boolean} [props.padded=true] - Clear the fixed navbar by exactly its
 *   own height, so the first section's surface runs up to the bar rather than
 *   leaving a band of the page ground under it. Set false for full-bleed hero
 *   pages that render under the bar themselves.
 */
import SplitRail from "@taylorurl/split-rail";
import Navbar from "../nav/Navbar";
import Footer from "../footer/Footer";

const MarketingPage = ({ children, padded = true }) => (
  <div className="flex min-h-[100dvh] flex-col bg-ds-bg text-ds-text">
    <Navbar />
    <main
      id="main"
      tabIndex={-1}
      key={typeof window !== "undefined" ? window.location.pathname : "ssr"}
      className={`animate-page-in flex-1 outline-none ${padded ? "pt-[var(--header-height)]" : ""}`}
    >
      {children}
    </main>
    <Footer>
      <SplitRail />
    </Footer>
  </div>
);

export default MarketingPage;
