/**
 * Every fact and line of copy the marketing pages render.
 *
 * An `icon` here is a name from the camp's own icon set, drawn by CampIcon.
 *
 * The sections import from here rather than holding their own strings, so the
 * camp's details are changed in one file and the same wording cannot drift
 * between the page that states it and the page that repeats it.
 *
 * The shirt price is the exception, and the one thing to be careful with: it is
 * written out as copy here and defined as `SHIRT_PRICE` in `utils/constants`,
 * which is what the form actually charges. Changing one without the other
 * leaves the site advertising a price it does not bill.
 */
import img1 from "../assets/images/1.JPG";
import img2 from "../assets/images/2.JPG";
import img3 from "../assets/images/3.JPG";
import img4 from "../assets/images/4.JPG";
import img5 from "../assets/images/5.JPG";
import img6 from "../assets/images/6.JPG";
import img7 from "../assets/images/7.JPG";
import img8 from "../assets/images/8.JPG";
import img1Jpg400 from "../assets/images/1-400w.jpg";
import img2Jpg400 from "../assets/images/2-400w.jpg";
import img3Jpg400 from "../assets/images/3-400w.jpg";
import img4Jpg400 from "../assets/images/4-400w.jpg";
import img5Jpg400 from "../assets/images/5-400w.jpg";
import img6Jpg400 from "../assets/images/6-400w.jpg";
import img7Jpg400 from "../assets/images/7-400w.jpg";
import img8Jpg400 from "../assets/images/8-400w.jpg";
import img1Small from "../assets/images/1-400w.webp";
import img1Large from "../assets/images/1-800w.webp";
import img2Small from "../assets/images/2-400w.webp";
import img2Large from "../assets/images/2-640w.webp";
import img3Small from "../assets/images/3-400w.webp";
import img3Large from "../assets/images/3-640w.webp";
import img4Small from "../assets/images/4-400w.webp";
import img4Large from "../assets/images/4-800w.webp";
import img5Small from "../assets/images/5-400w.webp";
import img5Large from "../assets/images/5-640w.webp";
import img6Small from "../assets/images/6-400w.webp";
import img6Large from "../assets/images/6-640w.webp";
import img7Small from "../assets/images/7-400w.webp";
import img7Large from "../assets/images/7-640w.webp";
import img8Small from "../assets/images/8-400w.webp";
import img8Large from "../assets/images/8-640w.webp";
import img1Avif400 from "../assets/images/1-400w.avif";
import img1Avif800 from "../assets/images/1-800w.avif";
import img2Avif400 from "../assets/images/2-400w.avif";
import img2Avif640 from "../assets/images/2-640w.avif";
import img3Avif400 from "../assets/images/3-400w.avif";
import img3Avif640 from "../assets/images/3-640w.avif";
import img4Avif400 from "../assets/images/4-400w.avif";
import img4Avif800 from "../assets/images/4-800w.avif";
import img5Avif400 from "../assets/images/5-400w.avif";
import img5Avif640 from "../assets/images/5-640w.avif";
import img6Avif400 from "../assets/images/6-400w.avif";
import img6Avif640 from "../assets/images/6-640w.avif";
import img7Avif400 from "../assets/images/7-400w.avif";
import img7Avif640 from "../assets/images/7-640w.avif";
import img8Avif400 from "../assets/images/8-400w.avif";
import img8Avif640 from "../assets/images/8-640w.avif";
import { CAMP_SEASON } from "../utils/constants";

// Each photograph at two widths in three formats, ordered the way the browser
// reads them: AVIF, WebP behind it, and the JPEG the oldest ones fall to. The
// intrinsic pixels reserve the box before any of them arrives. A phone asking
// for a narrow column gets the narrow file whichever branch it lands on, so
// each format is passed as its own [small, large] pair.
//
// The width the small file is offered at is read out of its own name rather
// than restated here, because the two sets are cut to different widths and a
// derivative described at a width it is not is picked for the wrong column.
// The large one is offered at the intrinsic width it was cut to.
const smallWidth = (file) => {
  const named = /-(\d+)w\./.exec(file);
  if (!named) throw new Error(`photo: ${file} does not name the width it was cut to`);
  return named[1];
};

// A format the set does not carry is passed as null and simply not offered. A
// source that is picked and then 404s draws a broken image rather than falling
// through to the next one, so an absent format has to be absent from the markup.
const srcSet = (pair, largeWidth) =>
  pair ? `${pair[0]} ${smallWidth(pair[0])}w, ${pair[1]} ${largeWidth}w` : null;

const photo = (avif, webp, jpeg, largeWidth, width, height) => ({
  src: jpeg[1],
  jpeg: srcSet(jpeg, largeWidth),
  webp: srcSet(webp, largeWidth),
  avif: srcSet(avif, largeWidth),
  width,
  height,
});

export const PHOTOS = {
  coachesOnField: photo(
    [img1Avif400, img1Avif800],
    [img1Small, img1Large],
    [img1Jpg400, img1],
    800,
    800,
    532,
  ),
  runningTheDrill: photo(
    [img2Avif400, img2Avif640],
    [img2Small, img2Large],
    [img2Jpg400, img2],
    640,
    640,
    426,
  ),
  firstContact: photo(
    [img3Avif400, img3Avif640],
    [img3Small, img3Large],
    [img3Jpg400, img3],
    640,
    640,
    426,
  ),
  ballInHand: photo(
    [img4Avif400, img4Avif800],
    [img4Small, img4Large],
    [img4Jpg400, img4],
    800,
    800,
    532,
  ),
  sponsorWall: photo(
    [img5Avif400, img5Avif640],
    [img5Small, img5Large],
    [img5Jpg400, img5],
    640,
    640,
    426,
  ),
  blockingPads: photo(
    [img6Avif400, img6Avif640],
    [img6Small, img6Large],
    [img6Jpg400, img6],
    640,
    640,
    426,
  ),
  warmUps: photo(
    [img7Avif400, img7Avif640],
    [img7Small, img7Large],
    [img7Jpg400, img7],
    640,
    640,
    426,
  ),
  waterBreak: photo(
    [img8Avif400, img8Avif640],
    [img8Small, img8Large],
    [img8Jpg400, img8],
    640,
    640,
    426,
  ),
};

export const HERO_IMAGE = PHOTOS.coachesOnField;
export const STORY_IMAGE = PHOTOS.warmUps;

// Applies to walk-ons too, not just registered campers.
export const CAMPER_PERKS = [
  {
    icon: "jersey",
    title: "A Camp Shirt",
    body: "Every camper gets a shirt. Yours to keep, registered or not.",
  },
  {
    icon: "nachos",
    title: "Drinks & Snacks",
    body: "We keep the sideline stocked so kids stay fueled all day.",
  },
  {
    icon: "referee-whistle",
    title: "Real Coaching",
    body: "Fundamentals, drills, and game reps from experienced coaches.",
  },
  {
    icon: "athlete",
    title: "Every Kid Plays",
    body: "No tryouts, no bench. Show up and you're on the field.",
  },
];

export const STORY_PILLARS = [
  {
    icon: "fans",
    title: "Open to All",
    body: "Every kid plays. Registered or not, every camper gets a shirt, drinks, and snacks.",
  },
  {
    icon: "badge",
    title: "Background-Checked",
    body: "Every coach on the field has cleared a background check and arrived with real coaching experience.",
  },
  {
    icon: "stadium",
    title: "Community First",
    body: "Built in Daisetta, for Daisetta. We keep cost low so the field stays open to every family.",
  },
  {
    icon: "mvp",
    title: "Pro-Level Guests",
    body: "Guest pro athletes show up to coach and speak, giving campers exposure most camps can't offer.",
  },
];

export const COACHES = [
  {
    name: "Clayton Hanks",
    number: "01",
    role: "Co-Founder · Head Coach",
    icon: "trophy",
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
    icon: "coach",
    highlight: "Dedicated Youth Development",
    points: [
      "Graduate of Hull-Daisetta High School",
      "Former lettering athlete with proven competitive experience",
      "Approximately five years of coaching experience",
    ],
  },
];

export const PLAYBOOK = [
  {
    icon: "strategy",
    title: "Sign Up Online",
    body: "Fill out the roster form and pick a shirt size for each camper. Takes a couple of minutes.",
  },
  {
    icon: "ticket",
    title: "Pay $5 Per Shirt",
    body: "Send payment by CashApp to $SETXYFC after you sign up. Nothing is due up front.",
  },
  {
    icon: "calendar",
    title: "Show Up and Play",
    body: `Bring your camper to Daisetta in ${CAMP_SEASON} for two half-days of football.`,
  },
];

export const GALLERY = [
  { image: PHOTOS.coachesOnField, span: "col-span-2 row-span-2", caption: "Coaches on the field" },
  { image: PHOTOS.runningTheDrill, span: "col-span-1 row-span-1", caption: "Running the drill" },
  { image: PHOTOS.firstContact, span: "col-span-1 row-span-1", caption: "First contact" },
  { image: PHOTOS.ballInHand, span: "col-span-1 row-span-2", caption: "Ball in hand" },
  { image: PHOTOS.sponsorWall, span: "col-span-2 row-span-1", caption: "The sponsor wall" },
  { image: PHOTOS.blockingPads, span: "col-span-1 row-span-1", caption: "Blocking pads" },
  { image: PHOTOS.warmUps, span: "col-span-1 row-span-1", caption: "Warm-ups" },
  { image: PHOTOS.waterBreak, span: "col-span-2 row-span-1", caption: "Water break" },
];

// Sponsor logos, named so the alt text can say whose mark it is rather than
// numbering them.
//
// These are served from public/sponsors rather than imported through the
// bundler, because a sponsor comes and goes between seasons and dropping a file
// in a directory is the whole job. They carry WebP and JPEG and no AVIF, so the
// AVIF pair is null and the browser starts at WebP.
export const SPONSORS = [
  {
    name: "Coastal Field Services",
    image: photo(
      null,
      ["/sponsors/IMG_2678-585w.webp", "/sponsors/IMG_2678-1170w.webp"],
      ["/sponsors/IMG_2678-585w.jpg", "/sponsors/IMG_2678.JPEG"],
      1170,
      1170,
      769,
    ),
  },
  {
    name: "Yu Sushi Steak House",
    image: photo(
      null,
      ["/sponsors/IMG_2685-585w.webp", "/sponsors/IMG_2685-1170w.webp"],
      ["/sponsors/IMG_2685-585w.jpg", "/sponsors/IMG_2685.JPEG"],
      1170,
      1170,
      713,
    ),
  },
  {
    name: "Aqua Guard Aerobic",
    image: photo(
      null,
      ["/sponsors/IMG_2686-585w.webp", "/sponsors/IMG_2686-1170w.webp"],
      ["/sponsors/IMG_2686-585w.jpg", "/sponsors/IMG_2686.JPEG"],
      1170,
      1170,
      1032,
    ),
  },
];

// The questions a parent asks before signing a kid up, answered in the words
// the rest of the site already uses. Rendered on the About page and emitted as
// FAQPage markup from the same array, so the page and the search result cannot
// answer the same question two ways.
export const FAQ = [
  {
    question: "What ages is the camp for?",
    answer:
      "Kids ages 5 to 12. There are no tryouts and no bench, so a camper who has never played gets the same reps as one who has played for years.",
  },
  {
    question: "How much does the camp cost?",
    answer:
      "The camp itself is free. Shirts are $5 each, paid after you sign up, and drinks and snacks are covered by our sponsors.",
  },
  {
    question: "When and where is the camp held?",
    answer: `Two half-days in ${CAMP_SEASON}, in Daisetta, Texas. Southeast Texas families across Liberty County are welcome.`,
  },
  {
    question: "Does my camper need experience or gear?",
    answer:
      "No. Every kid plays regardless of experience, and the camp is non-contact fundamentals, drills, and game reps rather than full-pad football.",
  },
  {
    question: "What does my camper get?",
    answer:
      "A camp shirt to keep, drinks and snacks on the sideline, and coaching from experienced coaches. Walk-ons get the same as registered campers.",
  },
  {
    question: "Who coaches the camp?",
    answer:
      "Clayton Hanks and Timothy Taylor Sr., both Hull-Daisetta graduates, lead the camp. Every coach on the field has cleared a background check, and guest pro athletes join to coach and speak.",
  },
  {
    question: "How do I sign up?",
    answer:
      "Fill out the roster form with a shirt size for each camper, then send $5 per shirt by CashApp to $SETXYFC. Nothing is due up front.",
  },
];

// The copy under the photo grid and the sponsor wall. A page whose whole body
// is a heading and a set of tiles carries nothing a reader or a search engine
// can weigh, so each of those two says in words what its pictures show.
export const GALLERY_NOTES = [
  {
    title: "What a camp day looks like",
    body: `Every camper works through the same rotation: warm-ups, footwork and ball-handling drills, position work with a coach, then live game reps. Nobody sits out a rotation and nobody is cut, so the photographs show the whole roster on the field rather than a starting group and a bench.`,
  },
  {
    title: "Where these were taken",
    body: `All of it in Daisetta, Liberty County, on the same field the camp has run on since it started. The sponsor wall in the background is the local businesses that pay for the shirts, the drinks and the snacks every camper goes home with.`,
  },
  {
    title: "Using a photo of your camper",
    body: `Photographs are taken at camp and used on this site and in camp announcements. Families who would rather their camper not appear can say so at sign-up or call the camp, and the photograph comes down.`,
  },
  {
    title: "Three seasons in",
    body: `The camp has run every summer since it started and this is the third season. The pictures here come from all of them, which is why some faces turn up more than once: campers come back, and several of the older ones now help run the drills they learned in the first year.`,
  },
];

export const SPONSOR_NOTES = [
  {
    title: "What sponsorship pays for",
    body: `Sponsorship covers the shirt every camper takes home, the drinks and snacks on the sideline, and the field and equipment costs for both days. It is the reason the camp itself is free and the only thing a family pays is $5 a shirt.`,
  },
  {
    title: "Why it stays local",
    body: `Every sponsor is a Southeast Texas business or family. Keeping it that way means the money that runs the camp comes from the same community the campers do, and the businesses on the wall are ones a parent in Liberty County already knows.`,
  },
  {
    title: "Becoming a sponsor",
    body: `Businesses and families who want to sponsor a season can call the camp. Sponsors appear on this page and on the wall at camp, and the coaches will tell you exactly what a season costs before you commit to anything.`,
  },
  {
    title: "This season's sponsors",
    body: `Coastal Field Services, Yu Sushi Steak House and Aqua Guard Aerobic are carrying this season. Their marks are on the wall above, on the banner at the field, and worth remembering the next time something in Liberty County needs doing.`,
  },
];
