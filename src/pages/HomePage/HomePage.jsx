/**
 * HomePage — public landing surface for SETX Youth Football Camp.
 *
 * Editorial-athletic layout: a photo-forward hero, a scoreboard stat band, the
 * "every camper gets" promise, story + coaches, the "what sets us apart"
 * feature, a how-it-works playbook, the gallery, sponsors, and registration.
 * The hero and feature bands are intentional dark, image-forward brand
 * treatments (theme-independent over imagery); everything else is composed from
 * design-system primitives and semantic tokens so it tracks all three themes.
 */
import {
  Calendar,
  ArrowRight,
  ChevronDown,
  Star,
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
import VarsityNumber from "../../components/brand/VarsityNumber";
import RegistrationForm from "./RegistrationForm";
import { SHIRT_PRICE } from "../../utils/constants";
import {
  NAV_SECTIONS,
  HERO_IMAGE,
  STORY_IMAGE,
  HERO_STATS,
  CAMPER_PERKS,
  STORY_PILLARS,
  COACHES,
  PLAYBOOK,
  GALLERY,
  SPONSOR_IMAGES,
} from "./homeContent";

const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const ChipLabel = ({ children, className = "" }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-ds-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-sm ${className}`}>
    {children}
  </span>
);

function HomePage() {
  return (
    <div className="min-h-screen bg-ds-bg text-ds-text">
      <Navbar sections={NAV_SECTIONS} onSectionSelect={scrollToSection} />

      {/* Hero — varsity treatment over the field photo */}
      <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="" aria-hidden="true" className="h-full w-full animate-subtle-zoom object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/85 via-slate-950/75 to-primary-800/65" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/30" />
          <div aria-hidden="true" className="field-grid absolute inset-0 opacity-40" />
          <div aria-hidden="true" className="field-numbers absolute inset-x-0 bottom-0 h-40 opacity-60" />
        </div>
        <div aria-hidden="true" className="sideline-stripes absolute inset-x-0 bottom-0 h-1.5 opacity-90" />

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
              Two days of fundamentals, teamwork, and fun for kids ages 5–12.
              Every camper gets a shirt, drinks, and snacks — because in our
              community, every kid plays.
            </Text>

            <div className="flex flex-wrap gap-3 sm:gap-4">
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
          </div>
        </Container>

        <button
          onClick={() => scrollToSection("scoreboard")}
          aria-label="Scroll to camp facts"
          className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 animate-float text-white/50 transition-colors hover:text-white"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </section>

      {/* Scoreboard stat band */}
      <section id="scoreboard" className="scoreboard-grain relative overflow-hidden border-y border-ds-border bg-ds-bg-elevated">
        <Container size="xl" className="py-10 sm:py-12">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-ds-xl border border-ds-border bg-ds-border sm:grid-cols-4">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center bg-ds-bg-elevated px-5 py-7 text-center">
                <dd className="heading-stencil ds-tabular text-4xl text-ds-accent-bright sm:text-5xl">{stat.value}</dd>
                <dt className="mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-ds-text-muted">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* What every camper gets */}
      <Section space="xl" className="bg-ds-bg">
        <Container size="xl">
          <Reveal className="mb-14">
            <SectionIntro
              badge={<><Shirt className="h-3.5 w-3.5" /> The Deal</>}
              title="What every camper gets."
            >
              No hidden fees, no pay-to-play. Sign up for the shirts and the rest
              comes with showing up.
            </SectionIntro>
          </Reveal>
          <Grid cols={4} gap={5}>
            {CAMPER_PERKS.map((perk, index) => (
              <Reveal key={perk.title} variant="up" delay={index + 1}>
                <Card variant="surface" padding="lg" interactive className="h-full">
                  <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-ds-lg bg-ds-accent-soft text-ds-accent-bright">
                    <perk.icon className="h-5 w-5" />
                  </span>
                  <h3 className="heading-stencil text-xl text-ds-text">{perk.title}</h3>
                  <Text size="sm" tone="muted" className="mt-2">{perk.body}</Text>
                </Card>
              </Reveal>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* About — story + coaches */}
      <Section id="about" space="xl" className="border-t border-ds-border bg-ds-bg-elevated">
        <Container size="xl">
          <Reveal className="mb-16 lg:mb-24">
            <SectionIntro
              eyebrow="Our Mission"
              title={<>Built for our <span className="text-ds-accent-bright">community.</span></>}
            >
              SETX Youth Football Camp was built to give every kid in Daisetta
              and Southeast Texas a shot at the field. Two days of fundamentals,
              fun, and confidence — no pay-to-play.
            </SectionIntro>
          </Reveal>

          <div className="mb-24 grid items-center gap-12 lg:mb-32 lg:grid-cols-2 lg:gap-16">
            <Reveal variant="left" className="relative">
              <Card variant="outline" padding="none" className="relative overflow-hidden">
                <span aria-hidden="true" className="sideline-stripes absolute inset-x-0 top-0 z-10 h-1.5 opacity-90" />
                <img src={STORY_IMAGE} alt="Coaches and campers on the field" className="h-[460px] w-full object-cover" />
              </Card>
              <Card variant="elevated" className="absolute -bottom-7 -right-6 hidden items-center gap-4 sm:flex">
                <VarsityNumber>03</VarsityNumber>
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
                        <Text size="sm" weight="semibold">{item.title}</Text>
                      </div>
                      <Text size="xs" tone="muted">{item.body}</Text>
                    </Card>
                  </Reveal>
                ))}
              </Grid>
            </Reveal>
          </div>

          <Reveal className="mb-16">
            <SectionIntro
              badge={<><ShieldCheck className="h-3.5 w-3.5" /> Background Checked</>}
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
                    <VarsityNumber size="lg">{coach.number}</VarsityNumber>
                    <div className="min-w-0 flex-1">
                      <Eyebrow strong className="text-ds-accent-bright">{coach.role}</Eyebrow>
                      <h3 className="heading-stencil mt-1.5 text-3xl text-ds-text">{coach.name}</h3>
                    </div>
                    <coach.icon className="h-5 w-5 shrink-0 text-ds-text-faint" />
                  </div>
                  <ul className="mb-6 space-y-2.5">
                    {coach.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ds-accent" />
                        <Text size="sm" tone="muted">{point}</Text>
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

          {/* What sets us apart */}
          <Reveal variant="scale" className="scoreboard-grain relative overflow-hidden rounded-ds-2xl bg-slate-950 p-10 text-center md:p-16">
            <span aria-hidden="true" className="sideline-stripes absolute inset-x-0 top-0 h-1.5 opacity-90" />
            <span aria-hidden="true" className="sideline-stripes absolute inset-x-0 bottom-0 h-1.5 opacity-90" />
            <div aria-hidden="true" className="field-grid absolute inset-0 opacity-30" />
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
                <span className="font-semibold text-white">outside professional and high-level athletes</span>{" "}
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

      {/* How it works — playbook */}
      <Section space="xl" className="bg-ds-bg">
        <Container size="xl">
          <Reveal className="mb-14">
            <SectionIntro eyebrow="The Playbook" title="How it works.">
              Three steps from the couch to the field. No payment due until after
              you've signed up.
            </SectionIntro>
          </Reveal>
          <Grid cols={3} gap={6}>
            {PLAYBOOK.map((play, index) => (
              <Reveal key={play.title} variant="up" delay={index + 1}>
                <Card variant="surface" padding="lg" className="relative h-full overflow-hidden">
                  <span aria-hidden="true" className="sideline-stripes absolute inset-x-0 top-0 h-1 opacity-70" />
                  <div className="mb-5 flex items-center justify-between">
                    <VarsityNumber>{String(index + 1).padStart(2, "0")}</VarsityNumber>
                    <play.icon className="h-6 w-6 text-ds-text-faint" />
                  </div>
                  <h3 className="heading-stencil text-2xl text-ds-text">{play.title}</h3>
                  <Text size="sm" tone="muted" className="mt-2">{play.body}</Text>
                </Card>
              </Reveal>
            ))}
          </Grid>
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
                    className="h-full w-full object-cover transition-transform duration-500 ease-ds-out group-hover:scale-[1.06]"
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
              badge={<><Handshake className="h-3.5 w-3.5" /> Our Partners</>}
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
                      className="h-full w-full object-cover transition-transform duration-500 ease-ds-out group-hover:scale-[1.04]"
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
              badge={<><Shirt className="h-3.5 w-3.5" /> Sign Up · ${SHIRT_PRICE} per shirt</>}
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
