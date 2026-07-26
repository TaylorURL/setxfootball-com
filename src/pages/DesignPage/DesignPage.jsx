// Each topic sits on the surface that flatters it: palette and principles on
// paper, type and gear on dark.
import { Link } from "react-router-dom";
import {
  Palette,
  Shirt,
  Type,
  Sparkles,
  ArrowRight,
  Flag,
  Award,
  Heart,
} from "lucide-react";
import {
  Container,
  Section,
  Card,
  Grid,
  Button,
  Text,
  Eyebrow,
  Badge,
} from "@bradley-t-t/sunday-design-system";
import MarketingPage from "../../components/layout/MarketingPage";
import Reveal from "../../components/marketing/Reveal";
import SectionIntro from "../../components/marketing/SectionIntro";
import JoinCallout from "../../components/marketing/sections/JoinCallout";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";
import { REGISTER_PATH } from "../../components/nav/navLinks";
import { Squares, TrueFocus } from "../../components/reactbits";

const BRAND_COLORS = [
  {
    name: "Camp Red",
    hex: "#E11D2A",
    role: "The only hue in the system — CTAs, badges, every trim line",
    swatch: "bg-[#E11D2A]",
    onLight: false,
  },
  {
    name: "Field Coal",
    hex: "#0A0A0A",
    role: "Near-black canvas for the cinematic dark register",
    swatch: "bg-[#0A0A0A]",
    onLight: false,
  },
  {
    name: "Stadium Slate",
    hex: "#525252",
    role: "Mid-gray for body copy, mute states, and hairline rules",
    swatch: "bg-[#525252]",
    onLight: false,
  },
  {
    name: "Sideline Bone",
    hex: "#F6F6F4",
    role: "Off-white paper for the light register and long-form reads",
    swatch: "bg-[#F6F6F4]",
    onLight: true,
  },
  {
    name: "Hairline White",
    hex: "#FFFFFF",
    role: "Pure white for cards on paper, text on accent, and edge highlights",
    swatch: "bg-[#FFFFFF]",
    onLight: true,
  },
];

const TYPE_SAMPLES = [
  {
    family: "Inter Tight",
    role: "Display & headings",
    sample: "Where future champions are made.",
    className: "editorial-display editorial-display-tight text-3xl sm:text-4xl",
  },
  {
    family: "Inter Tight",
    role: "Body & UI",
    sample:
      "Two days of fundamentals, teamwork, and fun for kids ages 5–12. Every camper gets a shirt, drinks, and snacks.",
    className: "editorial-body text-base leading-relaxed",
  },
  {
    family: "JetBrains Mono",
    role: "Stat band & jersey numbers",
    sample: "AGES 5–12 · $5 · 2 DAYS",
    className: "mono-tag-lg",
  },
];

const GEAR_TILES = [
  {
    icon: Shirt,
    title: "The Camp Tee",
    subtitle: "Camp red on coal",
    body: "Every camper gets one — yours to keep, registered or walk-on. Block lettering across the chest, season number tagged at the sleeve.",
  },
  {
    icon: Flag,
    title: "Field Banners",
    subtitle: "Yard-line accents",
    body: "Sponsor banners line the camp red yard rule that runs every section of the field — clean, varsity, no clutter.",
  },
  {
    icon: Award,
    title: "Coach Whistles",
    subtitle: "Background-checked staff",
    body: "Issued only to coaches who have cleared a check and arrived with real coaching experience — the camp's quietest piece of gear.",
  },
];

const DESIGN_PRINCIPLES = [
  {
    icon: Heart,
    title: "Community First",
    body: "Every design choice asks the same question: does it keep the camp open to every kid in Southeast Texas?",
  },
  {
    icon: Sparkles,
    title: "Monochrome With A Spark",
    body: "A full neutral ramp plus ONE deliberate red accent. Restraint is the loudest part of the system — the kids bring the color.",
  },
  {
    icon: Palette,
    title: "Light & Dark, One Rhythm",
    body: "The page breathes by alternating coal sections and paper sections, with the red staying the same on both surfaces.",
  },
];

const ColorSwatch = ({ name, hex, role, swatch, onLight }) => (
  <Card variant="outline" padding="none" className="card-lift group relative overflow-hidden">
    <span aria-hidden="true" className="accent-edge absolute inset-x-0 top-0 z-10 h-0.5" />
    <div className={`relative flex h-40 items-end p-5 ${swatch}`}>
      <div className={`flex flex-col gap-0.5 ${onLight ? "text-neutral-900" : "text-white"}`}>
        <span className="editorial-display text-2xl leading-none">{name}</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-80">
          {hex}
        </span>
      </div>
    </div>
    <div className="p-4">
      <Text size="xs" tone="muted">
        {role}
      </Text>
    </div>
  </Card>
);

const TypeSample = ({ family, role, sample, className }) => (
  <Card variant="elevated" padding="lg" className="card-lift relative overflow-hidden">
    <span aria-hidden="true" className="accent-edge absolute inset-y-0 left-0 w-0.5" />
    <div className="mb-4 flex items-center justify-between gap-3">
      <Eyebrow strong className="text-ds-accent-bright">
        {family}
      </Eyebrow>
      <Badge tone="neutral" variant="soft" size="sm" className="uppercase tracking-[0.16em]">
        {role}
      </Badge>
    </div>
    <p className={`${className} text-ds-text`}>{sample}</p>
  </Card>
);

const GearTile = ({ icon: Icon, title, subtitle, body }) => (
  <Card variant="surface" padding="lg" interactive className="card-lift h-full">
    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-ds-lg bg-ds-accent-soft text-ds-accent-bright">
      <Icon className="h-5 w-5" />
    </div>
    <Text size="sm" weight="bold" className="uppercase tracking-[0.08em] text-ds-text">
      {title}
    </Text>
    <Eyebrow className="mt-1">{subtitle}</Eyebrow>
    <Text tone="muted" size="sm" className="mt-3">
      {body}
    </Text>
  </Card>
);

const PrincipleRow = ({ icon: Icon, title, body }) => (
  <Card variant="outline" padding="lg" className="card-lift relative overflow-hidden">
    <span aria-hidden="true" className="accent-edge absolute inset-x-0 top-0 h-0.5" />
    <div className="flex items-start gap-4">
      <span className="brand-chip-shadow-sm inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-ds-md bg-ds-accent text-white ring-1 ring-white/15">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <Text size="sm" weight="bold" className="uppercase tracking-[0.1em] text-ds-text">
          {title}
        </Text>
        <Text tone="muted" size="sm" className="mt-2">
          {body}
        </Text>
      </div>
    </div>
  </Card>
);

const DesignPage = () => (
  <MarketingPage>
    <Seo {...PAGE_SEO.design} />

    <Section space="xl" className="relative overflow-hidden bg-ds-bg">
      <div aria-hidden="true" className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-ds-accent-soft blur-[140px]" />
      <div aria-hidden="true" className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-ds-surface-2 blur-[140px] opacity-60" />
      <Squares className="absolute inset-0 opacity-60" size={60} speed={0.22} lineColor="var(--ds-border)" />
      <Container size="xl" className="relative">
        <Reveal>
          <SectionIntro
            badge={
              <>
                <Palette className="h-3.5 w-3.5" /> The SETX Look-Book
              </>
            }
            title={
              <>
                The look of the camp,{" "}
                <span className="text-ds-accent-bright">play by play.</span>
              </>
            }
          >
            A peek under the helmet at how the SETX Youth Football Camp is
            designed — the monochrome palette, the editorial type, the gear, and
            the principles that keep the whole programme reading like one team.
          </SectionIntro>
        </Reveal>
      </Container>
    </Section>

    <Section data-surface="light" space="lg" className="surface-seam bg-ds-bg">
      <Container size="xl">
        <Reveal className="mb-10">
          <SectionIntro
            align="start"
            eyebrow="The Palette"
            title="One red. Five neutrals."
          >
            The camp ships exactly one hue — an athletic red — paired with a
            full neutral ramp from coal to bone. Nothing else. The discipline is
            the design.
          </SectionIntro>
        </Reveal>
        <Grid cols={3} gap={5}>
          {BRAND_COLORS.map((color, index) => (
            <Reveal key={color.name} variant="scale" delay={index + 1}>
              <ColorSwatch {...color} />
            </Reveal>
          ))}
        </Grid>
      </Container>
    </Section>

    <Section space="lg" className="surface-seam bg-ds-bg">
      <Container size="xl">
        <Reveal className="mb-10">
          <SectionIntro
            align="start"
            eyebrow="The Voice"
            title={
              <>
                Grotesque display. <span className="text-ds-accent-bright">Plain spoken.</span>
              </>
            }
          >
            Headlines run in a tight Inter Tight grotesque, body copy stays warm
            and plain, and the mono tag stamps the editorial microcopy.
          </SectionIntro>
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-3">
          {TYPE_SAMPLES.map((sample, index) => (
            <Reveal key={`${sample.family}-${sample.role}`} variant="up" delay={index + 1}>
              <TypeSample {...sample} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>

    {/* Camp gear — dark elevated */}
    <Section space="lg" className="surface-seam bg-ds-bg-elevated">
      <Container size="xl">
        <Reveal className="mb-10">
          <SectionIntro
            align="start"
            badge={
              <>
                <Shirt className="h-3.5 w-3.5" /> Camp Gear
              </>
            }
            title="What every camper takes home."
          >
            The on-field kit — the camp tee, the field banners and the coach
            whistle — all designed from the same palette so the camp shows up
            as one piece.
          </SectionIntro>
        </Reveal>
        <Grid cols={3} gap={5}>
          {GEAR_TILES.map((tile, index) => (
            <Reveal key={tile.title} variant="up" delay={index + 1}>
              <GearTile {...tile} />
            </Reveal>
          ))}
        </Grid>
      </Container>
    </Section>

    {/* Design principles — paper */}
    <Section
      data-surface="light"
      space="lg"
      className="surface-seam relative overflow-hidden bg-ds-bg"
    >
      <div aria-hidden="true" className="scoreboard-grain absolute inset-0 opacity-50" />
      <Container size="xl" className="relative">
        <Reveal className="mb-10">
          <SectionIntro
            align="start"
            eyebrow="Design Principles"
            title="Three rules we don't bend."
          >
            Every page on this site, every shirt the camp prints, every banner
            on the field — they all answer to the same three checks.
          </SectionIntro>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {DESIGN_PRINCIPLES.map((principle, index) => (
            <Reveal key={principle.title} variant="up" delay={index + 1}>
              <PrincipleRow {...principle} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12" delay={4}>
          <Card variant="elevated" padding="lg" className="card-lift relative overflow-hidden text-center">
            <span aria-hidden="true" className="accent-edge absolute inset-x-0 top-0 h-1" />
            <Type className="mx-auto mb-4 h-6 w-6 text-ds-accent-bright" />
            <h3 className="editorial-display editorial-display-tight mb-3 flex justify-center text-3xl text-ds-text sm:text-4xl">
              <TrueFocus sentence="Wear the camp." interval={1500} blur={4} />
            </h3>
            <Text tone="muted" size="lg" className="mx-auto mb-6 max-w-xl">
              The cleanest piece of camp design is a kid in a camp shirt running
              a route. Sign up to get yours.
            </Text>
            <Button asChild variant="primary" size="lg" className="press-down font-bold uppercase tracking-[0.08em]">
              <Link to={REGISTER_PATH}>
                Sign Up Your Camper <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Card>
        </Reveal>
      </Container>
    </Section>

    <JoinCallout />
  </MarketingPage>
);

export default DesignPage;
