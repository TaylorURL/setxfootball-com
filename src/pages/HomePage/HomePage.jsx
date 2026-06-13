/**
 * HomePage — public landing surface for SETX Football Camp.
 *
 * Sections: navigation, hero, story + coaches, gallery, sponsors, registration,
 * footer. The hero and feature bands use deliberate dark, image-forward brand
 * treatments; everything else is composed from design-system primitives that
 * follow the active theme.
 */
import { useEffect } from "react";
import {
  Calendar,
  ArrowRight,
  ChevronDown,
  Star,
  Heart,
  Users,
  ClipboardList,
  Trophy,
  ShieldCheck,
  Handshake,
  Shirt,
} from "lucide-react";
import {
  Container,
  Section,
  Grid,
  Card,
  Badge,
  Button,
  Heading,
  Text,
  Eyebrow,
} from "@bradley-t-t/sunday-design-system";
import Navbar from "../../components/nav/Navbar";
import Footer from "../../components/footer/Footer";
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
  { value: "2 Days", label: "Duration" },
  { value: "3rd", label: "Year" },
];

const STORY_HIGHLIGHTS = [
  { icon: Users, label: "Ages 5–12" },
  { icon: ClipboardList, label: "Two Day Camp" },
  { icon: Star, label: "All Levels" },
  { icon: Heart, label: "Community First" },
];

const COACHES = [
  {
    name: "Clayton Hanks",
    role: "Co-Founder",
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
    role: "Co-Founder",
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
  { src: img1, span: "col-span-2 row-span-2" },
  { src: img2, span: "col-span-1 row-span-1" },
  { src: img3, span: "col-span-1 row-span-1" },
  { src: img4, span: "col-span-1 row-span-2" },
  { src: img5, span: "col-span-2 row-span-1" },
  { src: img6, span: "col-span-1 row-span-1" },
  { src: img7, span: "col-span-1 row-span-1" },
  { src: img8, span: "col-span-2 row-span-1" },
];

const SPONSOR_IMAGES = [
  "/sponsors/IMG_2678.JPEG",
  "/sponsors/IMG_2685.JPEG",
  "/sponsors/IMG_2686.JPEG",
];

const REVEAL_DELAYS = [
  "delay-1",
  "delay-2",
  "delay-3",
  "delay-4",
  "delay-5",
  "delay-6",
  "delay-7",
  "delay-8",
];

const SectionEyebrow = ({ children }) => (
  <span className="mb-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ds-accent-bright">
    <span className="h-px w-8 bg-ds-accent" />
    {children}
    <span className="h-px w-8 bg-ds-accent" />
  </span>
);

const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

function HomePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    const elements = document.querySelectorAll(".scroll-animate");
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-ds-bg text-ds-text">
      <Navbar transparent sections={NAV_SECTIONS} onSectionSelect={scrollToSection} />

      {/* Hero */}
      <section id="home" className="relative min-h-[100svh] overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <img src={img1} alt="" aria-hidden="true" className="h-full w-full animate-subtle-zoom object-cover" />
          <div className="absolute inset-0 bg-slate-950/55" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/85 via-slate-950/75 to-primary-800/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/35 to-transparent" />
        </div>
        <div className="absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-accent-500/15 blur-[120px]" />
        <div className="absolute -bottom-24 -left-24 h-[24rem] w-[24rem] rounded-full bg-primary-400/15 blur-[120px]" />

        <div className="relative z-10 flex min-h-[100svh] items-center">
          <Container size="xl" className="py-32">
            <div className="max-w-3xl animate-fade-in-up">
              <span className="mb-8 inline-flex items-center gap-2 rounded-ds-full border border-white/15 bg-white/10 px-3.5 py-1.5 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
                </span>
                <Calendar className="h-3 w-3 text-accent-300" />
                <span className="text-xs font-semibold tracking-wide text-white/90">July 2026 · Daisetta, TX</span>
              </span>

              <Heading
                as="h1"
                level="display"
                className="mb-6 text-[2.75rem] font-black leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl lg:text-[5.5rem]"
              >
                Where Future
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-accent-400">Champions</span>
                  <span aria-hidden="true" className="absolute inset-x-0 bottom-1 -z-0 h-3 -skew-x-6 rounded bg-accent-500/20" />
                </span>
                <br />
                Are Made
              </Heading>

              <Text size="lg" className="mb-10 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">
                Two days of skill building, teamwork, and fun for ages 5–12. Every kid gets a camp shirt, drinks,
                and snacks — because inclusion matters.
              </Text>

              <div className="mb-16 flex flex-wrap gap-3 sm:gap-4">
                <Button variant="primary" size="lg" onClick={() => scrollToSection("register")}>
                  Register Your Camper <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => scrollToSection("about")}
                  className="border-white/20 bg-white/10 text-white backdrop-blur-sm hover:border-white/30 hover:text-white"
                >
                  Learn More
                </Button>
              </div>

              <dl className="grid max-w-2xl grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-8 sm:grid-cols-4">
                {HERO_STATS.map((stat) => (
                  <div key={stat.label}>
                    <dt className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">{stat.label}</dt>
                    <dd className="text-2xl font-black tracking-tight text-white sm:text-3xl">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Container>
        </div>

        <button
          onClick={() => scrollToSection("about")}
          aria-label="Scroll to about section"
          className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 animate-float text-white/40 transition-colors hover:text-white"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </section>

      {/* About */}
      <Section id="about" space="xl" className="bg-ds-bg">
        <Container size="xl">
          <div className="mb-24 grid items-center gap-12 lg:mb-32 lg:grid-cols-2 lg:gap-16">
            <div className="scroll-animate from-left relative">
              <Card variant="outline" padding="none" className="overflow-hidden">
                <img src={img1} alt="Coaches and campers on the field" className="h-[460px] w-full object-cover" />
              </Card>
              <Card variant="elevated" className="absolute -bottom-6 -right-6 hidden items-center gap-4 sm:flex">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-ds-md bg-ds-accent text-ds-on-accent">
                  <Star className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-xl font-black leading-none text-ds-text">3rd Year</div>
                  <Eyebrow className="mt-1">Strong &amp; Growing</Eyebrow>
                </div>
              </Card>
            </div>

            <div className="scroll-animate from-right delay-2">
              <SectionEyebrow>Our Story</SectionEyebrow>
              <Heading level="display" className="mb-6">
                Built for our <span className="text-ds-accent-bright">community.</span>
              </Heading>
              <div className="space-y-4">
                <Text tone="muted" size="lg">
                  SETX Youth Football Camp was built to give kids in our community opportunities we didn't always
                  have growing up in Daisetta, Texas. With limited youth sports available, we chose to create
                  something better.
                </Text>
                <Text tone="muted" size="lg">
                  SETXYFC is a community-first, majority-free football camp offering two half-days of fundamentals,
                  fun, and confidence-building instruction. We provide drinks, snacks, and a camp shirt for every
                  participant — registered or not — because inclusion matters.
                </Text>
                <Text tone="faint" size="sm">
                  Now in our third year, the camp keeps growing — and we're excited to see what this season brings
                  for our kids and our community.
                </Text>
              </div>

              <Grid cols={2} gap={3} className="mt-8">
                {STORY_HIGHLIGHTS.map((item) => (
                  <Card key={item.label} variant="outline" padding="sm" className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-ds-md bg-ds-accent-soft text-ds-accent-bright">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <Text size="sm" weight="semibold">
                      {item.label}
                    </Text>
                  </Card>
                ))}
              </Grid>
            </div>
          </div>

          <div className="scroll-animate mb-16 text-center">
            <Badge tone="accent" variant="soft" size="lg" className="mb-5">
              <ShieldCheck className="h-3.5 w-3.5" /> Background Checked
            </Badge>
            <Heading level="display" className="mb-4">
              Meet the Coaches
            </Heading>
            <Text tone="muted" size="lg" className="mx-auto max-w-2xl">
              Every coach has completed a background check and brings real coaching and playing experience.
            </Text>
          </div>

          <Grid cols={2} gap={6} className="mb-12">
            {COACHES.map((coach, index) => (
              <Card
                key={coach.name}
                variant="surface"
                padding="lg"
                interactive
                className={`scroll-animate scale-in ${index === 0 ? "delay-1" : "delay-2"}`}
              >
                <div className="mb-6 flex items-center gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-ds-lg bg-ds-accent-soft text-ds-accent-bright">
                    <coach.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <Eyebrow strong>{coach.role}</Eyebrow>
                    <Heading level={2} className="mt-0.5">
                      {coach.name}
                    </Heading>
                  </div>
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
            ))}
          </Grid>

          <div className="scroll-animate scale-in relative overflow-hidden rounded-ds-2xl bg-slate-950 p-10 text-center md:p-16">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-400/60 to-transparent" />
            <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full bg-primary-500/15 blur-3xl" />
            <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-accent-500/15 blur-3xl" />
            <div className="relative">
              <span className="mb-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent-300">
                <span className="h-px w-8 bg-accent-300/60" /> What Sets Us Apart <span className="h-px w-8 bg-accent-300/60" />
              </span>
              <h3 className="mb-6 text-2xl font-black tracking-[-0.02em] text-white md:text-3xl lg:text-4xl">
                Camps don't usually look like this.
              </h3>
              <p className="mx-auto mb-8 max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
                What truly sets SETXYFC apart is the presence of{" "}
                <span className="font-semibold text-white">outside professional and high-level athletes</span> who
                attend as guest coaches and speakers — giving campers exposure to real-world experience,
                motivation, and insight most camps simply cannot offer.
              </p>
              <div className="mx-auto max-w-2xl rounded-ds-xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm sm:p-8">
                <p className="text-lg font-bold leading-relaxed text-white sm:text-xl">
                  We are more than a camp — we are mentors, leaders, and advocates, here for your kids on and off
                  the field.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Gallery */}
      <Section id="gallery" space="xl" className="border-t border-ds-border bg-ds-bg-elevated">
        <Container size="xl">
          <div className="scroll-animate mb-14 text-center">
            <SectionEyebrow>Memories</SectionEyebrow>
            <Heading level="display" className="mb-4">
              Camp Gallery
            </Heading>
            <Text tone="muted" size="lg" className="mx-auto max-w-lg">
              Highlights from past camps — the energy, the learning, the fun.
            </Text>
          </div>

          <div className="grid auto-rows-[140px] grid-cols-4 gap-3 sm:auto-rows-[180px] sm:gap-4 lg:auto-rows-[200px]">
            {GALLERY.map((item, index) => (
              <Card
                key={item.src}
                variant="outline"
                padding="none"
                className={`scroll-animate scale-in ${REVEAL_DELAYS[index]} ${item.span} group overflow-hidden`}
              >
                <img
                  src={item.src}
                  alt={`Camp moment ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-700 ease-ds-out group-hover:scale-[1.06]"
                />
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Sponsors */}
      <Section id="sponsors" space="xl" className="bg-ds-bg">
        <Container size="xl">
          <div className="scroll-animate mb-16 text-center">
            <Badge tone="accent" variant="soft" size="lg" className="mb-4">
              <Handshake className="h-3.5 w-3.5" /> Our Partners
            </Badge>
            <Heading level="display" className="mb-4">
              Thank you to our sponsors
            </Heading>
            <Text tone="muted" size="lg" className="mx-auto max-w-lg">
              We're grateful for the generous support that makes this camp possible for our community.
            </Text>
          </div>

          <Grid cols={3} gap={6}>
            {SPONSOR_IMAGES.map((sponsorImage, index) => (
              <Card
                key={sponsorImage}
                variant="outline"
                padding="none"
                className={`scroll-animate scale-in ${REVEAL_DELAYS[index]} group overflow-hidden`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={sponsorImage}
                    alt={`Sponsor ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-700 ease-ds-out group-hover:scale-[1.04]"
                  />
                </div>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Registration */}
      <Section id="register" space="xl" className="border-t border-ds-border bg-ds-bg-elevated">
        <Container size="md">
          <div className="scroll-animate mb-12 text-center">
            <Badge tone="accent" variant="soft" size="lg" className="mb-4">
              <Shirt className="h-3.5 w-3.5" /> Limited Spots
            </Badge>
            <Heading level="display" className="mb-3">
              Register for camp
            </Heading>
            <Text tone="muted" size="lg">
              Sign up today — shirts are <span className="font-bold text-ds-text">${SHIRT_PRICE} each</span>
            </Text>
          </div>
          <div className="scroll-animate delay-2">
            <RegistrationForm />
          </div>
        </Container>
      </Section>

      <Footer onSectionSelect={scrollToSection} />
    </div>
  );
}

export default HomePage;
