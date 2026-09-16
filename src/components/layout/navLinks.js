// Navbar and Footer both render from this, so the route map lives in one place.
// Registration is deliberately kept out; it renders as a button, not a link.
export const PUBLIC_NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Gallery", to: "/gallery" },
  { label: "Sponsors", to: "/sponsors" },
  { label: "Contact", to: "/contact" },
];

export const REGISTER_PATH = "/register";

/**
 * The panel behind the bar's one trigger. Each destination carries its mark
 * from the icon set and the line the panel shows beneath it, so a parent choosing between Gallery and Sponsors
 * reads what each holds rather than guessing from one word.
 */
export const NAV_PANEL = [
  {
    heading: "The Camp",
    items: [
      {
        label: "About",
        to: "/about",
        icon: "coach",
        note: "The story, the coaches, and who the camp is for.",
      },
      {
        label: "Gallery",
        to: "/gallery",
        icon: "stadium",
        note: "Photographs from past seasons on the field.",
      },
      {
        label: "Sponsors",
        to: "/sponsors",
        icon: "badge",
        note: "The businesses covering shirts and snacks.",
      },
    ],
  },
  {
    heading: "Take Part",
    items: [
      {
        label: "Sign Up",
        to: REGISTER_PATH,
        icon: "ticket",
        note: "The roster form. One entry per camper.",
      },
      {
        label: "Contact",
        to: "/contact",
        icon: "referee-whistle",
        note: "Phone, email, and where the field is.",
      },
      {
        label: "Design",
        to: "/design",
        icon: "strategy",
        note: "The palette, the type, and the system behind it.",
      },
    ],
  },
];
