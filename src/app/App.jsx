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
import RouteFocus from "../components/routing/RouteFocus";
import SkipLink from "../components/layout/SkipLink";
import ProtectedRoute from "../components/routing/ProtectedRoute";
import Skeleton, { LoadingRegion } from "../components/ui/Skeleton";
import { ClickSpark } from "../components/reactbits";

const HomePage = lazy(() => import("../pages/HomePage/HomePage"));
const AboutPage = lazy(() => import("../pages/AboutPage/AboutPage"));
const GalleryPage = lazy(() => import("../pages/GalleryPage/GalleryPage"));
const SponsorsPage = lazy(() => import("../pages/SponsorsPage/SponsorsPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage/RegisterPage"));
const AuthPage = lazy(() => import("../pages/AuthPage/AuthPage"));
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const StaffPanel = lazy(() => import("../pages/StaffPanel/StaffPanel"));
const PaymentPage = lazy(() => import("../pages/PaymentPage/PaymentPage"));
const PrivacyPage = lazy(() => import("../pages/PrivacyPage/PrivacyPage"));
const TermsPage = lazy(() => import("../pages/TermsPage/TermsPage"));
const ContactPage = lazy(() => import("../pages/ContactPage/ContactPage"));
const DesignPage = lazy(() => import("../pages/DesignPage/DesignPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage/NotFound"));

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
