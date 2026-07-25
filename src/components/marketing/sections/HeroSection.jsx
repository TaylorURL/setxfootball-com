import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, MapPin, Calendar, Users, ShieldCheck, Heart } from "lucide-react";
import { REGISTER_PATH } from "../../nav/navLinks";
import { HERO_IMAGE } from "../../../content/campContent";
import { Squares, ShinyText, GradientText, BlurText, Magnet } from "../../reactbits";

export const CAMP_FACTS_ID = "camp-facts";

const scrollToCampFacts = () =>
  document.getElementById(CAMP_FACTS_ID)?.scrollIntoView({ behavior: "smooth" });

const TRUST_MARKERS = [
  { icon: Users, label: "Open to all" },
  { icon: ShieldCheck, label: "Background-checked coaches" },
  { icon: Heart, label: "Every kid plays" },
];

const HeroSection = () => (
  <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-ds-bg">
    {/* One warm glow against the coal gradient — no second hue anywhere. */}
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-ds-bg to-ds-bg" />
      <div className="absolute -right-40 top-1/4 h-[520px] w-[520px] rounded-full bg-ds-accent-soft blur-[180px]" />
      <div className="absolute -left-32 -top-24 h-[420px] w-[420px] rounded-full bg-white/5 blur-[200px]" />
      <Squares className="absolute inset-0 opacity-70" size={64} speed={0.25} lineColor="var(--ds-border)" />
    </div>

    <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-24 pt-32 sm:px-8 sm:pb-28 sm:pt-40 lg:px-10 lg:pb-24 lg:pt-36">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="animate-fade-in-up">
          <span className="mono-tag mb-7 inline-flex items-center gap-3 text-ds-accent-bright">
            <span aria-hidden="true" className="accent-tick is-on w-10" />
            <ShinyText text="Sign-Ups Open · Daisetta, TX · July 2026" speed={4} />
          </span>

          <h1 className="editorial-display editorial-display-tight text-ds-text">
            <span className="block text-[3rem] sm:text-[4.25rem] lg:text-[5.75rem]">
              Where every
            </span>
            <GradientText
              as="span"
              className="block text-[3rem] sm:text-[4.25rem] lg:text-[5.75rem]"
              colors={["#ff2e3d", "#ff8a92", "#ffffff", "#ff2e3d"]}
              speed={7}
            >
              kid plays.
            </GradientText>
            <span className="block text-[3rem] text-ds-text/85 sm:text-[4.25rem] lg:text-[5.75rem]">
              No exceptions.
            </span>
          </h1>

          <BlurText
            as="p"
            className="editorial-body mt-9 max-w-xl text-lg leading-relaxed text-ds-text/80 sm:text-xl"
            delay={30}
            text="Two days of real coaching, teamwork, and fun for kids ages 5–12, run by neighbors right here in Daisetta. Every camper gets a shirt, drinks, and snacks — because in our community, every kid belongs on the field."
          />

          <div className="mt-9 flex flex-wrap gap-3">
            <Magnet padding={80} strength={0.3}>
              <Link
                to={REGISTER_PATH}
                className="press-down mono-tag group inline-flex items-center gap-2 border border-ds-accent bg-ds-accent px-6 py-4 text-white transition-colors duration-200 hover:bg-ds-accent-bright hover:border-ds-accent-bright"
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

          <ul className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            {TRUST_MARKERS.map(({ icon: Icon, label }) => (
              <li key={label} className="mono-tag-sm inline-flex items-center gap-2 text-ds-text-muted">
                <Icon className="h-3.5 w-3.5 text-ds-accent-bright" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-11 grid max-w-2xl grid-cols-2 gap-x-10 gap-y-6 border-t border-ds-border pt-8 sm:grid-cols-3">
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

        <div className="animate-fade-in-up lg:justify-self-end">
          <div className="group relative overflow-hidden border border-ds-border-strong">
            <img
              src={HERO_IMAGE}
              alt="SETX Youth Football Camp coaches working with young campers on the field in Daisetta, Texas"
              className="h-[380px] w-full object-cover object-top grayscale transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:grayscale-0 sm:h-[460px] lg:h-[560px]"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ds-bg/75 via-ds-bg/10 to-transparent" />

            <div className="absolute bottom-5 left-5 border-l-2 border-ds-accent bg-ds-bg/85 px-5 py-4 backdrop-blur-sm">
              <p className="mono-tag-sm text-ds-text-faint">Now in our</p>
              <p className="editorial-display mt-1 text-2xl text-ds-text">
                Third year &amp; growing
              </p>
            </div>
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
