// Pages import a keyed entry rather than inlining strings, so titles, sitemap
// and og previews can't drift apart.
import { CAMP_SEASON } from "../../utils/constants";

export const SITE_URL = "https://www.setxfootball.org";
export const SITE_NAME = "SETX Football Camp";
export const TWITTER_HANDLE = "@SETXFootball";

// The app icon, not a 1200x630 card, so a share preview crops it square rather
// than filling the wide frame a summary_large_image slot reserves.
export const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/android-chrome-512x512.png`;

export const PAGE_SEO = {
  home: {
    title: "Youth Football Camp in Daisetta, Texas",
    description: `Two-day youth football camp for ages 5 to 12 in Daisetta, Southeast Texas. Real coaching, every kid plays, shirts and snacks included. Sign up for ${CAMP_SEASON}.`,
    path: "/",
  },
  about: {
    title: "About the Camp and Its Coaches",
    description:
      "Meet the SETX Youth Football Camp: a Southeast Texas community camp built by neighbors, run by background-checked coaches, open to every kid ages 5 to 12.",
    path: "/about",
  },
  gallery: {
    title: "Photo Gallery: Past Camp Seasons",
    description:
      "Look back at past SETX Youth Football Camp seasons in Daisetta, Texas. Sideline moments, on-field drills, and the kids who make the camp what it is.",
    path: "/gallery",
  },
  sponsors: {
    title: "Sponsors & Partners",
    description:
      "Thank you to the local businesses and Southeast Texas families whose sponsorship keeps the SETX Youth Football Camp free for the kids who need it.",
    path: "/sponsors",
  },
  register: {
    title: "Register Your Camper and Order Shirts",
    description:
      "Register your camper and order camp shirts for the SETX Youth Football Camp in Southeast Texas. $5 per shirt, paid after you sign up. Ages 5 to 12 welcome.",
    path: "/register",
  },
  auth: {
    title: "Sign In or Create an Account",
    description:
      "Sign in or create an account to manage your SETX Youth Football Camp sign-ups, change a shirt order, and see whether the camp has recorded your payment.",
    path: "/auth",
    noindex: true,
  },
  payment: {
    title: "Payment Instructions",
    description:
      "Finish your SETX Football Camp sign-up with CashApp. Check the shirt order summary, send $5 per shirt to the camp, and record the handle you paid from.",
    path: "/payment",
    noindex: true,
  },
  dashboard: {
    title: "My Dashboard",
    description:
      "Your SETX Football Camp sign-ups: the campers you registered, the shirts you ordered, and whether the camp has marked the payment received.",
    path: "/dashboard",
    noindex: true,
  },
  staff: {
    title: "Staff Panel",
    description:
      "The SETX Football Camp roster for camp staff: every registration, shirt size, and payment status, searchable and exportable.",
    path: "/staff",
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
      "The terms of service for SETX Football Camp: what families and campers can expect when registering for the Southeast Texas youth football camp.",
    path: "/terms",
  },
  contact: {
    title: "Contact the Camp",
    description:
      "Reach SETX Youth Football Camp in Daisetta, Texas. Phone and email for sign-up questions, shirt sizes, and what a camper needs to bring on the day.",
    path: "/contact",
  },
  notfound: {
    title: "Page Not Found",
    description:
      "That address does not match a page on the SETX Youth Football Camp site. The camp, the roster form, and the photographs are all one link away.",
    path: "/404",
    noindex: true,
  },
  design: {
    title: "Design and Brand: The SETX Identity",
    description:
      "The visual identity behind the SETX Youth Football Camp: the monochrome palette and its one camp red, the editorial type, and the system behind every page.",
    path: "/design",
  },
};
