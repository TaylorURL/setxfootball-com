/**
 * @module navLinks
 * @description Single source of truth for the public site's primary navigation.
 * Shared by the Navbar and Footer so the route map lives in exactly one place.
 * The registration call-to-action is kept separate (it renders as a button).
 */

/** Primary routed destinations, in nav order. */
export const PUBLIC_NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Gallery", to: "/gallery" },
  { label: "Sponsors", to: "/sponsors" },
];

/** The sign-up route, surfaced as the primary call to action. */
export const REGISTER_PATH = "/register";
