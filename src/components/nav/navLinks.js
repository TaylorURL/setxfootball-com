// Navbar and Footer both render from this, so the route map lives in one place.
// Registration is deliberately kept out — it renders as a button, not a link.
export const PUBLIC_NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Gallery", to: "/gallery" },
  { label: "Sponsors", to: "/sponsors" },
];

export const REGISTER_PATH = "/register";
