/**
 * @module homeContent
 * @description Static content for the landing page — section copy, coach roster,
 * gallery layout, and sponsor assets — kept out of the view so HomePage reads as
 * structure. All copy reflects the real SETX Youth Football Camp.
 */
import {
  Star,
  Heart,
  Users,
  Trophy,
  ShieldCheck,
  Shirt,
  CupSoda,
  ClipboardList,
  DollarSign,
  CalendarCheck,
} from "lucide-react";
import img1 from "../../assets/images/1.JPG";
import img2 from "../../assets/images/2.JPG";
import img3 from "../../assets/images/3.JPG";
import img4 from "../../assets/images/4.JPG";
import img5 from "../../assets/images/5.JPG";
import img6 from "../../assets/images/6.JPG";
import img7 from "../../assets/images/7.JPG";
import img8 from "../../assets/images/8.JPG";

export const HERO_IMAGE = img1;
export const STORY_IMAGE = img1;

export const NAV_SECTIONS = ["home", "about", "gallery", "sponsors"];

export const HERO_STATS = [
  { value: "5–12", label: "Ages" },
  { value: "$5", label: "Per Shirt" },
  { value: "2 Days", label: "On Field" },
  { value: "03", label: "Season" },
];

/** What every camper walks away with — true for registered kids and walk-ons alike. */
export const CAMPER_PERKS = [
  { icon: Shirt, title: "A Camp Shirt", body: "Every camper gets a shirt — yours to keep, registered or not." },
  { icon: CupSoda, title: "Drinks & Snacks", body: "We keep the sideline stocked so kids stay fueled all day." },
  { icon: Trophy, title: "Real Coaching", body: "Fundamentals, drills, and game reps from experienced coaches." },
  { icon: Heart, title: "Every Kid Plays", body: "No tryouts, no bench. Show up and you're on the field." },
];

export const STORY_PILLARS = [
  {
    icon: Users,
    title: "Open to All",
    body: "Every kid plays — registered or not, every camper gets a shirt, drinks, and snacks.",
  },
  {
    icon: ShieldCheck,
    title: "Background-Checked",
    body: "Every coach on the field has cleared a background check and arrived with real coaching experience.",
  },
  {
    icon: Heart,
    title: "Community First",
    body: "Built in Daisetta, for Daisetta — we keep cost low so the field stays open to every family.",
  },
  {
    icon: Star,
    title: "Pro-Level Guests",
    body: "Guest pro athletes show up to coach and speak, giving campers exposure most camps can't offer.",
  },
];

export const COACHES = [
  {
    name: "Clayton Hanks",
    number: "01",
    role: "Co-Founder · Head Coach",
    icon: Trophy,
    highlight: "International Playing Experience",
    points: [
      "Graduate of Hull-Daisetta High School",
      "Played semi-professional and international football",
      "Actively coaching youth football for three consecutive years",
    ],
  },
  {
    name: "Timothy Taylor Sr.",
    number: "02",
    role: "Co-Founder · Head Coach",
    icon: Heart,
    highlight: "Dedicated Youth Development",
    points: [
      "Graduate of Hull-Daisetta High School",
      "Former lettering athlete with proven competitive experience",
      "Approximately five years of coaching experience",
    ],
  },
];

/** The real sign-up flow, framed as a playbook. */
export const PLAYBOOK = [
  {
    icon: ClipboardList,
    title: "Sign Up Online",
    body: "Fill out the roster form and pick a shirt size for each camper. Takes a couple of minutes.",
  },
  {
    icon: DollarSign,
    title: "Pay $5 Per Shirt",
    body: "Send payment by CashApp to $SETXYFC after you sign up — nothing is due up front.",
  },
  {
    icon: CalendarCheck,
    title: "Show Up & Play",
    body: "Bring your camper to Daisetta in July 2026 for two half-days of football.",
  },
];

export const GALLERY = [
  { src: img1, span: "col-span-2 row-span-2", caption: "On the field" },
  { src: img2, span: "col-span-1 row-span-1", caption: "Huddle up" },
  { src: img3, span: "col-span-1 row-span-1", caption: "Game ready" },
  { src: img4, span: "col-span-1 row-span-2", caption: "Coaches" },
  { src: img5, span: "col-span-2 row-span-1", caption: "Camp day" },
  { src: img6, span: "col-span-1 row-span-1", caption: "First downs" },
  { src: img7, span: "col-span-1 row-span-1", caption: "All hands" },
  { src: img8, span: "col-span-2 row-span-1", caption: "Together" },
];

export const SPONSOR_IMAGES = [
  "/sponsors/IMG_2678.JPEG",
  "/sponsors/IMG_2685.JPEG",
  "/sponsors/IMG_2686.JPEG",
];
