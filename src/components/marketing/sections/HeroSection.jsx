/**
 * HeroSection — the home page hero. Solid monochrome canvas (no photo), a
 * large left-aligned headline, a short intro paragraph, two sign-up CTAs, and
 * a compact dates/location/cost strip pinned to the bottom of the band.
 */
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, MapPin, Calendar } from "lucide-react";
import { REGISTER_PATH } from "../../nav/navLinks";
import {
  Squares,
  ShinyText,
  GradientText,
  RotatingText,
  Magnet,
  BlurText,
} from "../../reactbits";

/** Id of the band the hero scroll cue drops to (the camp-facts scoreboard). */
export const CAMP_FACTS_ID = "camp-facts";

const scrollToCampFacts = () =>
  document.getElementById(CAMP_FACTS_ID)?.scrollIntoView({ behavior: "smooth" });

const HeroSection = () => (
  <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-ds-bg">
    {/* Editorial monochrome wash: a black-to-coal gradient with a single warm
        red glow off to one side. All tokens — no image, no second hue. */}
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-ds-bg to-ds-bg" />
      <div className="absolute -right-40 top-1/3 h-[520px] w-[520px] rounded-full bg-ds-accent-soft blur-[180px]" />
      <div className="absolute -left-32 -top-24 h-[420px] w-[420px] rounded-full bg-white/5 blur-[200px]" />
      {/* React Bits — a slowly drifting Squares grid replaces the static
          field-grid so the hero canvas quietly breathes. */}
      <Squares className="absolute inset-0 opacity-70" size={64} speed={0.25} lineColor="var(--ds-border)" />
    </div>

    <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40 lg:px-10 lg:pb-32">
      <div className="max-w-5xl animate-fade-in-up">
        <span className="mono-tag mb-7 inline-flex items-center gap-3 text-ds-accent-bright">
          <span aria-hidden="true" className="accent-tick is-on w-10" />
          <ShinyText text="Sign-ups Open · July 2026" speed={4} />
        </span>

        <h1 className="editorial-display editorial-display-tight text-ds-text">
          <span className="block text-[3.75rem] sm:text-[5.5rem] lg:text-[8.5rem]">
            Where future
          </span>
          {/* React Bits — GradientText keeps a living red glow on the key word. */}
          <GradientText
            as="span"
            className="block text-[3.75rem] sm:text-[5.5rem] lg:text-[8.5rem]"
            colors={["#ff2e3d", "#ff8a92", "#ffffff", "#ff2e3d"]}
            speed={7}
          >
            champions
          </GradientText>
          {/* React Bits — RotatingText cycles the closing verb on a slow loop. */}
          <span className="flex text-[3.75rem] text-ds-text/85 sm:text-[5.5rem] lg:text-[8.5rem]">
            are&nbsp;
            <RotatingText texts={["made.", "built.", "forged.", "raised."]} interval={2600} />
          </span>
        </h1>

        {/* React Bits — BlurText brings the intro copy in word-by-word. */}
        <BlurText
          as="p"
          className="editorial-body mt-10 max-w-xl text-lg leading-relaxed text-ds-text/80 sm:text-xl"
          delay={30}
          text="Two days of fundamentals, teamwork, and fun for kids ages 5–12. Every camper gets a shirt, drinks, and snacks — because in our community, every kid plays."
        />

        <div className="mt-10 flex flex-wrap gap-3">
          {/* React Bits — Magnet gives the primary CTA a subtle pull toward the cursor. */}
          <Magnet padding={80} strength={0.3}>
            <Link
              to={REGISTER_PATH}
              className="press-down group mono-tag inline-flex items-center gap-2 border border-ds-accent bg-ds-accent px-6 py-4 text-white transition-colors duration-200 hover:bg-ds-accent-bright hover:border-ds-accent-bright"
            >
              Sign Up Your Camper <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Magnet>
          <Link
            to="/about"
            className="press-down mono-tag inline-flex items-center gap-2 border border-ds-border-strong bg-white/5 px-6 py-4 text-ds-text backdrop-blur-sm transition-colors duration-200 hover:bg-white/10 hover:border-ds-text-muted"
          >
            Meet the Coaches <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-14 grid max-w-2xl grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-3">
          <div className="left-rule-accent pl-4">
            <p className="mono-tag-sm text-ds-text-faint">Dates</p>
            <p className="mt-2 inline-flex items-center gap-2 text-base font-semibold text-ds-text">
              <Calendar className="h-3.5 w-3.5" /> July 2026
            </p>
          </div>
          <div className="left-rule-accent pl-4">
            <p className="mono-tag-sm text-ds-text-faint">Location</p>
            <p className="mt-2 inline-flex items-center gap-2 text-base font-semibold text-ds-text">
              <MapPin className="h-3.5 w-3.5" /> Daisetta, TX
            </p>
          </div>
          <div className="left-rule-accent pl-4">
            <p className="mono-tag-sm text-ds-text-faint">Cost</p>
            <p className="mt-2 text-base font-semibold text-ds-text">
              $5 / Shirt
            </p>
          </div>
        </div>
      </div>
    </div>

    <button
      type="button"
      onClick={scrollToCampFacts}
      aria-label="Scroll to camp facts"
      className="group absolute bottom-6 left-1/2 z-20 -translate-x-1/2 transition-colors hover:text-ds-text"
    >
      <span className="mono-tag-sm flex flex-col items-center gap-2 text-ds-text/55 transition-colors group-hover:text-ds-text">
        Scroll
        <ChevronDown className="h-4 w-4 animate-float" />
      </span>
    </button>

    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-ds-accent/70" />
  </section>
);

export default HeroSection;
