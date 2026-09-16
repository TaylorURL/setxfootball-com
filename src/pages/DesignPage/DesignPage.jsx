// The look-book: the palette, the three faces, the icon set, the gear, and
// the rules behind them. Palette and type on ice, gear on navy, principles
// on ice.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import MarketingPage from "../../components/layout/MarketingPage";
import Reveal from "../../components/marketing/Reveal";
import SectionIntro from "../../components/marketing/SectionIntro";
import JoinCallout from "../../components/marketing/sections/JoinCallout";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";
import Breadcrumbs from "../../components/seo/Breadcrumbs";
import { REGISTER_PATH } from "../../components/layout/navLinks";
import { actionClass } from "../../components/ui/actionClass";
import CampIcon, { ICONS } from "../../components/ui/CampIcon";

const BRAND_COLORS = [
  {
    name: "White",
    token: "--ds-bg-elevated",
    role: "The ground. Every card, the bar, and the field lines.",
    ink: "text-ds-text",
  },
  {
    name: "Ice",
    token: "--ds-bg",
    role: "The page behind the cards, a step off white so the cards read as cards.",
    ink: "text-ds-text",
  },
  {
    name: "Navy",
    token: "--ds-text",
    role: "The voice. Headlines, rules, the scoreboard, the footer, and every icon's outline.",
    ink: "text-ds-bg",
  },
  {
    name: "Red",
    token: "--ds-accent",
    role: "The action. Every sign-up button, every price, and the ticket at the end of the page.",
    ink: "text-ds-on-accent",
  },
];

/** Turns a computed `rgb(...)` into the hex a reader expects to copy. */
const toHex = (value) => {
  const channels = value.match(/\d+/g);
  if (!channels || channels.length < 3) return value;
  const pair = (channel) => Number(channel).toString(16).padStart(2, "0");
  return `#${channels.slice(0, 3).map(pair).join("")}`.toUpperCase();
};

const TYPE_SAMPLES = [
  {
    family: "Archivo Black",
    role: "Display and headings",
    sample: "Every kid plays.",
    className: "display text-3xl sm:text-4xl",
  },
  {
    family: "Archivo",
    role: "Body and UI",
    sample:
      "Two days of fundamentals, teamwork, and fun for kids ages 5 to 12. Every camper gets a shirt, drinks, and snacks.",
    className: "body-copy text-base",
  },
  {
    family: "Oswald",
    role: "Numbers and scoreboards",
    sample: "AGES 5 to 12 · $5 · 2 DAYS",
    className: "numeral text-4xl text-ds-accent",
  },
];

const GEAR_TILES = [
  {
    icon: "jersey",
    title: "The Camp Tee",
    subtitle: "Red on white",
    body: "Every camper gets one, yours to keep, registered or walk-on. Block lettering across the chest, season number tagged at the sleeve.",
  },
  {
    icon: "goalpost",
    title: "Field Banners",
    subtitle: "White yard lines",
    body: "Sponsor banners line the field between the yard markers. Clean, varsity, no clutter.",
  },
  {
    icon: "referee-whistle",
    title: "Coach Whistles",
    subtitle: "Background-checked staff",
    body: "Issued only to coaches who have cleared a background check and arrived with coaching experience.",
  },
];

const DESIGN_PRINCIPLES = [
  {
    icon: "stadium",
    title: "Community First",
    body: "Every design choice asks the same question: does it keep the camp open to every kid in Southeast Texas?",
  },
  {
    icon: "american-football",
    title: "One Ink, One Set",
    body: "Every icon carries the same navy outline as the type around it, so a mark and the page it sits on read as one piece.",
  },
  {
    icon: "field",
    title: "Red, White and Blue",
    body: "The page breathes by moving between white sections and navy sections, with red for the action on both.",
  },
];

const ColorSwatch = ({ name, token, role, ink }) => {
  const swatchRef = useRef(null);
  const [hex, setHex] = useState("");

  useEffect(() => {
    const node = swatchRef.current;
    if (!node) return;
    setHex(toHex(getComputedStyle(node).backgroundColor));
  }, [token]);

  return (
    <div className="card card-lift overflow-hidden">
      <div
        ref={swatchRef}
        className="flex h-40 items-end border-b-rule border-ds-border-strong p-5"
        style={{ backgroundColor: `var(${token})` }}
      >
        <div className={`flex flex-col gap-1 ${ink}`}>
          <span className="heading text-xl">{name}</span>
          <span className="mono-tag opacity-80">{hex || token}</span>
        </div>
      </div>
      <p className="body-copy p-4 text-sm text-ds-text-muted">{role}</p>
    </div>
  );
};

const TypeSample = ({ family, role, sample, className }) => (
  <div className="card card-lift p-7">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <span className="label-caps text-ds-accent-bright">{family}</span>
      <span className="mono-tag text-ds-text-faint">{role}</span>
    </div>
    <p className={`${className} text-ds-text`}>{sample}</p>
  </div>
);

const GearTile = ({ icon, title, subtitle, body }) => (
  <div data-surface="paper" className="card h-full p-7 text-ds-text">
    <CampIcon name={icon} size={56} />
    <h3 className="display mt-5 text-2xl text-ds-text">{title}</h3>
    <p className="label-caps mt-1.5 text-ds-accent-bright">{subtitle}</p>
    <p className="body-copy mt-3 text-[15px] text-ds-text-muted">{body}</p>
  </div>
);

const PrincipleRow = ({ icon, title, body }) => (
  <div className="card card-lift h-full p-7">
    <CampIcon name={icon} size={48} />
    <h3 className="display mt-5 text-2xl text-ds-text">{title}</h3>
    <p className="body-copy mt-2 text-[15px] text-ds-text-muted">{body}</p>
  </div>
);

const Section = ({ surface, recessed, children }) => (
  <section
    data-surface={surface}
    data-deferred=""
    className={`${recessed ? "bg-ds-bg-recessed" : "bg-ds-bg"} py-16 sm:py-20 lg:py-24`}
  >
    <div className="mx-auto w-full max-w-[1160px] px-6 sm:px-10 lg:px-16">{children}</div>
  </section>
);

const DesignPage = () => (
  <MarketingPage>
    <Seo {...PAGE_SEO.design} />
    <Breadcrumbs label="Design" to="/design" />

    <section data-surface="navy" className="relative overflow-hidden bg-ds-bg py-20 sm:py-24">
      <div className="relative mx-auto flex w-full max-w-[1160px] flex-col gap-10 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <Reveal>
          <SectionIntro
            as="h1"
            eyebrow="The SETX Look-Book"
            title="The look of the camp, play by play."
          >
            How the SETX Youth Football Camp is designed: white and navy, red for every action, and
            type that reads like a jersey number.
          </SectionIntro>
        </Reveal>
        <CampIcon name="helmet" size={96} className="shrink-0" />
      </div>
    </section>

    <Section>
      <Reveal className="mb-10">
        <SectionIntro eyebrow="The Palette" title="Red, white and blue.">
          Three colors, each with one job. The icon set shares the navy, so the marks and the page
          read as one.
        </SectionIntro>
      </Reveal>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {BRAND_COLORS.map((color, index) => (
          <Reveal key={color.name} variant="scale" delay={index + 1}>
            <ColorSwatch {...color} />
          </Reveal>
        ))}
      </div>
    </Section>

    <Section recessed>
      <Reveal className="mb-10">
        <SectionIntro eyebrow="The Voice" title="Heavy display. Plain spoken.">
          Headlines run in Archivo Black, body copy stays plain in Archivo, Oswald carries the
          numbers, and a mono tag stamps the small print.
        </SectionIntro>
      </Reveal>
      <div className="grid gap-6 lg:grid-cols-3">
        {TYPE_SAMPLES.map((sample, index) => (
          <Reveal key={`${sample.family}-${sample.role}`} variant="up" delay={index + 1}>
            <TypeSample {...sample} />
          </Reveal>
        ))}
      </div>
    </Section>

    <Section>
      <Reveal className="mb-10">
        <SectionIntro eyebrow="The Icon Set" title="Thirty marks, one outline.">
          Every icon is drawn flat with the same navy line and sits transparent on whatever is under
          it. Nothing on the site draws its own icon.
        </SectionIntro>
      </Reveal>
      <Reveal>
        <ul className="card grid grid-cols-3 gap-6 p-6 sm:grid-cols-5 sm:p-8 lg:grid-cols-10">
          {Object.keys(ICONS).map((name) => (
            <li key={name} className="flex flex-col items-center gap-2 text-center">
              <CampIcon name={name} size={48} />
              <span className="mono-tag text-ds-text-faint">{name}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>

    <Section surface="navy">
      <Reveal className="mb-10">
        <SectionIntro eyebrow="Camp Gear" title="What every camper takes home.">
          The camp tee, the field banners, and the coach whistle all come from the same palette, so
          the camp shows up as one piece.
        </SectionIntro>
      </Reveal>
      <div aria-hidden="true" className="yard-line mb-10" />
      <div className="grid gap-6 md:grid-cols-3">
        {GEAR_TILES.map((tile, index) => (
          <Reveal key={tile.title} variant="up" delay={index + 1}>
            <GearTile {...tile} />
          </Reveal>
        ))}
      </div>
    </Section>

    <Section>
      <Reveal className="mb-10">
        <SectionIntro eyebrow="Design Principles" title="Three rules we don't bend.">
          Every page on this site, every shirt the camp prints, and every banner on the field
          answers to the same three checks.
        </SectionIntro>
      </Reveal>
      <div className="grid gap-6 md:grid-cols-3">
        {DESIGN_PRINCIPLES.map((principle, index) => (
          <Reveal key={principle.title} variant="up" delay={index + 1}>
            <PrincipleRow {...principle} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12" delay={4}>
        <div className="flex flex-col items-center rounded-ds-xl border-rule border-ds-ink bg-ds-gold p-8 text-center text-ds-on-gold shadow-hard-xl sm:p-12">
          <CampIcon name="jersey" size={64} />
          <h3 className="display mt-4 text-3xl sm:text-5xl">Wear the camp.</h3>
          <p className="body-copy mx-auto mt-5 max-w-xl text-lg">
            The cleanest piece of camp design is a kid in a camp shirt running a route. Sign up to
            get yours.
          </p>
          <Link
            to={REGISTER_PATH}
            className={actionClass({ tone: "navy", size: "lg", className: "mt-7" })}
          >
            Sign Up Your Camper
          </Link>
        </div>
      </Reveal>
    </Section>

    <JoinCallout surface="navy" />
  </MarketingPage>
);

export default DesignPage;
