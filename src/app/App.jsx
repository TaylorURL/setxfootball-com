/**
 * The route table, and the providers every route sits inside.
 *
 * Every page is behind `lazy`, so a visitor downloads the one they asked for
 * rather than every route in the table before anything is drawn.
 * `RouteFallback` holds the page frame while a chunk arrives.
 *
 * ClickSpark is mounted outside the Router on purpose: it paints to a fixed
 * full-window canvas and listens on the window, so remounting it per route
 * would tear down and rebuild that canvas on every navigation.
 *
 * `/dashboard` and `/staff` are the only gated routes. Everything else is
 * public, including `/payment`, which a parent reaches straight from the form
 * without an account.
 *
 * The router is a prop so the build-time prerender can mount the same table in
 * the static router. Which router holds the table is the only difference
 * between the markup the build writes and the markup the browser produces.
 */
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import RouteFocus from "./RouteFocus";
import SkipLink from "../components/layout/SkipLink";
import ProtectedRoute from "./ProtectedRoute";
import Skeleton, { LoadingRegion } from "../components/ui/Skeleton";
import { ClickSpark } from "../components/reactbits";

/**
 * One page of the table, and the loader the entry can run ahead of it.
 *
 * `lazy` suspends the first time a page renders even when its chunk is already
 * in memory, because the initializer only learns the module arrived on the
 * microtask after it asked for it. On a navigation that costs a frame of the
 * fallback nobody sees. During hydration it costs the page: the build writes
 * the whole first screen inside the boundary below, and React answers a
 * boundary that suspends while it is being adopted by throwing that markup away
 * and drawing the page again - which restarts every entrance animation on the
 * screen the reader is already looking at, and hands the largest paint a second
 * candidate seconds after the first one.
 *
 * So a loader that already holds its module answers in the same tick, which is
 * what a synchronous thenable is for, and `preloadRoute` is what puts the module
 * in its hands before the entry hydrates.
 */
const page = (load) => {
  let held = null;
  const loader = () => {
    if (held) return { then: (resolve) => resolve(held) };
    return load().then((module) => {
      held = module;
      return module;
    });
  };
  const Page = lazy(loader);
  Page.load = loader;
  return Page;
};

const HomePage = page(() => import("../pages/HomePage/HomePage"));
const AboutPage = page(() => import("../pages/AboutPage/AboutPage"));
const GalleryPage = page(() => import("../pages/GalleryPage/GalleryPage"));
const SponsorsPage = page(() => import("../pages/SponsorsPage/SponsorsPage"));
const RegisterPage = page(() => import("../pages/RegisterPage/RegisterPage"));
const AuthPage = page(() => import("../pages/AuthPage/AuthPage"));
const Dashboard = page(() => import("../pages/Dashboard/Dashboard"));
const StaffPanel = page(() => import("../pages/StaffPanel/StaffPanel"));
const PaymentPage = page(() => import("../pages/PaymentPage/PaymentPage"));
const PrivacyPage = page(() => import("../pages/PrivacyPage/PrivacyPage"));
const TermsPage = page(() => import("../pages/TermsPage/TermsPage"));
const ContactPage = page(() => import("../pages/ContactPage/ContactPage"));
const DesignPage = page(() => import("../pages/DesignPage/DesignPage"));
const NotFoundPage = page(() => import("../pages/NotFoundPage/NotFoundPage"));

// The same table as the routes below, read the other way: which page a URL
// lands on, for the entry to have in hand before it hydrates. A path the table
// has no route for renders the catch-all, which is the page 404.html carries.
const PAGE_FOR_PATH = {
  "/": HomePage,
  "/about": AboutPage,
  "/gallery": GalleryPage,
  "/sponsors": SponsorsPage,
  "/register": RegisterPage,
  "/auth": AuthPage,
  "/dashboard": Dashboard,
  "/staff": StaffPanel,
  "/payment": PaymentPage,
  "/privacy": PrivacyPage,
  "/terms": TermsPage,
  "/contact": ContactPage,
  "/design": DesignPage,
};

/**
 * Loads the page a path renders, so the render that adopts the document does
 * not suspend on it. It settles either way: a chunk that never arrives leaves a
 * page React draws the ordinary way, which is worse than adopting one and far
 * better than a page that never hydrates at all.
 *
 * @param {string} pathname - The path being loaded, as the browser reports it.
 * @returns {Promise<void>}
 */
export const preloadRoute = (pathname) => {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const Page = PAGE_FOR_PATH[path] || NotFoundPage;
  return Promise.resolve(Page.load()).then(
    () => undefined,
    () => undefined,
  );
};

/**
 * The page frame, held at the height of a full screen so nothing below it moves
 * when the chunk lands. The header band matches the fixed bar's own height.
 */
const RouteFallback = () => (
  <div className="flex min-h-[100dvh] flex-col bg-ds-bg">
    <Skeleton className="h-[var(--header-height)] w-full rounded-none" />
    <LoadingRegion label="Loading the page" className="flex-1 px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1440px] space-y-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-16 w-full max-w-[42ch]" />
        <Skeleton className="h-16 w-full max-w-[34ch]" />
        <Skeleton className="h-12 w-48" />
      </div>
    </LoadingRegion>
  </div>
);

/**
 * @param {object} props
 * @param {React.ElementType} [props.router=BrowserRouter] - The router the table sits in.
 * @param {object} [props.routerProps] - Props for that router.
 */
function App({ router: RouteHost = Router, routerProps }) {
  return (
    <AuthProvider>
      <ClickSpark />
      <RouteHost {...routerProps}>
        <SkipLink />
        <RouteFocus />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/sponsors" element={<SponsorsPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff"
              element={
                <ProtectedRoute requireStaff>
                  <StaffPanel />
                </ProtectedRoute>
              }
            />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/design" element={<DesignPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </RouteHost>
    </AuthProvider>
  );
}

export default App;
