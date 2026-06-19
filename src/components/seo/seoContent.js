/**
 * @module seoContent
 * @description Central registry of per-page SEO copy for the public site.
 * Page components import the keyed entry instead of inlining strings so the
 * sitemap, og previews, and titles stay in sync from one place.
 */

export const SITE_URL = "https://setxfootball.com";
export const SITE_NAME = "SETX Football Camp";
export const TWITTER_HANDLE = "@SETXFootball";

/** Hero photo doubles as the default social card until a dedicated 1200x630 lands. */
export const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/android-chrome-512x512.png`;

const KEYWORDS_CORE =
  "SETX football camp, youth football, Southeast Texas, kids football camp, Daisetta, Hull-Daisetta, football training, summer camp 2026, youth sports";

export const PAGE_SEO = {
  home: {
    title: "Youth Football Camp in Southeast Texas — July 2026",
    description:
      "Two-day SETX Youth Football Camp for kids ages 5–12 in Daisetta, Southeast Texas. Real coaching, every kid plays, shirts and snacks included. Sign up for July 2026.",
    path: "/",
    keywords: KEYWORDS_CORE,
  },
  about: {
    title: "About the SETX Football Camp",
    description:
      "Meet the SETX Youth Football Camp — a Southeast Texas community camp built by neighbors, run by background-checked coaches, open to every kid ages 5–12.",
    path: "/about",
    keywords: `${KEYWORDS_CORE}, about, coaches, mission`,
  },
  gallery: {
    title: "Photo Gallery — Past Camp Seasons",
    description:
      "Look back at past SETX Youth Football Camp seasons in Daisetta, Texas. Sideline moments, on-field drills, and the kids who make the camp what it is.",
    path: "/gallery",
    keywords: `${KEYWORDS_CORE}, gallery, photos`,
  },
  sponsors: {
    title: "Sponsors & Partners",
    description:
      "Thank you to the local businesses and Southeast Texas families whose sponsorship keeps the SETX Youth Football Camp free for the kids who need it.",
    path: "/sponsors",
    keywords: `${KEYWORDS_CORE}, sponsors, partners, donate`,
  },
  register: {
    title: "Sign Up & Shirt Orders — Register Your Camper",
    description:
      "Register your camper and order camp shirts for the SETX Youth Football Camp in Southeast Texas. $5 per shirt — pay after you sign up. Ages 5–12 welcome.",
    path: "/register",
    keywords: `${KEYWORDS_CORE}, sign up, register, shirt order, shirts`,
  },
  auth: {
    title: "Sign In to SETX Football Camp",
    description:
      "Sign in or create an account to manage your SETX Youth Football Camp registration, shirt orders, and payment.",
    path: "/auth",
    noindex: true,
  },
  payment: {
    title: "Payment Instructions",
    description:
      "Complete your SETX Football Camp registration with CashApp. Review your shirt order summary and pay the camp directly.",
    path: "/payment",
    noindex: true,
  },
  privacy: {
    title: "Privacy Policy",
    description:
      "How the SETX Football Camp collects, uses, and protects the information families share when registering for the Southeast Texas youth football camp.",
    path: "/privacy",
  },
  terms: {
    title: "Terms of Service",
    description:
      "The terms of service for SETX Football Camp — what families and campers can expect when registering for the Southeast Texas youth football camp.",
    path: "/terms",
  },
  design: {
    title: "Design & Brand — The SETX Football Identity",
    description:
      "A look inside the visual identity behind the SETX Youth Football Camp — the camp-red and field-navy palette, varsity typography, and the design system that powers every page.",
    path: "/design",
    keywords: `${KEYWORDS_CORE}, design, brand, identity, style guide`,
  },
};
