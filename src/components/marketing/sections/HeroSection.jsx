/**
 * HeroSection — the cinematic hero band. Full-bleed photography with a soft
 * navy-to-coal gradient overlay, a left-aligned editorial display headline, and
 * a technical metadata strip pinned to the lower corners. Sharp corners,
 * generous whitespace, mono microcopy.
 */
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, MapPin, Calendar } from "lucide-react";
import { HERO_IMAGE } from "../../../content/campContent";
import { REGISTER_PATH } from "../../nav/navLinks";

/** Id of the band the hero scroll cue drops to (the camp-facts scoreboard). */
export const CAMP_FACTS_ID = "camp-facts";

const scrollToCampFacts = () =>
  document.getElementById(CAMP_FACTS_ID)?.scrollIntoView({ behavior: "smooth" });

const HeroSection = () => (
  <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-ds-bg">
    <div className="absolute inset-0">
      <img
        src={HERO_IMAGE}
        alt=""
        aria-hidden="true"
        className="h-full w-full animate-parallax-drift object-cover"
      />
      {/* Editorial gradient stack — navy wash, coal pull-down */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900/30 via-ds-bg/40 to-ds-bg" />
      <div className="absolute inset-0 bg-gradient-to-tr from-ds-bg/85 via-ds-bg/35 to-transparent" />
      <div aria-hidden="true" className="field-grid absolute inset-0 opacity-30" />
    </div>

    {/* Crosshair top-left technical tag */}
    <div className="pointer-events-none absolute left-5 top-24 z-20 hidden sm:left-8 sm:block lg:left-10">
      <div className="flex items-start gap-3">
        <span className="mt-[6px] inline-block h-px w-10 bg-ds-accent" aria-hidden="true" />
        <div>
          <p className="mono-tag-sm text-ds-accent-bright">Season 03 / 2026</p>
          <p className="mono-tag-sm mt-1.5 text-ds-text-faint">Daisetta, TX · 30°7′N 94°38′W</p>
        </div>
      </div>
    </div>

    {/* Crosshair top-right index tag */}
    <div className="pointer-events-none absolute right-5 top-24 z-20 hidden text-right sm:right-8 sm:block lg:right-10">
      <p className="mono-tag-sm text-ds-text-faint">[ 01 / Camp ]</p>
      <p className="mono-tag-sm mt-1.5 text-ds-text-faint">Ages 5–12 · $5 Shirt</p>
    </div>

    <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40 lg:px-10 lg:pb-32">
      <div className="max-w-5xl animate-fade-in-up">
        <span className="mono-tag mb-7 inline-flex items-center gap-3 text-ds-accent-bright">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping bg-ds-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 bg-ds-accent-bright" />
          </span>
          Roster Open · July 2026
        </span>

        <h1 className="editorial-display editorial-display-tight text-white">
          <span className="block text-[3.75rem] sm:text-[5.5rem] lg:text-[8.5rem]">
            Where future
          </span>
          <span className="block text-[3.75rem] text-ds-accent-bright sm:text-[5.5rem] lg:text-[8.5rem]">
            champions
          </span>
          <span className="block text-[3.75rem] text-white/85 sm:text-[5.5rem] lg:text-[8.5rem]">
            are made.
          </span>
        </h1>

        <p className="editorial-body mt-10 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">
          Two days of fundamentals, teamwork, and fun for kids ages 5–12. Every
          camper gets a shirt, drinks, and snacks — because in our community,
          every kid plays.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to={REGISTER_PATH}
            className="mono-tag inline-flex items-center gap-2 border border-ds-accent bg-ds-accent px-6 py-4 text-white transition-colors duration-200 hover:bg-ds-accent-bright hover:border-ds-accent-bright"
          >
            Sign Up Your Camper <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/about"
            className="mono-tag inline-flex items-center gap-2 border border-white/30 bg-white/5 px-6 py-4 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/10 hover:border-white/60"
          >
            Meet the Coaches <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-14 grid max-w-2xl grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-3">
          <div className="left-rule-accent pl-4">
            <p className="mono-tag-sm text-ds-text-faint">Dates</p>
            <p className="mt-2 inline-flex items-center gap-2 text-base font-semibold text-white">
              <Calendar className="h-3.5 w-3.5" /> July 2026
            </p>
          </div>
          <div className="left-rule-accent pl-4">
            <p className="mono-tag-sm text-ds-text-faint">Location</p>
            <p className="mt-2 inline-flex items-center gap-2 text-base font-semibold text-white">
              <MapPin className="h-3.5 w-3.5" /> Daisetta, TX
            </p>
          </div>
          <div className="left-rule-accent pl-4">
            <p className="mono-tag-sm text-ds-text-faint">Cost</p>
            <p className="mt-2 text-base font-semibold text-white">
              $5 / Shirt
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom scroll cue — editorial register */}
    <button
      type="button"
      onClick={scrollToCampFacts}
      aria-label="Scroll to camp facts"
      className="group absolute bottom-6 left-1/2 z-20 -translate-x-1/2 transition-colors hover:text-white"
    >
      <span className="mono-tag-sm flex flex-col items-center gap-2 text-white/55 transition-colors group-hover:text-white">
        Scroll
        <ChevronDown className="h-4 w-4 animate-float" />
      </span>
    </button>

    {/* Bottom hairline */}
    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-ds-accent/70" />
  </section>
);

export default HeroSection;
