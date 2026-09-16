/**
 * The first screen: what the camp is, when it runs, and the two ways in.
 *
 * Copy on the left with the four facts a parent scans for, the photograph on
 * the right with the price badge on its corner. The trust strip sits under
 * both as the first white band on the page.
 */
import { Link } from "react-router-dom";
import { REGISTER_PATH } from "../../layout/navLinks";
import { HERO_IMAGE } from "../../../content/campContent";
import { actionClass } from "../../ui/actionClass";
import CampIcon from "../../ui/CampIcon";
import Photo from "../../ui/Photo";
import { BlurText } from "../../reactbits";
import { CAMP_SEASON, SHIRT_PRICE } from "../../../utils/constants";

export const CAMP_FACTS_ID = "camp-facts";

const QUICK_FACTS = [
  { value: "5 to 12", label: "Ages" },
  { value: `$${SHIRT_PRICE}`, label: "Per Shirt" },
  { value: "2", label: "Days" },
  { value: "$0", label: "To Play" },
];

const TRUST_MARKERS = [
  { icon: "fans", label: "Open to All" },
  { icon: "referee", label: "Background-Checked Coaches" },
  { icon: "athlete", label: "Every Kid Plays" },
  { icon: "mvp", label: "Guest Pro Athletes" },
];

const HeroSection = () => (
  <>
    <section className="relative overflow-hidden bg-ds-bg pt-[var(--header-height)]">
      <div className="relative mx-auto w-full max-w-[1160px] px-6 pb-16 pt-12 sm:px-10 sm:pb-20 sm:pt-16 lg:px-16 lg:pb-24 lg:pt-20">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="animate-fade-in-up">
            <span className="eyebrow">Sign-Ups Open · {CAMP_SEASON}</span>

            <h1 className="display mt-6 text-[3rem] text-ds-text sm:text-[4rem] lg:text-[5rem]">
              Every kid plays.
            </h1>

            <BlurText
              as="p"
              className="body-copy mt-6 max-w-measure text-base text-ds-text-muted sm:text-lg"
              delay={30}
              text="Two days of real coaching for ages 5 to 12, run by neighbors in Daisetta. Shirts, drinks, and snacks are included, and the camp itself is free."
            />

            <div className="mt-9 flex flex-wrap gap-3">
              <Link to={REGISTER_PATH} className={actionClass({ size: "lg" })}>
                Sign Up Your Camper
              </Link>
              <Link to="/about" className={actionClass({ tone: "outline", size: "lg" })}>
                Meet the Coaches
              </Link>
            </div>

            <dl id={CAMP_FACTS_ID} className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              {QUICK_FACTS.map(({ value, label }) => (
                <div key={label}>
                  <dd className="numeral text-3xl text-ds-accent">{value}</dd>
                  <dt className="label-caps mt-1 text-ds-text-muted">{label}</dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="animate-fade-in-up relative mx-auto w-full max-w-[520px] lg:justify-self-end">
            <div className="group photo-frame bg-ds-bg-elevated p-2.5">
              <Photo
                image={HERO_IMAGE}
                alt="Two SETX camp coaches working with young campers on the field in Daisetta, Texas"
                sizes="(min-width: 1024px) 46vw, 100vw"
                priority
                className="photo-zoom h-[280px] w-full rounded-ds-md object-cover object-top sm:h-[360px] lg:h-[380px]"
              />
              <p className="label-caps mt-2.5 text-ds-text-muted">Daisetta, TX · Season three</p>
            </div>
            <div className="absolute -bottom-5 left-5 rounded-ds-md border-rule border-ds-border-strong bg-ds-accent px-5 py-3 text-ds-on-accent shadow-hard-sm">
              <p className="numeral text-4xl">${SHIRT_PRICE}</p>
              <p className="label-caps mt-1">per shirt · camp is free</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* The trust strip sits under the hero rather than inside it: the first
        screen carries the claim and the way in, and the reasons to believe it
        are the first thing past them. */}
    <div className="border-y-rule border-ds-border bg-ds-bg-elevated text-ds-text">
      <ul className="mx-auto grid w-full max-w-[1160px] grid-cols-2 gap-x-6 gap-y-4 px-5 py-5 sm:px-8 lg:flex lg:items-center lg:justify-between lg:px-10">
        {TRUST_MARKERS.map(({ icon, label }) => (
          <li key={label} className="label-caps inline-flex items-center gap-3">
            <CampIcon name={icon} size={32} />
            {label}
          </li>
        ))}
      </ul>
    </div>
  </>
);

export default HeroSection;
