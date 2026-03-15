/**
 * HomePage - Main landing page for the SETX Football Camp website.
 *
 * Renders the full public-facing site including navigation, hero section,
 * about/coaches section, photo gallery, sponsors, registration form, and footer.
 * Handles camper registration submission and navigates to the payment page on success.
 *
 * @module pages/HomePage
 * @returns {React.ReactElement} The rendered home page
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
  FaTrophy,
  FaHeart,
  FaShieldAlt,
  FaDollarSign,
  FaSignOutAlt,
  FaUser,
  FaPlus,
  FaTrash,
  FaCalendarAlt,
} from "react-icons/fa";

function HomePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
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
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /** IntersectionObserver for scroll-triggered CSS class animations */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );
    const els = document.querySelectorAll(".scroll-animate");
    els.forEach((el) => observer.observe(el));
    return () => els.forEach((el) => observer.unobserve(el));
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

      setFormData({
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

      navigate("/payment", { state: { registration } });
    } catch (error) {
      setSubmitResult({
        success: false,
        message:
          "Registration failed. Please try again or contact us directly.",
      });
      console.error("Error:", error);
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

  const navLinks = ["home", "about", "gallery"];

  return (
    <div className="min-h-screen bg-white">
      {/* ==================== Navigation ==================== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-2" : "bg-transparent py-4"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div
              className="flex items-center cursor-pointer group"
              onClick={() => scrollToSection("home")}
            >
              <img
                src={logo}
                alt="SETX Football Camp"
                className="h-10 w-10 object-contain group-hover:scale-105 transition-transform"
              />
              <div className="ml-3 hidden sm:block">
                <span
                  className={`text-base font-bold tracking-tight transition-colors ${scrolled ? "text-slate-900" : "text-white"}`}
                >
                  SETX Football
                </span>
                <span
                  className={`block text-[10px] font-medium uppercase tracking-widest transition-colors ${scrolled ? "text-slate-400" : "text-white/60"}`}
                >
                  Youth Camp
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${scrolled ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100" : "text-white/80 hover:text-white hover:bg-white/10"}`}
                >
                  {section === "register" ? "Sign Up" : section}
                </button>
              ))}
              <button
                onClick={() => scrollToSection("register")}
                className="ml-3 bg-accent-400 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-accent-500 transition-all text-sm shadow-lg shadow-accent-400/20"
              >
                Register Now
              </button>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`ml-1 flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${scrolled ? "text-slate-600 hover:bg-slate-100" : "text-white/80 hover:bg-white/10"}`}
                  >
                    <FaUser className="mr-1.5 text-xs" /> Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${scrolled ? "text-slate-600 hover:bg-slate-100" : "text-white/80 hover:bg-white/10"}`}
                  >
                    <FaSignOutAlt className="mr-1.5 text-xs" /> Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className={`ml-1 flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${scrolled ? "text-slate-600 hover:bg-slate-100" : "text-white/80 hover:bg-white/10"}`}
                >
                  <FaUser className="mr-1.5 text-xs" /> Login
                </Link>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? "text-slate-700 hover:bg-slate-100" : "text-white hover:bg-white/10"}`}
            >
              {mobileMenuOpen ? (
                <FaTimes className="h-5 w-5" />
              ) : (
                <FaBars className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="bg-white border-t border-slate-100 px-4 py-3 space-y-1 shadow-xl">
            {navLinks.map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="block w-full text-left text-slate-700 hover:text-slate-900 px-4 py-3 rounded-lg hover:bg-slate-50 capitalize text-sm font-medium"
              >
                {section === "register" ? "Sign Up" : section}
              </button>
            ))}
            <button
              onClick={() => scrollToSection("register")}
              className="block w-full bg-accent-400 text-white px-4 py-3 rounded-lg font-semibold text-center mt-2 text-sm"
            >
              Register Now
            </button>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center w-full text-slate-700 px-4 py-3 rounded-lg hover:bg-slate-50 text-sm font-medium"
                >
                  <FaUser className="mr-2 text-xs" /> Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full text-slate-700 px-4 py-3 rounded-lg hover:bg-slate-50 text-sm font-medium"
                >
                  <FaSignOutAlt className="mr-2 text-xs" /> Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center w-full text-slate-700 px-4 py-3 rounded-lg hover:bg-slate-50 text-sm font-medium"
              >
                <FaUser className="mr-2 text-xs" /> Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ==================== Hero ==================== */}
      <section
        id="home"
        className="relative min-h-screen overflow-hidden bg-primary-900"
      >
        {/* Solid dark background — no stretched photo */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-slate-900 to-primary-800"></div>

        {/* Decorative grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>

        {/* Accent glow blobs */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary-400/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
            <div className="max-w-3xl">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-8">
                <FaCalendarAlt className="text-accent-400 text-xs mr-2" />
                <span className="text-white/90 text-sm font-medium">
                  July 2026 · Daisetta, TX
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
                Where Future
                <br />
                <span className="text-accent-400">Champions</span>
                <br />
                Are Made
              </h1>

              <p className="text-xl text-white/70 mb-10 leading-relaxed max-w-xl">
                Two days of skill building, teamwork, and fun for ages 5-12.
                Every kid gets a camp shirt, drinks, and snacks — because
                inclusion matters.
              </p>

              <div className="flex flex-wrap gap-4 mb-16">
                <button
                  onClick={() => scrollToSection("register")}
                  className="bg-accent-400 hover:bg-accent-500 text-white px-8 py-4 rounded-xl text-base font-bold transition-all shadow-xl shadow-accent-400/25 hover:shadow-accent-400/40 flex items-center"
                >
                  Register Your Camper
                  <FaChevronDown className="ml-3 rotate-[-90deg]" />
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/15 text-white px-8 py-4 rounded-xl text-base font-semibold transition-all border border-white/10"
                >
                  Learn More
                </button>
              </div>

              <div className="flex gap-10 sm:gap-16">
                {[
                  { value: "5–12", label: "Ages" },
                  { value: "$5", label: "Per Shirt" },
                  { value: "2 Days", label: "Duration" },
                  { value: "3rd", label: "Year" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl sm:text-3xl font-black text-white">
                      {stat.value}
                    </div>
                    <div className="text-white/40 text-xs uppercase tracking-widest font-medium mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={() => scrollToSection("about")}
            className="animate-bounce text-white/30 hover:text-white/60 transition-colors"
          >
            <FaChevronDown className="h-5 w-5" />
          </button>
        </div>

        {/* Bottom gradient into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
      </section>

      {/* ==================== About ==================== */}
      <section id="about" className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Two-column intro */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-28">
            <div className="scroll-animate from-left">
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={img1}
                    alt="Football Camp"
                    className="w-full h-[420px] object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-accent-400 text-white rounded-2xl p-6 shadow-xl hidden sm:block">
                  <div className="text-3xl font-black">3rd</div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/80">
                    Year Running
                  </div>
                </div>
              </div>
            </div>

            <div className="scroll-animate from-right delay-2">
              <span className="text-xs font-bold uppercase tracking-widest text-accent-400 mb-4 block">
                Our Story
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 leading-tight">
                Built for Our Community
              </h2>
              <p className="text-slate-600 mb-5 leading-relaxed">
                SETX Youth Football Camp was built to give kids in our community
                opportunities we didn't always have growing up in Daisetta,
                Texas. With limited youth sports available, we chose to create
                something better.
              </p>
              <p className="text-slate-600 mb-5 leading-relaxed">
                SETXYFC is a community-first, majority-free football camp
                offering two half days of fun, fundamentals, and
                confidence-building instruction. We provide drinks, snacks, and
                a camp shirt for every participant—registered or not—because
                inclusion matters.
              </p>
              <p className="text-slate-500 leading-relaxed text-sm">
                Now in our third year, the camp continues to grow, and we're
                excited to see what this season brings for our kids and our
                community.
              </p>

              <div className="grid grid-cols-2 gap-3 mt-8">
                {[
                  { icon: FaUsers, label: "Ages 5-12" },
                  { icon: FaClipboardList, label: "Two Day Camp" },
                  { icon: FaStar, label: "All Levels" },
                  { icon: FaHeart, label: "Community First" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100"
                  >
                    <div className="bg-primary-500/10 p-2 rounded-lg">
                      <item.icon className="h-3.5 w-3.5 text-primary-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coaches section */}
          <div className="scroll-animate">
            <div className="text-center mb-16">
              <span className="inline-flex items-center bg-primary-500/10 text-primary-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                <FaShieldAlt className="mr-2 h-3 w-3" />
                Background Checked
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
                Meet the Coaches
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Every coach has completed a background check and brings real
                coaching and/or playing experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {[
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
              ].map((coach) => (
                <div
                  key={coach.name}
                  className={`scroll-animate scale-in rounded-2xl border border-slate-200 bg-white p-8 hover:shadow-lg transition-all duration-300`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`bg-${coach.color}-500/10 p-3 rounded-xl`}>
                      <coach.icon
                        className={`h-6 w-6 text-${coach.color}-600`}
                      />
                    </div>
                    <div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest text-${coach.color}-600`}
                      >
                        {coach.role}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900">
                        {coach.name}
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-2.5 mb-6">
                    {coach.points.map((point) => (
                      <div key={point} className="flex items-start">
                        <div
                          className={`w-1.5 h-1.5 bg-${coach.color}-500 rounded-full mt-2 mr-3 flex-shrink-0`}
                        ></div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-center">
                      <FaStar
                        className={`h-4 w-4 mr-2 text-${coach.color}-500`}
                      />
                      <span className="text-xs font-bold uppercase tracking-wide text-slate-600">
                        {coach.highlight}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* What sets us apart */}
            <div className="scroll-animate scale-in bg-slate-900 rounded-3xl overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-400 to-primary-500"></div>
              <div className="absolute top-0 right-0 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl"></div>

              <div className="relative p-10 md:p-16 text-center">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-6">
                  What Sets Us Apart
                </h3>
                <p className="text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto mb-8">
                  What truly sets SETXYFC apart is the presence of{" "}
                  <span className="text-primary-400 font-semibold">
                    outside professional and high-level athletes
                  </span>{" "}
                  who attend as guest coaches and speakers, giving campers
                  exposure to real-world experience, motivation, and insight
                  that most camps cannot offer.
                </p>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
                  <p className="text-xl font-bold text-white leading-relaxed">
                    We are more than a camp — we are mentors, leaders, and
                    advocates, here for your kids on and off the field.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== Gallery ==================== */}
      <section id="gallery" className="py-24 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scroll-animate text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-400 mb-4 block">
              Memories
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
              Camp Gallery
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Highlights from past camps — the energy, the learning, the fun.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[img1, img2, img3, img4, img5, img6, img7, img8].map((img, i) => (
              <div
                key={i}
                className={`scroll-animate scale-in delay-${Math.min(i + 1, 8)} group relative rounded-2xl h-48 sm:h-56 overflow-hidden cursor-pointer`}
              >
                <img
                  src={img}
                  alt={`Camp moment ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== Registration Form ==================== */}
      <section id="register" className="py-24 lg:py-32 bg-slate-50 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scroll-animate text-center mb-12">
            <span className="inline-flex items-center bg-accent-400/10 text-accent-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <FaTshirt className="mr-2" /> Limited Spots
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
              Register for Camp
            </h2>
            <p className="text-slate-500">
              Sign up today — shirts are{" "}
              <span className="font-bold text-slate-900">
                ${SHIRT_PRICE} each
              </span>
            </p>
          </div>

          <div className="scroll-animate delay-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
            {submitResult && (
              <div
                className={`m-6 mb-0 p-4 rounded-xl flex items-center text-sm font-medium ${submitResult.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
              >
                {submitResult.success ? (
                  <FaCheck className="mr-3 flex-shrink-0" />
                ) : (
                  <FaTimes className="mr-3 flex-shrink-0" />
                )}
                {submitResult.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              {/* Camper info */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-5 flex items-center">
                  <span className="bg-primary-500/10 p-2 rounded-lg mr-3">
                    <FaFootballBall className="text-primary-600 text-xs" />
                  </span>
                  Camper Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="kidName"
                      value={formData.kidName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter full name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                      Age <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                      min="5"
                      max="12"
                      placeholder="5-12"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                      Nickname{" "}
                      <span className="text-slate-400 normal-case tracking-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleInputChange}
                      placeholder="What should we call them?"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Shirts — per-shirt size selection */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-5 flex items-center">
                  <span className="bg-primary-500/10 p-2 rounded-lg mr-3">
                    <FaTshirt className="text-primary-600 text-xs" />
                  </span>
                  Shirts
                  <span className="ml-auto text-xs font-medium text-slate-400 normal-case tracking-normal">
                    ${SHIRT_PRICE} each
                  </span>
                </h3>

                <div className="space-y-4">
                  {formData.shirts.map((shirt, index) => (
                    <div
                      key={shirt.id}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-400">
                          Shirt {index + 1}
                        </span>
                        {formData.shirts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeShirt(shirt.id)}
                            className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-all"
                          >
                            <FaTrash className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {/* Size */}
                        <div className="relative">
                          <select
                            value={shirt.size}
                            onChange={(e) =>
                              updateShirt(shirt.id, "size", e.target.value)
                            }
                            required
                            className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2.5 pr-9 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all outline-none cursor-pointer"
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
                        {/* Camper / Family toggle */}
                        <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              updateShirt(shirt.id, "type", "camper")
                            }
                            className={`flex-1 py-2.5 text-xs font-semibold transition-all ${
                              shirt.type === "camper"
                                ? "bg-primary-600 text-white"
                                : "bg-white text-slate-500 hover:bg-slate-50"
                            }`}
                          >
                            Camper
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateShirt(shirt.id, "type", "family")
                            }
                            className={`flex-1 py-2.5 text-xs font-semibold transition-all ${
                              shirt.type === "family"
                                ? "bg-primary-600 text-white"
                                : "bg-white text-slate-500 hover:bg-slate-50"
                            }`}
                          >
                            Family
                          </button>
                        </div>
                        {/* Recipient name */}
                        <div className="col-span-2">
                          <input
                            type="text"
                            value={shirt.recipient}
                            onChange={(e) =>
                              updateShirt(shirt.id, "recipient", e.target.value)
                            }
                            placeholder={
                              shirt.type === "camper"
                                ? `Camper name (default: ${formData.kidName || "registered kid"})`
                                : "Family member name"
                            }
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addShirt}
                  className="mt-3 flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <FaPlus className="mr-2 h-3 w-3" /> Add another shirt
                </button>
              </div>

              {/* Parent contact */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-5 flex items-center">
                  <span className="bg-primary-500/10 p-2 rounded-lg mr-3">
                    <FaUsers className="text-primary-600 text-xs" />
                  </span>
                  Parent / Guardian
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleInputChange}
                      required
                      placeholder="Parent/guardian name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                      Phone <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input
                        type="tel"
                        name="parentPhone"
                        value={formData.parentPhone}
                        onChange={handleInputChange}
                        required
                        placeholder="(555) 555-5555"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input
                        type="email"
                        name="parentEmail"
                        value={formData.parentEmail}
                        onChange={handleInputChange}
                        required
                        placeholder="email@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency contact */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-5 flex items-center">
                  <span className="bg-accent-500/10 p-2 rounded-lg mr-3">
                    <FaShieldAlt className="text-accent-600 text-xs" />
                  </span>
                  Emergency Contact
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                      Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="emergencyName"
                      value={formData.emergencyName}
                      onChange={handleInputChange}
                      required
                      placeholder="Emergency contact name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                      Phone <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input
                        type="tel"
                        name="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={handleInputChange}
                        required
                        placeholder="(555) 555-5555"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                      Relationship <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="emergencyRelation"
                        value={formData.emergencyRelation}
                        onChange={handleInputChange}
                        required
                        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all outline-none cursor-pointer"
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
              </div>

              {/* CashApp */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-5 flex items-center">
                  <span className="bg-green-500/10 p-2 rounded-lg mr-3">
                    <FaDollarSign className="text-green-600 text-xs" />
                  </span>
                  Payment Info
                  <span className="ml-auto text-xs font-medium text-slate-400 normal-case tracking-normal">
                    Optional
                  </span>
                </h3>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600 font-semibold text-sm">
                    $
                  </span>
                  <input
                    type="text"
                    name="cashappUsername"
                    value={formData.cashappUsername}
                    onChange={handleInputChange}
                    placeholder="CashApp username or email"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all outline-none"
                  />
                </div>
                <p className="text-slate-400 text-xs mt-2">
                  Helps us verify your payment. You can also add this later.
                </p>
              </div>

              {/* Total + submit */}
              <div className="bg-slate-900 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                    Total Due
                  </div>
                  <div className="text-sm text-slate-400 mt-0.5">
                    {formData.shirts.length} shirt
                    {formData.shirts.length !== 1 ? "s" : ""} x ${SHIRT_PRICE}
                  </div>
                </div>
                <div className="text-4xl font-black text-white">
                  ${totalCost}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-accent-400 hover:bg-accent-500 text-white py-4 rounded-xl text-base font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-accent-400/20"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaClipboardList className="mr-2" />
                    Complete Registration
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ==================== Footer ==================== */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center">
                <img
                  src={logo}
                  alt="SETX Football Camp"
                  className="h-9 w-9 object-contain rounded-lg"
                />
                <span className="ml-3 text-base font-bold text-white">
                  SETX Football Camp
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Building champions on and off the field. A community-first youth
                football camp in Daisetta, Texas.
              </p>

              <div className="pt-4 mt-4 border-t border-slate-800 space-y-1.5 text-xs text-slate-500">
                <p>
                  &copy; {new Date().getFullYear()} SETX Football Camp. All
                  rights reserved.
                </p>
                <div className="flex gap-3">
                  <Link
                    to="/privacy"
                    className="hover:text-slate-300 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <span className="text-slate-700">|</span>
                  <Link
                    to="/terms"
                    className="hover:text-slate-300 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </div>
                <p>
                  Website by{" "}
                  <a
                    href="https://taylorurl.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    TaylorURL.com
                  </a>
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest text-white mb-5">
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Home", id: "home" },
                  { label: "About", id: "about" },
                  { label: "Gallery", id: "gallery" },
                  { label: "Registration", id: "register" },
                ].map(({ label, id }) => (
                  <li key={id}>
                    <button
                      onClick={() => scrollToSection(id)}
                      className="text-slate-400 hover:text-white transition-colors text-sm"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest text-white mb-5">
                Contact Us
              </h4>
              <div className="space-y-3">
                {[
                  { icon: FaMapMarkerAlt, text: "Daisetta, TX" },
                  { icon: FaPhone, text: "936-641-0681" },
                  { icon: FaEnvelope, text: "hanksclayton81@gmail.com" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center text-sm">
                    <Icon className="h-3.5 w-3.5 text-slate-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-400">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Camp Info */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest text-white mb-5">
                Camp Info
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <FaCalendarAlt className="h-3.5 w-3.5 text-slate-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-slate-300">
                      July 2026
                    </span>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Two half-day sessions
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaUsers className="h-3.5 w-3.5 text-slate-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-slate-300">
                      Ages 5-12
                    </span>
                    <p className="text-slate-500 text-xs mt-0.5">
                      All skill levels welcome
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaTshirt className="h-3.5 w-3.5 text-slate-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-slate-300">
                      $5 per shirt
                    </span>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Includes drinks &amp; snacks
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
