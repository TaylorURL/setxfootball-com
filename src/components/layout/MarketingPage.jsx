/**
 * @param {object} props
 * @param {React.ReactNode} props.children - Page body.
 * @param {boolean} [props.padded=true] - Reserve space for the fixed navbar.
 *   Set false for full-bleed hero pages that render under the bar themselves.
 */
import Navbar from "../nav/Navbar";
import Footer from "../footer/Footer";

const MarketingPage = ({ children, padded = true }) => (
  <div className="flex min-h-[100dvh] flex-col bg-ds-bg text-ds-text">
    <Navbar />
    <main
      key={typeof window !== "undefined" ? window.location.pathname : "ssr"}
      className={`animate-page-in flex-1 ${padded ? "pt-20 sm:pt-24" : ""}`}
    >
      {children}
    </main>
    <Footer />
  </div>
);

export default MarketingPage;
