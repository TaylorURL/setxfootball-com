/**
 * MarketingPage — chrome for static public pages (privacy, terms): the solid
 * marketing Navbar, a themed full-height body, and the shared Footer. Page
 * content is passed as children and constrained by the caller.
 */
import Navbar from "../nav/Navbar";
import Footer from "../footer/Footer";

const MarketingPage = ({ children }) => (
  <div className="flex min-h-[100dvh] flex-col bg-ds-bg text-ds-text">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default MarketingPage;
