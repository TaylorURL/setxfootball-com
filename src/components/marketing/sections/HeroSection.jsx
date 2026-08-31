/**
 * The first screen: what the camp is, when it runs, and the two ways in.
 *
 * The section is taller than the fold on purpose, so the page reads as
 * continuing rather than stopping, while the primary action stays above it.
 */
import { Link } from "react-router-dom";
import { ArrowRight, Users, ShieldCheck, Heart } from "lucide-react";
import { REGISTER_PATH } from "../../nav/navLinks";
import { HERO_IMAGE } from "../../../content/campContent";
import { actionClass } from "../../ui/actionClass";
import Photo from "../../ui/Photo";
import { Squares, BlurText } from "../../reactbits";
import { CAMP_SEASON } from "../../../utils/constants";

export const CAMP_FACTS_ID = "camp-facts";

const TRUST_MARKERS = [
  { icon: Users, label: "Open to All" },
  { icon: ShieldCheck, label: "Background-Checked Coaches" },
  { icon: Heart, label: "Every Kid Plays" },
];

const HeroSection = () => (
  <>
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-ds-bg">
      {/* One warm glow against the coal gradient, and no second hue anywhere. */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-ds-bg-recessed via-ds-bg to-ds-bg" />
        <div className="absolute -right-40 top-1/4 h-[520px] w-[520px] rounded-full bg-ds-accent-soft blur-[180px]" />
        <div className="absolute -left-32 -top-24 h-[420px] w-[420px] rounded-full bg-ds-glow-neutral blur-[200px]" />
        <Squares
          className="absolute inset-0 opacity-70"
          size={64}
          speed={0.25}
          lineColor="var(--ds-border)"
        />
      </div>

      <div className="relative z-raised mx-auto w-full max-w-[1440px] px-5 pb-24 pt-24 sm:px-8 sm:pb-28 lg:px-10 lg:pb-24">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="animate-fade-in-up">
            <span className="mono-tag mb-9 inline-flex items-center gap-3 text-ds-accent-bright">
              <span aria-hidden="true" className="accent-tick is-on w-10" />
              Sign-Ups Open · Daisetta, TX · {CAMP_SEASON}
            </span>

            <h1 className="editorial-display editorial-display-tight text-ds-text">
              <span className="block text-[3rem] sm:text-[4.25rem] lg:text-[5.75rem]">
                Where every
              </span>
              <span className="block text-[3rem] text-ds-accent-bright sm:text-[4.25rem] lg:text-[5.75rem]">
                kid plays.
              </span>
            </h1>

            <BlurText
              as="p"
              className="editorial-body mt-9 max-w-measure text-lg leading-relaxed text-ds-text/80 sm:text-xl"
              delay={30}
              text="Two days of real coaching for ages 5 to 12, run by neighbors in Daisetta. Shirts, drinks, and snacks included."
            />

            <div className="mt-9 flex flex-wrap gap-3">
              <Link to={REGISTER_PATH} className={actionClass({ size: "lg" })}>
                Sign Up Your Camper <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link to="/about" className={actionClass({ tone: "outline", size: "lg" })}>
                Meet the Coaches <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="animate-fade-in-up lg:justify-self-end">
            <div className="group relative overflow-hidden border border-ds-border-strong bg-ds-surface-2">
              <Photo
                image={HERO_IMAGE}
                alt="Two SETX camp coaches working with young campers on the field in Daisetta, Texas"
                sizes="(min-width: 1024px) 46vw, 100vw"
                priority
                className="photo-mute h-[380px] w-full bg-ds-surface-2 object-cover object-top sm:h-[460px] lg:h-[560px]"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ds-bg/75 via-ds-bg/10 to-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-ds-accent/70" />
    </section>

    {/* The trust strip sits under the hero rather than inside it: the first
        screen carries the claim and the way in, and the reasons to believe it
        are the first thing past them. */}
    <div className="border-b border-ds-border bg-ds-bg-recessed">
      <ul className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center gap-x-8 gap-y-3 px-5 py-5 sm:px-8 lg:px-10">
        {TRUST_MARKERS.map(({ icon: Icon, label }) => (
          <li key={label} className="mono-tag-sm inline-flex items-center gap-2 text-ds-text-muted">
            <Icon className="h-3.5 w-3.5 text-ds-accent-bright" aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>
    </div>
  </>
);

export default HeroSection;
