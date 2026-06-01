/**
 * HomePage — Public landing surface for SETX Football Camp.
 *
 * Sections: navigation, hero, story + coaches, gallery, sponsors,
 * registration form, footer. Handles registration submit and routes
 * to the payment page on success.
 */
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RegistrationService from "../../services/RegistrationService";
import {
  SHIRT_SIZES,
  SHIRT_PRICE,
  EMERGENCY_RELATIONS,
} from "../../utils/constants";
import logo from "../../assets/logo.PNG";
import img1 from "../../assets/images/1.JPG";
import img2 from "../../assets/images/2.JPG";
import img3 from "../../assets/images/3.JPG";
import img4 from "../../assets/images/4.JPG";
import img5 from "../../assets/images/5.JPG";
import img6 from "../../assets/images/6.JPG";
import img7 from "../../assets/images/7.JPG";
import img8 from "../../assets/images/8.JPG";
import {
  FaFootballBall,
  FaUsers,
  FaClipboardList,
  FaTshirt,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaChevronDown,
  FaCheck,
  FaTimes,
  FaBars,
  FaStar,
  FaHeart,
  FaShieldAlt,
  FaDollarSign,
  FaSignOutAlt,
  FaUser,
  FaPlus,
  FaTrash,
  FaCalendarAlt,
  FaHandshake,
  FaArrowRight,
} from "react-icons/fa";

const NAV_SECTIONS = ["home", "about", "gallery", "sponsors"];

const HERO_STATS = [
  { value: "5–12", label: "Ages" },
  { value: "$5", label: "Per Shirt" },
  { value: "2 Days", label: "Duration" },
  { value: "3rd", label: "Year" },
];

const STORY_HIGHLIGHTS = [
  { icon: FaUsers, label: "Ages 5–12" },
  { icon: FaClipboardList, label: "Two Day Camp" },
  { icon: FaStar, label: "All Levels" },
  { icon: FaHeart, label: "Community First" },
];

const COACHES = [
  {
    name: "Clayton Hanks",
    role: "Co-Founder",
    color: "primary",
    icon: FaFootballBall,
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
    color: "accent",
    icon: FaHeart,
    highlight: "Dedicated Youth Development",
    points: [
      "Graduate of Hull-Daisetta High School",
      "Former lettering athlete with proven competitive experience",
      "Approximately five years of coaching experience",
    ],
  },
];

const GALLERY_IMAGES = [img1, img2, img3, img4, img5, img6, img7, img8];

const GALLERY_LAYOUT = [
  "col-span-2 row-span-2 h-full",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-2 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
];

const SPONSOR_IMAGES = [
  "/sponsors/IMG_2678.JPEG",
  "/sponsors/IMG_2685.JPEG",
  "/sponsors/IMG_2686.JPEG",
];

const COACH_STYLES = {
  primary: {
    iconBg: "bg-primary-500/10",
    iconColor: "text-primary-600",
    bullet: "bg-primary-500",
    accent: "text-primary-500",
    eyebrow: "text-primary-600",
    ring: "ring-primary-500/20",
  },
  accent: {
    iconBg: "bg-accent-500/10",
    iconColor: "text-accent-600",
    bullet: "bg-accent-500",
    accent: "text-accent-500",
    eyebrow: "text-accent-600",
    ring: "ring-accent-500/20",
  },
};

const SECTION_HEADER_INPUT_LABEL =
  "block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 mb-2";

const buildFormReset = () => ({
  kidName: "",
  age: "",
  nickname: "",
  shirts: [{ size: "", recipient: "", type: "camper", id: 1 }],
  parentName: "",
  parentPhone: "",
  parentEmail: "",
  emergencyName: "",
  emergencyPhone: "",
  emergencyRelation: "",
  cashappUsername: "",
});

function HomePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState(buildFormReset);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 32);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    const els = document.querySelectorAll(".scroll-animate");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const totalCost = formData.shirts.length * SHIRT_PRICE;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addShirt = () => {
    setFormData((prev) => ({
      ...prev,
      shirts: [
        ...prev.shirts,
        { size: "", recipient: "", type: "camper", id: Date.now() },
      ],
    }));
  };

  const removeShirt = (id) => {
    if (formData.shirts.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      shirts: prev.shirts.filter((s) => s.id !== id),
    }));
  };

  const updateShirt = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      shirts: prev.shirts.map((s) =>
        s.id === id ? { ...s, [field]: value } : s,
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.shirts.some((s) => !s.size)) {
      setSubmitResult({
        success: false,
        message: "Please select a size for every shirt.",
      });
      return;
    }

    setSubmitting(true);
    setSubmitResult(null);

    try {
      const sizes = formData.shirts
        .map((s) => {
          const name = s.recipient.trim() || formData.kidName;
          const tag = s.type === "family" ? "Family" : "Camper";
          return `${s.size} (${name} - ${tag})`;
        })
        .join(", ");
      const { data: registration, error } =
        await RegistrationService.createRegistration({
          ...formData,
          shirtSize: sizes,
          shirtQuantity: formData.shirts.length,
        });
      if (error) throw error;

      setFormData(buildFormReset());
      navigate("/payment", { state: { registration } });
    } catch (error) {
      setSubmitResult({
        success: false,
        message:
          "Registration failed. Please try again or contact us directly.",
      });
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <nav
        className={`fixed inset-x-0 top-0 z-50 ${scrolled ? "py-2" : "py-4"}`}
        style={{ transition: "padding 220ms cubic-bezier(0.23, 1, 0.32, 1)" }}
      >
        <div
          className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${
            scrolled
              ? "bg-white/90 backdrop-blur-xl shadow-[0_2px_24px_-12px_rgba(0,12,26,0.18)] border border-slate-200/60 rounded-2xl"
              : "border border-transparent"
          }`}
          style={{
            transition:
              "background-color 220ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 220ms cubic-bezier(0.23, 1, 0.32, 1), border-color 220ms cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        >
          <div className="flex items-center justify-between py-2">
            <button
              type="button"
              className="group flex items-center"
              onClick={() => scrollToSection("home")}
              aria-label="Go to home"
            >
              <img
                src={logo}
                alt=""
                className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="ml-3 hidden sm:block text-left">
                <span
                  className={`block text-[15px] font-bold tracking-tight ${
                    scrolled ? "text-slate-900" : "text-white"
                  }`}
                  style={{ transition: "color 200ms ease" }}
                >
                  SETX Football
                </span>
                <span
                  className={`block text-[10px] font-semibold uppercase tracking-[0.18em] ${
                    scrolled ? "text-slate-500" : "text-white/65"
                  }`}
                  style={{ transition: "color 200ms ease" }}
                >
                  Youth Camp · Daisetta
                </span>
              </div>
            </button>

            <div className="hidden md:flex items-center gap-1">
              {NAV_SECTIONS.map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium capitalize ${
                    scrolled
                      ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                  style={{
                    transition:
                      "color 180ms ease, background-color 180ms ease",
                  }}
                >
                  {section}
                </button>
              ))}
              <button
                onClick={() => scrollToSection("register")}
                className="btn-primary ml-3 inline-flex items-center gap-2 bg-accent-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-[0_6px_20px_-6px_rgba(191,10,48,0.6)] hover:bg-accent-600"
                style={{
                  transition:
                    "background-color 180ms ease, transform 140ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 220ms cubic-bezier(0.23, 1, 0.32, 1)",
                }}
              >
                Register Now
                <FaArrowRight className="text-[10px]" />
              </button>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`ml-1 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium ${
                      scrolled
                        ? "text-slate-600 hover:bg-slate-100"
                        : "text-white/80 hover:bg-white/10"
                    }`}
                    style={{
                      transition:
                        "color 180ms ease, background-color 180ms ease",
                    }}
                  >
                    <FaUser className="text-[11px]" /> Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium ${
                      scrolled
                        ? "text-slate-600 hover:bg-slate-100"
                        : "text-white/80 hover:bg-white/10"
                    }`}
                    style={{
                      transition:
                        "color 180ms ease, background-color 180ms ease",
                    }}
                  >
                    <FaSignOutAlt className="text-[11px]" /> Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className={`ml-1 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium ${
                    scrolled
                      ? "text-slate-600 hover:bg-slate-100"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                  style={{
                    transition:
                      "color 180ms ease, background-color 180ms ease",
                  }}
                >
                  <FaUser className="text-[11px]" /> Login
                </Link>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className={`md:hidden p-2 rounded-lg ${
                scrolled
                  ? "text-slate-700 hover:bg-slate-100"
                  : "text-white hover:bg-white/10"
              }`}
              style={{
                transition: "color 180ms ease, background-color 180ms ease",
              }}
            >
              {mobileMenuOpen ? (
                <FaTimes className="h-5 w-5" />
              ) : (
                <FaBars className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div
          className={`md:hidden mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 overflow-hidden ${
            mobileMenuOpen
              ? "max-h-[520px] opacity-100 mt-2"
              : "max-h-0 opacity-0 mt-0"
          }`}
          style={{
            transition:
              "max-height 320ms cubic-bezier(0.23, 1, 0.32, 1), opacity 220ms ease, margin-top 220ms ease",
          }}
        >
          <div className="rounded-2xl bg-white border border-slate-200 shadow-xl p-2 space-y-1">
            {NAV_SECTIONS.map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="block w-full text-left text-slate-700 hover:text-slate-900 hover:bg-slate-50 px-4 py-3 rounded-xl capitalize text-sm font-medium"
                style={{
                  transition: "color 180ms ease, background-color 180ms ease",
                }}
              >
                {section}
              </button>
            ))}
            <button
              onClick={() => scrollToSection("register")}
              className="block w-full bg-accent-500 hover:bg-accent-600 text-white px-4 py-3 rounded-xl font-semibold text-center text-sm shadow-[0_6px_18px_-6px_rgba(191,10,48,0.55)]"
              style={{ transition: "background-color 180ms ease" }}
            >
              Register Now
            </button>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 w-full text-slate-700 hover:bg-slate-50 px-4 py-3 rounded-xl text-sm font-medium"
                  style={{
                    transition: "color 180ms ease, background-color 180ms ease",
                  }}
                >
                  <FaUser className="text-[11px]" /> Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-slate-700 hover:bg-slate-50 px-4 py-3 rounded-xl text-sm font-medium"
                  style={{
                    transition: "color 180ms ease, background-color 180ms ease",
                  }}
                >
                  <FaSignOutAlt className="text-[11px]" /> Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 w-full text-slate-700 hover:bg-slate-50 px-4 py-3 rounded-xl text-sm font-medium"
                style={{
                  transition: "color 180ms ease, background-color 180ms ease",
                }}
              >
                <FaUser className="text-[11px]" /> Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <section
        id="home"
        className="relative min-h-[100svh] overflow-hidden bg-primary-900"
      >
        <div className="absolute inset-0">
          <img
            src={img1}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover animate-subtle-zoom"
          />
          <div className="absolute inset-0 bg-slate-950/55" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/85 via-slate-950/75 to-primary-800/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/35 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,40,104,0.55),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(191,10,48,0.25),transparent_60%)]" />
        </div>

        <div
          className="absolute inset-0 opacity-[0.04]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        <div className="absolute -top-24 -right-24 h-[28rem] w-[28rem] bg-accent-500/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -left-24 h-[24rem] w-[24rem] bg-primary-400/15 rounded-full blur-[120px]" />

        <div className="relative z-10 min-h-[100svh] flex items-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 w-full">
            <div className="max-w-3xl animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
                </span>
                <FaCalendarAlt className="text-accent-300 text-[11px]" />
                <span className="text-white/90 text-xs font-semibold tracking-wide">
                  July 2026 · Daisetta, TX
                </span>
              </div>

              <h1 className="text-[2.75rem] sm:text-6xl lg:text-[5.5rem] font-black text-white leading-[1.02] tracking-[-0.03em] mb-6">
                Where Future
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-accent-400">
                    Champions
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-1 h-3 bg-accent-500/20 -z-0 skew-x-[-6deg] rounded"
                  />
                </span>
                <br />
                Are Made
              </h1>

              <p className="text-lg sm:text-xl text-white/75 mb-10 leading-relaxed max-w-xl">
                Two days of skill building, teamwork, and fun for ages 5–12.
                Every kid gets a camp shirt, drinks, and snacks — because
                inclusion matters.
              </p>

              <div className="flex flex-wrap gap-3 sm:gap-4 mb-16">
                <button
                  onClick={() => scrollToSection("register")}
                  className="btn-primary group inline-flex items-center gap-3 bg-accent-500 hover:bg-accent-600 text-white px-7 py-4 rounded-xl text-base font-bold shadow-[0_18px_40px_-12px_rgba(191,10,48,0.55)] hover:shadow-[0_22px_48px_-12px_rgba(191,10,48,0.7)]"
                  style={{
                    transition:
                      "background-color 200ms ease, transform 140ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 280ms cubic-bezier(0.23, 1, 0.32, 1)",
                  }}
                >
                  Register Your Camper
                  <FaArrowRight
                    className="text-sm"
                    style={{
                      transition:
                        "transform 220ms cubic-bezier(0.23, 1, 0.32, 1)",
                    }}
                  />
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white px-7 py-4 rounded-xl text-base font-semibold border border-white/15"
                  style={{
                    transition:
                      "background-color 200ms ease, transform 140ms cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  Learn More
                </button>
              </div>

              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5 max-w-2xl border-t border-white/10 pt-8">
                {HERO_STATS.map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-white/45 text-[10px] uppercase tracking-[0.2em] font-bold mb-1.5">
                      {stat.label}
                    </dt>
                    <dd className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <button
          onClick={() => scrollToSection("about")}
          aria-label="Scroll to about section"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/40 hover:text-white animate-float"
          style={{ transition: "color 180ms ease" }}
        >
          <FaChevronDown className="h-5 w-5" />
        </button>

        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent z-10"
        />
      </section>

      <section id="about" className="relative py-24 lg:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24 lg:mb-32">
            <div className="scroll-animate from-left">
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-[0_30px_60px_-30px_rgba(0,12,26,0.45)] ring-1 ring-slate-200/60">
                  <img
                    src={img1}
                    alt="Coaches and campers on the field"
                    className="w-full h-[460px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                </div>

                <div className="absolute -top-4 -left-4 h-24 w-24 rounded-2xl border-2 border-accent-500/30 -z-10" />

                <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-4 bg-white rounded-2xl p-5 shadow-[0_20px_50px_-20px_rgba(0,12,26,0.4)] ring-1 ring-slate-200/60">
                  <div className="bg-accent-500 text-white rounded-xl p-3">
                    <FaStar className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900 leading-none">
                      3rd Year
                    </div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 mt-1">
                      Strong &amp; Growing
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="scroll-animate from-right delay-2">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent-500 mb-4">
                <span className="h-px w-8 bg-accent-500" />
                Our Story
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-[1.05] tracking-[-0.02em]">
                Built for our
                <br />
                <span className="text-primary-600">community.</span>
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  SETX Youth Football Camp was built to give kids in our
                  community opportunities we didn't always have growing up in
                  Daisetta, Texas. With limited youth sports available, we
                  chose to create something better.
                </p>
                <p>
                  SETXYFC is a community-first, majority-free football camp
                  offering two half-days of fundamentals, fun, and
                  confidence-building instruction. We provide drinks, snacks,
                  and a camp shirt for every participant — registered or not —
                  because inclusion matters.
                </p>
                <p className="text-sm text-slate-500">
                  Now in our third year, the camp keeps growing — and we're
                  excited to see what this season brings for our kids and our
                  community.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-8">
                {STORY_HIGHLIGHTS.map((item) => (
                  <div
                    key={item.label}
                    className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 hover:border-slate-300 hover:shadow-sm"
                    style={{
                      transition:
                        "border-color 180ms ease, box-shadow 220ms cubic-bezier(0.23, 1, 0.32, 1)",
                    }}
                  >
                    <div className="bg-primary-500/10 group-hover:bg-primary-500/15 p-2.5 rounded-lg" style={{ transition: "background-color 180ms ease" }}>
                      <item.icon className="h-3.5 w-3.5 text-primary-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="scroll-animate">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-600 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] mb-5">
                <FaShieldAlt className="h-3 w-3" />
                Background Checked
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-[-0.02em]">
                Meet the Coaches
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Every coach has completed a background check and brings real
                coaching and playing experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {COACHES.map((coach, index) => {
                const cl = COACH_STYLES[coach.color];
                return (
                  <div
                    key={coach.name}
                    className={`scroll-animate scale-in ${
                      index === 0 ? "delay-1" : "delay-2"
                    } group relative rounded-3xl border border-slate-200 bg-white p-7 sm:p-8 hover:border-slate-300 hover:shadow-[0_24px_50px_-24px_rgba(0,12,26,0.25)]`}
                    style={{
                      transition:
                        "border-color 220ms ease, box-shadow 320ms cubic-bezier(0.23, 1, 0.32, 1), transform 320ms cubic-bezier(0.23, 1, 0.32, 1)",
                    }}
                  >
                    <div
                      aria-hidden="true"
                      className={`absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent ${
                        coach.color === "primary"
                          ? "via-primary-500/60"
                          : "via-accent-500/60"
                      } to-transparent`}
                    />
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className={`${cl.iconBg} ring-4 ${cl.ring} p-3.5 rounded-2xl`}
                      >
                        <coach.icon className={`h-5 w-5 ${cl.iconColor}`} />
                      </div>
                      <div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-[0.18em] ${cl.eyebrow}`}
                        >
                          {coach.role}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight mt-0.5">
                          {coach.name}
                        </h3>
                      </div>
                    </div>
                    <ul className="space-y-2.5 mb-6">
                      {coach.points.map((point) => (
                        <li key={point} className="flex items-start gap-3">
                          <span
                            className={`mt-2 h-1.5 w-1.5 ${cl.bullet} rounded-full flex-shrink-0`}
                          />
                          <p className="text-slate-600 text-sm leading-relaxed">
                            {point}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5">
                      <div className="flex items-center gap-2">
                        <FaStar className={`h-3.5 w-3.5 ${cl.accent}`} />
                        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600">
                          {coach.highlight}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="scroll-animate scale-in relative rounded-3xl overflow-hidden bg-slate-950">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-400/60 to-transparent" />
              <div className="absolute -top-32 -right-20 h-72 w-72 bg-primary-500/15 rounded-full blur-3xl" />
              <div className="absolute -bottom-32 -left-20 h-72 w-72 bg-accent-500/15 rounded-full blur-3xl" />
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                }}
              />

              <div className="relative p-10 md:p-16 text-center">
                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent-300 mb-5">
                  <span className="h-px w-8 bg-accent-300/60" />
                  What Sets Us Apart
                  <span className="h-px w-8 bg-accent-300/60" />
                </span>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-6 tracking-[-0.02em]">
                  Camps don't usually look like this.
                </h3>
                <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto mb-8">
                  What truly sets SETXYFC apart is the presence of{" "}
                  <span className="text-white font-semibold">
                    outside professional and high-level athletes
                  </span>{" "}
                  who attend as guest coaches and speakers — giving campers
                  exposure to real-world experience, motivation, and insight
                  most camps simply cannot offer.
                </p>
                <div className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm p-7 sm:p-8 max-w-2xl mx-auto">
                  <p className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                    We are more than a camp — we are mentors, leaders, and
                    advocates, here for your kids on and off the field.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="gallery"
        className="relative py-24 lg:py-32 bg-slate-50 overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="scroll-animate text-center mb-14">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent-500 mb-4">
              <span className="h-px w-8 bg-accent-500" />
              Memories
              <span className="h-px w-8 bg-accent-500" />
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-[-0.02em]">
              Camp Gallery
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Highlights from past camps — the energy, the learning, the fun.
            </p>
          </div>

          <div className="grid grid-cols-4 auto-rows-[140px] sm:auto-rows-[180px] lg:auto-rows-[200px] gap-3 sm:gap-4">
            {GALLERY_IMAGES.map((img, i) => (
              <div
                key={i}
                className={`scroll-animate scale-in ${
                  ["delay-1", "delay-2", "delay-3", "delay-4", "delay-5", "delay-6", "delay-7", "delay-8"][i]
                } ${GALLERY_LAYOUT[i]} group relative rounded-2xl overflow-hidden bg-slate-200 ring-1 ring-slate-200/60 hover:ring-slate-300 hover:shadow-[0_18px_36px_-18px_rgba(0,12,26,0.3)]`}
                style={{
                  transition:
                    "box-shadow 280ms cubic-bezier(0.23, 1, 0.32, 1), --tw-ring-color 220ms ease",
                }}
              >
                <img
                  src={img}
                  alt={`Camp moment ${i + 1}`}
                  className="h-full w-full object-cover group-hover:scale-[1.06]"
                  style={{
                    transition:
                      "transform 700ms cubic-bezier(0.23, 1, 0.32, 1)",
                  }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent opacity-0 group-hover:opacity-100"
                  style={{ transition: "opacity 240ms ease" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sponsors" className="relative py-24 lg:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="scroll-animate text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-600 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] mb-4">
              <FaHandshake className="h-3 w-3" /> Our Partners
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-[-0.02em]">
              Thank you to our sponsors
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              We're grateful for the generous support that makes this camp
              possible for our community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {SPONSOR_IMAGES.map((sponsorImage, index) => (
              <div
                key={sponsorImage}
                className={`scroll-animate scale-in ${
                  ["delay-1", "delay-2", "delay-3"][index]
                } group relative rounded-3xl overflow-hidden bg-slate-50 ring-1 ring-slate-200/60 hover:ring-slate-300 hover:shadow-[0_24px_48px_-24px_rgba(0,12,26,0.3)]`}
                style={{
                  transition:
                    "box-shadow 320ms cubic-bezier(0.23, 1, 0.32, 1), --tw-ring-color 220ms ease",
                }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={sponsorImage}
                    alt={`Sponsor ${index + 1}`}
                    className="h-full w-full object-cover group-hover:scale-[1.04]"
                    style={{
                      transition:
                        "transform 700ms cubic-bezier(0.23, 1, 0.32, 1)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="register"
        className="relative py-24 lg:py-32 bg-slate-50 overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/2 -translate-x-1/2 h-72 w-[44rem] bg-primary-500/[0.04] rounded-full blur-3xl"
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="scroll-animate text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-accent-500/10 text-accent-600 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] mb-4">
              <FaTshirt className="h-3 w-3" /> Limited Spots
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-3 tracking-[-0.02em]">
              Register for camp
            </h2>
            <p className="text-slate-500">
              Sign up today — shirts are{" "}
              <span className="font-bold text-slate-900">
                ${SHIRT_PRICE} each
              </span>
            </p>
          </div>

          <div className="scroll-animate delay-2 rounded-3xl border border-slate-200/80 bg-white shadow-[0_30px_60px_-30px_rgba(0,12,26,0.25)] overflow-hidden">
            {submitResult && (
              <div
                role="alert"
                className={`m-6 mb-0 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
                  submitResult.success
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {submitResult.success ? (
                  <FaCheck className="flex-shrink-0" />
                ) : (
                  <FaTimes className="flex-shrink-0" />
                )}
                {submitResult.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
              <fieldset>
                <FormSectionHeader
                  icon={
                    <FaFootballBall className="text-primary-600 text-xs" />
                  }
                  title="Camper Information"
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    label="Full Name"
                    required
                    name="kidName"
                    value={formData.kidName}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                  />
                  <FormField
                    label="Age"
                    required
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="5–12"
                    min="5"
                    max="12"
                  />
                  <FormField
                    className="sm:col-span-2"
                    label="Nickname"
                    optional
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    placeholder="What should we call them?"
                  />
                </div>
              </fieldset>

              <fieldset>
                <div className="flex items-center justify-between mb-5">
                  <FormSectionHeader
                    inline
                    icon={<FaTshirt className="text-primary-600 text-xs" />}
                    title="Shirts"
                  />
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.14em]">
                    ${SHIRT_PRICE} each
                  </span>
                </div>

                <div className="space-y-3">
                  {formData.shirts.map((shirt, index) => (
                    <div
                      key={shirt.id}
                      className="rounded-2xl bg-slate-50 border border-slate-200 p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.14em]">
                          Shirt {index + 1}
                        </span>
                        {formData.shirts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeShirt(shirt.id)}
                            aria-label={`Remove shirt ${index + 1}`}
                            className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg"
                            style={{
                              transition:
                                "color 180ms ease, background-color 180ms ease",
                            }}
                          >
                            <FaTrash className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <select
                            value={shirt.size}
                            onChange={(e) =>
                              updateShirt(shirt.id, "size", e.target.value)
                            }
                            required
                            aria-label={`Shirt ${index + 1} size`}
                            className="w-full appearance-none bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2.5 pr-9 text-sm font-medium text-slate-900 cursor-pointer focus:border-primary-500"
                            style={{
                              transition:
                                "border-color 180ms ease, box-shadow 180ms ease",
                            }}
                          >
                            <option value="">Size</option>
                            {SHIRT_SIZES.map((size) => (
                              <option key={size} value={size}>
                                {size}
                              </option>
                            ))}
                          </select>
                          <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
                        </div>
                        <div
                          role="tablist"
                          aria-label={`Shirt ${index + 1} type`}
                          className="flex rounded-xl border border-slate-200 overflow-hidden bg-white"
                        >
                          {["camper", "family"].map((type) => (
                            <button
                              key={type}
                              type="button"
                              role="tab"
                              aria-selected={shirt.type === type}
                              onClick={() =>
                                updateShirt(shirt.id, "type", type)
                              }
                              className={`flex-1 py-2.5 text-xs font-bold capitalize ${
                                shirt.type === type
                                  ? "bg-primary-600 text-white"
                                  : "text-slate-500 hover:bg-slate-50"
                              }`}
                              style={{
                                transition:
                                  "background-color 180ms ease, color 180ms ease",
                              }}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            value={shirt.recipient}
                            onChange={(e) =>
                              updateShirt(
                                shirt.id,
                                "recipient",
                                e.target.value,
                              )
                            }
                            aria-label={`Shirt ${index + 1} recipient name`}
                            placeholder={
                              shirt.type === "camper"
                                ? `Camper name (default: ${formData.kidName || "registered kid"})`
                                : "Family member name"
                            }
                            className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:border-primary-500"
                            style={{
                              transition:
                                "border-color 180ms ease, box-shadow 180ms ease",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addShirt}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
                  style={{ transition: "color 180ms ease" }}
                >
                  <FaPlus className="h-3 w-3" /> Add another shirt
                </button>
              </fieldset>

              <fieldset>
                <FormSectionHeader
                  icon={<FaUsers className="text-primary-600 text-xs" />}
                  title="Parent / Guardian"
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    label="Full Name"
                    required
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleInputChange}
                    placeholder="Parent / guardian name"
                  />
                  <FormField
                    label="Phone"
                    required
                    name="parentPhone"
                    type="tel"
                    value={formData.parentPhone}
                    onChange={handleInputChange}
                    placeholder="(555) 555-5555"
                    icon={FaPhone}
                  />
                  <FormField
                    className="sm:col-span-2"
                    label="Email"
                    required
                    name="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    icon={FaEnvelope}
                  />
                </div>
              </fieldset>

              <fieldset>
                <FormSectionHeader
                  icon={<FaShieldAlt className="text-accent-600 text-xs" />}
                  title="Emergency Contact"
                  iconBg="bg-accent-500/10"
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    label="Name"
                    required
                    name="emergencyName"
                    value={formData.emergencyName}
                    onChange={handleInputChange}
                    placeholder="Emergency contact name"
                  />
                  <FormField
                    label="Phone"
                    required
                    name="emergencyPhone"
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    placeholder="(555) 555-5555"
                    icon={FaPhone}
                  />
                  <div className="sm:col-span-2">
                    <label className={SECTION_HEADER_INPUT_LABEL}>
                      Relationship <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="emergencyRelation"
                        value={formData.emergencyRelation}
                        onChange={handleInputChange}
                        required
                        className="w-full appearance-none bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-slate-900 cursor-pointer focus:bg-white focus:border-primary-500"
                        style={{
                          transition:
                            "background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
                        }}
                      >
                        <option value="">Select relationship</option>
                        {EMERGENCY_RELATIONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <div className="flex items-center justify-between mb-5">
                  <FormSectionHeader
                    inline
                    icon={
                      <FaDollarSign className="text-emerald-600 text-xs" />
                    }
                    title="Payment Info"
                    iconBg="bg-emerald-500/10"
                  />
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.14em]">
                    Optional
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-sm">
                    $
                  </span>
                  <input
                    type="text"
                    name="cashappUsername"
                    value={formData.cashappUsername}
                    onChange={handleInputChange}
                    placeholder="CashApp username or email"
                    aria-label="CashApp username or email"
                    className="w-full bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl pl-9 pr-4 py-3 text-sm placeholder:text-slate-400 focus:bg-white focus:border-emerald-500"
                    style={{
                      transition:
                        "background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
                    }}
                  />
                </div>
                <p className="text-slate-400 text-xs mt-2">
                  Helps us verify your payment. You can also add this later.
                </p>
              </fieldset>

              <div className="relative rounded-2xl overflow-hidden bg-slate-950 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div
                  aria-hidden="true"
                  className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-400/60 to-transparent"
                />
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.18em]">
                    Total Due
                  </div>
                  <div className="text-sm text-slate-400 mt-1">
                    {formData.shirts.length} shirt
                    {formData.shirts.length !== 1 ? "s" : ""} × ${SHIRT_PRICE}
                  </div>
                </div>
                <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  ${totalCost}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white py-4 rounded-2xl text-base font-bold shadow-[0_18px_40px_-12px_rgba(191,10,48,0.5)] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  transition:
                    "background-color 200ms ease, transform 140ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 280ms cubic-bezier(0.23, 1, 0.32, 1)",
                }}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                    Processing…
                  </>
                ) : (
                  <>
                    <FaClipboardList />
                    Complete Registration
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="relative bg-slate-950 text-slate-400 pt-20 pb-10 border-t border-slate-800/80">
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-400/40 to-transparent"
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="space-y-4">
              <div className="flex items-center">
                <img
                  src={logo}
                  alt=""
                  className="h-10 w-10 object-contain rounded-xl"
                />
                <div className="ml-3">
                  <span className="block text-base font-bold text-white">
                    SETX Football Camp
                  </span>
                  <span className="block text-[10px] uppercase tracking-[0.18em] text-slate-500 mt-0.5">
                    Youth · Daisetta, TX
                  </span>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Building champions on and off the field. A community-first
                youth football camp.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[11px] uppercase tracking-[0.18em] text-white mb-5">
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Home", id: "home" },
                  { label: "About", id: "about" },
                  { label: "Gallery", id: "gallery" },
                  { label: "Sponsors", id: "sponsors" },
                  { label: "Registration", id: "register" },
                ].map(({ label, id }) => (
                  <li key={id}>
                    <button
                      onClick={() => scrollToSection(id)}
                      className="text-slate-400 hover:text-white text-sm"
                      style={{ transition: "color 180ms ease" }}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[11px] uppercase tracking-[0.18em] text-white mb-5">
                Contact Us
              </h4>
              <div className="space-y-3">
                {[
                  { icon: FaMapMarkerAlt, text: "Daisetta, TX" },
                  { icon: FaPhone, text: "936-641-0681" },
                  { icon: FaEnvelope, text: "hanksclayton81@gmail.com" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm">
                    <Icon className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
                    <span className="text-slate-400">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[11px] uppercase tracking-[0.18em] text-white mb-5">
                Camp Info
              </h4>
              <div className="space-y-3 text-sm">
                {[
                  {
                    icon: FaCalendarAlt,
                    title: "July 2026",
                    subtitle: "Two half-day sessions",
                  },
                  {
                    icon: FaUsers,
                    title: "Ages 5–12",
                    subtitle: "All skill levels welcome",
                  },
                  {
                    icon: FaTshirt,
                    title: "$5 per shirt",
                    subtitle: "Includes drinks & snacks",
                  },
                ].map(({ icon: Icon, title, subtitle }) => (
                  <div key={title} className="flex items-start gap-3">
                    <Icon className="h-3.5 w-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-200">
                        {title}
                      </span>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>
              &copy; {new Date().getFullYear()} SETX Football Camp. All rights
              reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/privacy"
                className="hover:text-slate-300"
                style={{ transition: "color 180ms ease" }}
              >
                Privacy Policy
              </Link>
              <span className="text-slate-700">·</span>
              <Link
                to="/terms"
                className="hover:text-slate-300"
                style={{ transition: "color 180ms ease" }}
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const FormSectionHeader = ({
  icon,
  title,
  iconBg = "bg-primary-500/10",
  inline = false,
}) => (
  <h3
    className={`text-sm font-bold text-slate-900 uppercase tracking-[0.14em] flex items-center ${
      inline ? "" : "mb-5"
    }`}
  >
    <span className={`${iconBg} p-2 rounded-lg mr-3`}>{icon}</span>
    {title}
  </h3>
);

const FormField = ({
  label,
  required,
  optional,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  icon: Icon,
  min,
  max,
}) => (
  <div className={className}>
    <label
      htmlFor={name}
      className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 mb-2"
    >
      {label}{" "}
      {required && <span className="text-red-500">*</span>}
      {optional && (
        <span className="text-slate-400 normal-case tracking-normal font-normal ml-1">
          (optional)
        </span>
      )}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        className={`w-full bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl ${
          Icon ? "pl-10 pr-4" : "px-4"
        } py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary-500`}
        style={{
          transition:
            "background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
        }}
      />
    </div>
  </div>
);

export default HomePage;
