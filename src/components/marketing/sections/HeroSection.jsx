/**
 * HeroSection — the varsity hero band over the field photo. Full-bleed, sits
 * under the floating navbar. CTAs route to sign-up and the about page; the
 * scroll cue drops to the on-page camp-facts band.
 */
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, ChevronDown, MapPin } from "lucide-react";
import { Container, Button, Text } from "@bradley-t-t/sunday-design-system";
import { HERO_IMAGE } from "../../../content/campContent";
import { REGISTER_PATH } from "../../nav/navLinks";

/** Id of the band the hero scroll cue drops to (the camp-facts scoreboard). */
export const CAMP_FACTS_ID = "camp-facts";

const ChipLabel = ({ children, className = "" }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-ds-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-sm ${className}`}>
    {children}
  </span>
);

const scrollToCampFacts = () =>
  document.getElementById(CAMP_FACTS_ID)?.scrollIntoView({ behavior: "smooth" });

const HeroSection = () => (
  <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-slate-950">
    <div className="absolute inset-0">
      <img src={HERO_IMAGE} alt="" aria-hidden="true" className="h-full w-full animate-subtle-zoom object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/85 via-slate-950/75 to-primary-800/65" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/30" />
      <div aria-hidden="true" className="field-grid absolute inset-0 opacity-40" />
      <div aria-hidden="true" className="field-numbers absolute inset-x-0 bottom-0 h-40 opacity-60" />
    </div>
    <div aria-hidden="true" className="accent-edge absolute inset-x-0 bottom-0 h-1.5" />

    <Container size="xl" className="relative z-10 py-32">
      <div className="max-w-3xl animate-fade-in-up">
        <div className="mb-7 flex flex-wrap items-center gap-2.5">
          <ChipLabel>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
            </span>
            <Calendar className="h-3 w-3 text-accent-300" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/90">
              Season 03 · July 2026
            </span>
          </ChipLabel>
          <ChipLabel className="bg-white/[0.06]">
            <MapPin className="h-3 w-3 text-white/70" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/75">Daisetta, TX</span>
          </ChipLabel>
        </div>

        <h1 className="heading-stencil heading-stencil-tight mb-7 text-[3.5rem] text-white sm:text-[5.5rem] lg:text-[7rem]">
          Where Future
          <br />
          <span className="relative inline-block">
            <span className="relative z-10 text-accent-400">Champions</span>
            <span aria-hidden="true" className="absolute inset-x-0 bottom-2 -z-0 h-3.5 -skew-x-6 rounded bg-accent-500/30" />
          </span>
          <br />
          Are Made.
        </h1>

        <Text size="lg" className="mb-10 max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl">
          Two days of fundamentals, teamwork, and fun for kids ages 5–12. Every
          camper gets a shirt, drinks, and snacks — because in our community,
          every kid plays.
        </Text>

        <div className="flex flex-wrap gap-3 sm:gap-4">
          <Button asChild variant="primary" size="lg" className="font-bold uppercase tracking-[0.06em]">
            <Link to={REGISTER_PATH}>
              Sign Up Your Camper <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/25 bg-white/10 font-semibold uppercase tracking-[0.04em] text-white backdrop-blur-sm hover:border-white/40 hover:text-white"
          >
            <Link to="/about">Meet the Coaches</Link>
          </Button>
        </div>
      </div>
    </Container>

    <button
      onClick={scrollToCampFacts}
      aria-label="Scroll to camp facts"
      className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 animate-float text-white/50 transition-colors hover:text-white"
    >
      <ChevronDown className="h-5 w-5" />
    </button>
  </section>
);

export default HeroSection;
