/**
 * HomePage — public landing surface for SETX Youth Football Camp.
 *
 * Sections: navigation, varsity hero, story + coaches, "why we're different"
 * pillar, gallery, sponsors, registration, footer. The hero and feature bands
 * use deliberate dark, image-forward brand treatments; everything else is
 * composed from design-system primitives that follow the active theme. Scroll
 * choreography comes from the shared `Reveal` primitive and section headers
 * from `SectionIntro`.
 */
import {
  Calendar,
  ArrowRight,
  ChevronDown,
  Star,
  Heart,
  Users,
  Trophy,
  ShieldCheck,
  Handshake,
  Shirt,
  MapPin,
  Sparkles,
} from "lucide-react";
import {
  Container,
  Section,
  Grid,
  Card,
  Button,
  Text,
  Eyebrow,
} from "@bradley-t-t/sunday-design-system";
import Navbar from "../../components/nav/Navbar";
import Footer from "../../components/footer/Footer";
import Reveal from "../../components/marketing/Reveal";
import SectionIntro from "../../components/marketing/SectionIntro";
import RegistrationForm from "./RegistrationForm";
import { SHIRT_PRICE } from "../../utils/constants";
import img1 from "../../assets/images/1.JPG";
import img2 from "../../assets/images/2.JPG";
import img3 from "../../assets/images/3.JPG";
import img4 from "../../assets/images/4.JPG";
import img5 from "../../assets/images/5.JPG";
import img6 from "../../assets/images/6.JPG";
import img7 from "../../assets/images/7.JPG";
import img8 from "../../assets/images/8.JPG";

const NAV_SECTIONS = ["home", "about", "gallery", "sponsors"];

const HERO_STATS = [
  { value: "5–12", label: "Ages" },
  { value: "$5", label: "Per Shirt" },
  { value: "2 Days", label: "On Field" },
  { value: "03", label: "Season" },
];

const STORY_PILLARS = [
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

const COACHES = [
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

const GALLERY = [
  { src: img1, span: "col-span-2 row-span-2", caption: "On the field" },
  { src: img2, span: "col-span-1 row-span-1", caption: "Huddle up" },
  { src: img3, span: "col-span-1 row-span-1", caption: "Game ready" },
  { src: img4, span: "col-span-1 row-span-2", caption: "Coaches" },
  { src: img5, span: "col-span-2 row-span-1", caption: "Camp day" },
  { src: img6, span: "col-span-1 row-span-1", caption: "First downs" },
  { src: img7, span: "col-span-1 row-span-1", caption: "All hands" },
  { src: img8, span: "col-span-2 row-span-1", caption: "Together" },
];

const SPONSOR_IMAGES = [
  "/sponsors/IMG_2678.JPEG",
  "/sponsors/IMG_2685.JPEG",
  "/sponsors/IMG_2686.JPEG",
];

const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const JerseyNumber = ({ children, className = "" }) => (
  <span
    className={`heading-stencil inline-flex h-12 w-12 items-center justify-center rounded-ds-md bg-ds-accent text-[1.5rem] text-white shadow-[0_8px_24px_-12px_rgba(191,10,48,0.7)] ring-1 ring-white/20 ${className}`}
  >
    {children}
  </span>
);

function HomePage() {
  return (
    <div className="min-h-screen bg-ds-bg text-ds-text">
      <Navbar transparent sections={NAV_SECTIONS} onSectionSelect={scrollToSection} />

      {/* Hero — varsity treatment over the field photo */}
      <section id="home" className="relative min-h-[100svh] overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <img src={img1} alt="" aria-hidden="true" className="h-full w-full animate-subtle-zoom object-cover" />
          <div className="absolute inset-0 bg-slate-950/60" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/85 via-slate-950/70 to-primary-800/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/45 to-transparent" />
          <div aria-hidden="true" className="field-grid absolute inset-0 opacity-40" />
        </div>
        <div aria-hidden="true" className="absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-accent-500/20 blur-[120px]" />
        <div aria-hidden="true" className="absolute -bottom-32 -left-24 h-[24rem] w-[24rem] rounded-full bg-primary-500/15 blur-[120px]" />
        <div aria-hidden="true" className="sideline-stripes absolute inset-x-0 top-0 h-1.5 opacity-90" />

        <div className="relative z-10 flex min-h-[100svh] items-center">
          <Container size="xl" className="py-32">
            <div className="max-w-3xl animate-fade-in-up">
              <div className="mb-7 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-ds-full border border-white/15 bg-white/10 px-3.5 py-1.5 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
                  </span>
                  <Calendar className="h-3 w-3 text-accent-300" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/90">
                    Season 03 · July 2026
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-ds-full border border-white/10 bg-white/[0.06] px-3 py-1.5 backdrop-blur-sm">
                  <MapPin className="h-3 w-3 text-white/70" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/75">
                    Daisetta, TX
                  </span>
                </span>
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
                Two days of fundamentals, teamwork, and fun for kids ages 5–12.
                Every camper gets a shirt, drinks, and snacks — because in our
                community, every kid plays.
              </Text>

              <div className="mb-12 flex flex-wrap gap-3 sm:gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  className="font-bold uppercase tracking-[0.06em]"
                  onClick={() => scrollToSection("register")}
                >
                  Sign Up Your Camper <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => scrollToSection("about")}
                  className="border-white/25 bg-white/10 font-semibold uppercase tracking-[0.04em] text-white backdrop-blur-sm hover:border-white/40 hover:text-white"
                >
                  Meet the Coaches
                </Button>
              </div>

              {/* Scoreboard stat strip */}
              <dl className="relative grid max-w-2xl grid-cols-2 overflow-hidden rounded-ds-xl border border-white/12 bg-slate-950/55 backdrop-blur-md sm:grid-cols-4">
                <span aria-hidden="true" className="sideline-stripes absolute inset-x-0 top-0 h-1 opacity-80" />
                {HERO_STATS.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`px-5 py-5 ${index > 0 ? "border-t border-white/10 sm:border-l sm:border-t-0" : ""}`}
                  >
                    <dt className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
                      {stat.label}
                    </dt>
                    <dd className="heading-stencil ds-tabular text-3xl text-white sm:text-4xl">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Container>
        </div>

        <button
          onClick={() => scrollToSection("about")}
          aria-label="Scroll to about section"
          className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 animate-float text-white/50 transition-colors hover:text-white"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </section>

      {/* About */}
      <Section id="about" space="xl" className="bg-ds-bg">
        <Container size="xl">
          {/* Mission line */}
          <Reveal className="mb-16 lg:mb-24">
            <SectionIntro
              eyebrow="Our Mission"
              title={
                <>
                  Built for our <span className="text-ds-accent-bright">community.</span>
                </>
              }
            >
              SETX Youth Football Camp was built to give every kid in Daisetta
              and Southeast Texas a shot at the field. Two days of fundamentals,
              fun, and confidence — no pay-to-play.
            </SectionIntro>
          </Reveal>

          {/* Story + photo */}
          <div className="mb-24 grid items-center gap-12 lg:mb-32 lg:grid-cols-2 lg:gap-16">
            <Reveal variant="left" className="relative">
              <Card variant="outline" padding="none" className="relative overflow-hidden">
                <span aria-hidden="true" className="sideline-stripes absolute inset-x-0 top-0 z-10 h-1.5 opacity-90" />
                <img src={img1} alt="Coaches and campers on the field" className="h-[460px] w-full object-cover" />
              </Card>
              <Card variant="elevated" className="absolute -bottom-7 -right-6 hidden items-center gap-4 sm:flex">
                <JerseyNumber>03</JerseyNumber>
                <div>
                  <div className="heading-stencil text-2xl leading-none text-ds-text">Season 03</div>
                  <Eyebrow className="mt-1.5">Strong &amp; Growing</Eyebrow>
                </div>
              </Card>
            </Reveal>

            <Reveal variant="right" delay={2}>
              <div className="mb-5 inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.24em] text-ds-accent-bright">
                <span aria-hidden="true" className="sideline-stripes inline-block h-1 w-10 rounded-sm" />
                The Story
              </div>
              <h2 className="heading-stencil heading-stencil-tight mb-6 text-4xl text-ds-text sm:text-5xl">
                Started by neighbors. <br />
                <span className="text-ds-accent-bright">Run for neighbors.</span>
              </h2>
              <div className="space-y-4">
                <Text tone="muted" size="lg">
                  Growing up in Daisetta, we didn't have many youth sports
                  options — so we built one. SETXYFC is a community-first,
                  majority-free football camp offering two half-days of
                  fundamentals, fun, and confidence-building instruction.
                </Text>
                <Text tone="muted" size="lg">
                  Drinks, snacks, and a camp shirt for every participant —
                  registered or not — because inclusion matters more than
                  optics. Now in our third year, the camp keeps growing, and
                  we're proud of what this community has built together.
                </Text>
              </div>

              <Grid cols={2} gap={3} className="mt-8">
                {STORY_PILLARS.map((item, index) => (
                  <Reveal key={item.title} variant="up" delay={index + 1}>
                    <Card variant="surface" padding="md" interactive className="h-full">
                      <div className="mb-2.5 flex items-center gap-2.5">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-ds-md bg-ds-accent-soft text-ds-accent-bright">
                          <item.icon className="h-4 w-4" />
                        </span>
                        <Text size="sm" weight="semibold">
                          {item.title}
                        </Text>
                      </div>
                      <Text size="xs" tone="muted">
                        {item.body}
                      </Text>
                    </Card>
                  </Reveal>
                ))}
              </Grid>
            </Reveal>
          </div>

          {/* Coaches */}
          <Reveal className="mb-16">
            <SectionIntro
              badge={
                <>
                  <ShieldCheck className="h-3.5 w-3.5" /> Background Checked
                </>
              }
              title="Meet the Coaches"
            >
              Every coach has cleared a background check and brings real
              coaching and playing experience to the field.
            </SectionIntro>
          </Reveal>

          <Grid cols={2} gap={6} className="mb-16">
            {COACHES.map((coach, index) => (
              <Reveal key={coach.name} variant="scale" delay={index + 1}>
                <Card variant="surface" padding="lg" interactive className="relative h-full overflow-hidden">
                  <span aria-hidden="true" className="sideline-stripes absolute inset-x-0 top-0 h-1 opacity-70" />
                  <div className="mb-6 flex items-start gap-4">
                    <JerseyNumber className="h-14 w-14 text-[1.75rem]">{coach.number}</JerseyNumber>
                    <div className="min-w-0 flex-1">
                      <Eyebrow strong className="text-ds-accent-bright">
                        {coach.role}
                      </Eyebrow>
                      <h3 className="heading-stencil mt-1.5 text-3xl text-ds-text">{coach.name}</h3>
                    </div>
                    <coach.icon className="h-5 w-5 shrink-0 text-ds-text-faint" />
                  </div>
                  <ul className="mb-6 space-y-2.5">
                    {coach.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ds-accent" />
                        <Text size="sm" tone="muted">
                          {point}
                        </Text>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 rounded-ds-md bg-ds-surface-2 p-3.5">
                    <Star className="h-3.5 w-3.5 text-ds-accent-bright" />
                    <Eyebrow strong>{coach.highlight}</Eyebrow>
                  </div>
                </Card>
              </Reveal>
            ))}
          </Grid>

          {/* What Sets Us Apart pillar */}
          <Reveal variant="scale" className="scoreboard-grain relative overflow-hidden rounded-ds-2xl bg-slate-950 p-10 text-center md:p-16">
            <span aria-hidden="true" className="sideline-stripes absolute inset-x-0 top-0 h-1.5 opacity-90" />
            <span aria-hidden="true" className="sideline-stripes absolute inset-x-0 bottom-0 h-1.5 opacity-90" />
            <div aria-hidden="true" className="field-grid absolute inset-0 opacity-30" />
            <div aria-hidden="true" className="absolute -right-20 -top-32 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl" />
            <div aria-hidden="true" className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
            <div className="relative">
              <span className="mb-5 inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.24em] text-accent-300">
                <span aria-hidden="true" className="sideline-stripes inline-block h-1 w-10 rounded-sm" />
                What Sets Us Apart
                <span aria-hidden="true" className="sideline-stripes inline-block h-1 w-10 rounded-sm" />
              </span>
              <h3 className="heading-stencil heading-stencil-tight mb-6 text-3xl text-white md:text-5xl lg:text-6xl">
                Camps don&apos;t usually look like this.
              </h3>
              <p className="mx-auto mb-8 max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
                What truly sets SETXYFC apart is the presence of{" "}
                <span className="font-semibold text-white">
                  outside professional and high-level athletes
                </span>{" "}
                who attend as guest coaches and speakers — giving campers
                exposure to real-world experience, motivation, and insight most
                camps simply cannot offer.
              </p>
              <div className="mx-auto max-w-2xl rounded-ds-xl border border-white/15 bg-white/[0.04] p-7 backdrop-blur-sm sm:p-8">
                <Sparkles className="mx-auto mb-3 h-5 w-5 text-accent-300" />
                <p className="heading-stencil text-2xl leading-tight text-white sm:text-3xl">
                  We are more than a camp. We are mentors, leaders, and
                  advocates — here for your kids on and off the field.
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Gallery */}
      <Section id="gallery" space="xl" className="border-t border-ds-border bg-ds-bg-elevated">
        <Container size="xl">
          <Reveal className="mb-14">
            <SectionIntro eyebrow="Camp Memories" title="From the Sideline">
              Snapshots from past seasons — the energy, the learning, and the
              friendships that keep this camp going.
            </SectionIntro>
          </Reveal>

          <div className="grid auto-rows-[140px] grid-cols-4 gap-3 sm:auto-rows-[180px] sm:gap-4 lg:auto-rows-[200px]">
            {GALLERY.map((item, index) => (
              <Reveal key={item.src} variant="scale" delay={index + 1} className={item.span}>
                <Card variant="outline" padding="none" className="group relative h-full w-full overflow-hidden">
                  <img
                    src={item.src}
                    alt={`Camp moment — ${item.caption}`}
                    className="h-full w-full object-cover transition-transform duration-700 ease-ds-out group-hover:scale-[1.06]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="pointer-events-none absolute bottom-2 left-2.5 inline-flex items-center gap-1.5 rounded-ds-full bg-slate-950/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/85 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                    <span className="inline-block h-0.5 w-2.5 bg-accent-400" />
                    {item.caption}
                  </span>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Sponsors */}
      <Section id="sponsors" space="xl" className="bg-ds-bg">
        <Container size="xl">
          <Reveal className="mb-16">
            <SectionIntro
              badge={
                <>
                  <Handshake className="h-3.5 w-3.5" /> Our Partners
                </>
              }
              title="Thank you to our sponsors."
            >
              We're grateful for the local businesses and families whose
              generosity keeps the camp free for kids who need it.
            </SectionIntro>
          </Reveal>

          <Grid cols={3} gap={6}>
            {SPONSOR_IMAGES.map((sponsorImage, index) => (
              <Reveal key={sponsorImage} variant="scale" delay={index + 1}>
                <Card variant="outline" padding="none" className="group relative overflow-hidden">
                  <span aria-hidden="true" className="sideline-stripes absolute inset-x-0 top-0 z-10 h-1 opacity-80" />
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={sponsorImage}
                      alt={`Sponsor ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-700 ease-ds-out group-hover:scale-[1.04]"
                    />
                  </div>
                </Card>
              </Reveal>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Registration */}
      <Section id="register" space="xl" className="relative overflow-hidden border-t border-ds-border bg-ds-bg-elevated">
        <div aria-hidden="true" className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-ds-accent-soft blur-[120px]" />
        <div aria-hidden="true" className="absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-primary-500/10 blur-[120px]" />
        <Container size="md" className="relative">
          <Reveal className="mb-12">
            <SectionIntro
              badge={
                <>
                  <Shirt className="h-3.5 w-3.5" /> Sign Up · ${SHIRT_PRICE} per shirt
                </>
              }
              title="Sign your camper up."
            >
              Fill out the form, choose your shirts, and you're on the roster.
              Payment is collected after — no payment needed now.
            </SectionIntro>
          </Reveal>
          <Reveal delay={2}>
            <RegistrationForm />
          </Reveal>
        </Container>
      </Section>

      <Footer onSectionSelect={scrollToSection} />
    </div>
  );
}

export default HomePage;
