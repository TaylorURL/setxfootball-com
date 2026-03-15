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
  FaHandshake,
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
} from "react-icons/fa";

function HomePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    kidName: "",
    age: "",
    nickname: "",
    shirtSize: "",
    shirtQuantity: 1,
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
  const [visibleSections, setVisibleSections] = useState({});
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 },
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  useEffect(() => {
    const animateOnScroll = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-visible");
            entry.target.classList.remove("animate-hidden");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    const animatedElements = document.querySelectorAll(".scroll-animate");
    animatedElements.forEach((el) => animateOnScroll.observe(el));

    return () =>
      animatedElements.forEach((el) => animateOnScroll.unobserve(el));
  }, [visibleSections]);

  const totalCost = formData.shirtQuantity * SHIRT_PRICE;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitResult(null);

    try {
      const registration =
        await RegistrationService.createRegistration(formData);

      setFormData({
        kidName: "",
        age: "",
        nickname: "",
        shirtSize: "",
        shirtQuantity: 1,
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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-gradient-to-r from-primary-800 via-accent-600 to-primary-800 shadow-2xl py-2" : "bg-primary-700/90 backdrop-blur-md py-4"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div
              className="flex items-center group cursor-pointer"
              onClick={() => scrollToSection("home")}
            >
              <img
                src={logo}
                alt="SETX Football Camp"
                className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <span className="ml-3 text-xl font-bold text-white tracking-wide">
                SETX Football Camp
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {["home", "about", "gallery", "sponsors"].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 capitalize font-medium"
                >
                  {section}
                </button>
              ))}
              <button
                onClick={() => scrollToSection("register")}
                className="ml-4 bg-accent-400 text-white px-6 py-2.5 rounded-full font-bold hover:bg-accent-500 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-accent-400/50"
              >
                Register Now
              </button>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="ml-2 flex items-center text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium"
                  >
                    <FaUser className="mr-2" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="ml-2 flex items-center text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium"
                >
                  <FaUser className="mr-2" />
                  Login
                </Link>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {mobileMenuOpen ? (
                  <FaTimes className="h-6 w-6" />
                ) : (
                  <FaBars className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="bg-primary-800/95 backdrop-blur-md px-4 py-4 space-y-2">
            {["home", "about", "gallery", "sponsors"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="block w-full text-left text-white/90 hover:text-white px-4 py-3 rounded-lg hover:bg-white/10 transition-all capitalize"
              >
                {section}
              </button>
            ))}
            <button
              onClick={() => scrollToSection("register")}
              className="block w-full bg-accent-400 text-white px-4 py-3 rounded-lg font-bold hover:bg-accent-500 transition-all text-center mt-4"
            >
              Register Now
            </button>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center w-full text-white/90 hover:text-white px-4 py-3 rounded-lg hover:bg-white/10 transition-all"
                >
                  <FaUser className="mr-2" />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full text-white/90 hover:text-white px-4 py-3 rounded-lg hover:bg-white/10 transition-all"
                >
                  <FaSignOutAlt className="mr-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center w-full text-white/90 hover:text-white px-4 py-3 rounded-lg hover:bg-white/10 transition-all"
              >
                <FaUser className="mr-2" />
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <section
        id="home"
        className="relative min-h-screen overflow-hidden bg-gray-900"
      >
        <div className="absolute inset-0">
          <img
            src={img2}
            alt="Football action"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900/70"></div>
        </div>

        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-gray-900 z-10"></div>
          <img
            src={img3}
            alt="Camp training"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-20 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div
                className={`${visibleSections.home ? "animate-fade-in-left" : "opacity-0"}`}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                    <img
                      src={logo}
                      alt="SETX Football Camp"
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-accent-400 to-transparent"></div>
                </div>

                <span className="inline-block bg-accent-500/20 text-accent-400 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-6 border border-accent-500/30">
                  July 2026
                </span>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                  SETX
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-300">
                    Football Camp
                  </span>
                </h1>

                <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-xl">
                  Train like a champion. Build skills, teamwork, and confidence
                  in a fun, supportive environment for ages 5-12.
                </p>

                <div className="flex flex-wrap gap-4 mb-12">
                  <button
                    onClick={() => scrollToSection("register")}
                    className="group bg-accent-500 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-accent-600 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-accent-500/25 flex items-center"
                  >
                    Register Now
                    <FaChevronDown className="ml-3 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="group bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
                  >
                    Learn More
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {[
                    { value: "5-12", label: "Ages" },
                    { value: "$5", label: "Per Shirt" },
                    { value: "2 Days", label: "Duration" },
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl md:text-4xl font-black text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-gray-400 text-sm uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`hidden lg:block ${visibleSections.home ? "animate-fade-in-right" : "opacity-0"}`}
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-accent-500 to-primary-500 rounded-3xl blur-2xl opacity-30"></div>
                  <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-white/10">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        {
                          icon: FaFootballBall,
                          title: "Skills Training",
                          desc: "Learn fundamentals",
                        },
                        {
                          icon: FaUsers,
                          title: "Team Building",
                          desc: "Work together",
                        },
                        {
                          icon: FaTrophy,
                          title: "Competition",
                          desc: "Friendly games",
                        },
                        {
                          icon: FaHeart,
                          title: "Fun First",
                          desc: "Enjoy the game",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="bg-white/5 rounded-2xl p-5 hover:bg-white/10 transition-all duration-300 group"
                        >
                          <item.icon className="h-8 w-8 text-accent-400 mb-3 group-hover:scale-110 transition-transform" />
                          <h4 className="text-white font-bold mb-1">
                            {item.title}
                          </h4>
                          <p className="text-gray-400 text-sm">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <button
            onClick={() => scrollToSection("about")}
            className="animate-bounce text-white/50 hover:text-white transition-colors"
          >
            <FaChevronDown className="h-8 w-8" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
      </section>

      <section id="about" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="scroll-animate text-center mb-20">
            <span className="inline-block bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              About Us
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              About Our Camp
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-accent-400 to-accent-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="scroll-animate from-left">
              <div className="relative">
                <div className="rounded-3xl h-96 overflow-hidden group hover-lift shadow-2xl">
                  <img
                    src={img1}
                    alt="Football Camp Action"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent-400 rounded-2xl -z-10"></div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-200 rounded-2xl -z-10"></div>
              </div>
            </div>

            <div className="scroll-animate from-right delay-2">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Built for Our Community
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                SETX Youth Football Camp was built to give kids in our community
                opportunities we didn't always have growing up in Daisetta,
                Texas. With limited youth sports available, we chose to create
                something better.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                SETXYFC is a community-first, majority-free football camp
                offering two half days of fun, fundamentals, and
                confidence-building instruction. We provide drinks, snacks, and
                a camp shirt for every participant—registered or not—because
                inclusion matters.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg font-semibold">
                Now in our third year, the camp continues to grow, and we're
                excited to see what this season brings for our kids and our
                community.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: "Ages", value: "5-12 years old", icon: FaUsers },
                  {
                    title: "Duration",
                    value: "Two day camp",
                    icon: FaClipboardList,
                  },
                  {
                    title: "Skill Levels",
                    value: "All levels welcome",
                    icon: FaStar,
                  },
                  { title: "Year", value: "Third year", icon: FaTrophy },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`scroll-animate scale-in delay-${index + 3} bg-gradient-to-br from-primary-50 to-primary-100 p-5 rounded-2xl hover-lift card-shine group`}
                  >
                    <item.icon className="h-6 w-6 text-primary-600 mb-2 group-hover:scale-110 transition-transform" />
                    <h4 className="font-bold text-primary-800">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="scroll-animate delay-4 mt-32">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center bg-gradient-to-r from-accent-500 to-accent-600 text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-accent-500/30">
                <FaShieldAlt className="mr-3 h-5 w-5" />
                Background Checked & Experienced
              </div>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                Coaching Experience
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">
                  & Leadership
                </span>
              </h3>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Every coach selected for SETX Youth Football Camp has completed
                a background check and brings real coaching and/or playing
                experience. These are not random volunteers—your child is being
                taught by leaders who understand the game and care about the
                community.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <div className="scroll-animate from-left delay-5 group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-white rounded-3xl p-8 md:p-10 shadow-2xl border-4 border-white hover-lift">
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-12 group-hover:rotate-[20deg] transition-transform duration-300">
                    <FaTrophy className="h-10 w-10 text-white" />
                  </div>

                  <div className="flex items-start mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mr-5 shadow-lg flex-shrink-0">
                      <FaFootballBall className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                        Co-Founder
                      </div>
                      <h4 className="text-2xl md:text-3xl font-black text-gray-900">
                        Clayton Hanks
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-accent-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed font-medium">
                        Graduate of Hull-Daisetta High School
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-accent-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed font-medium">
                        Played semi-professional and international football with
                        multiple teams
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-accent-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed font-medium">
                        Actively coaching youth football for the past three
                        consecutive years
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-4 border-2 border-primary-200">
                    <div className="flex items-center text-primary-700">
                      <FaStar className="h-5 w-5 mr-2 text-accent-500" />
                      <span className="font-bold text-sm uppercase tracking-wide">
                        International Playing Experience
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="scroll-animate from-right delay-6 group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-500 to-accent-600 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-white rounded-3xl p-8 md:p-10 shadow-2xl border-4 border-white hover-lift">
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center shadow-xl transform -rotate-12 group-hover:-rotate-[20deg] transition-transform duration-300">
                    <FaUsers className="h-10 w-10 text-white" />
                  </div>

                  <div className="flex items-start mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center mr-5 shadow-lg flex-shrink-0">
                      <FaHeart className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="inline-block bg-accent-100 text-accent-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                        Co-Founder
                      </div>
                      <h4 className="text-2xl md:text-3xl font-black text-gray-900">
                        Timothy Taylor Sr.
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed font-medium">
                        Graduate of Hull-Daisetta High School
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed font-medium">
                        Former lettering athlete with proven competitive
                        experience
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed font-medium">
                        Approximately five years of coaching experience
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-accent-50 to-primary-50 rounded-2xl p-4 border-2 border-accent-200">
                    <div className="flex items-center text-accent-700">
                      <FaStar className="h-5 w-5 mr-2 text-primary-600" />
                      <span className="font-bold text-sm uppercase tracking-wide">
                        Dedicated Youth Development
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="scroll-animate scale-in delay-7 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600 rounded-3xl opacity-10 blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 via-accent-400 to-accent-500"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/20 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/20 rounded-full filter blur-3xl"></div>

                <div className="relative p-8 md:p-12 lg:p-16">
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl mb-6 shadow-xl">
                      <FaStar className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="text-3xl md:text-4xl font-black text-white mb-4">
                      What Sets Us Apart
                    </h4>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-accent-400 to-accent-600 mx-auto rounded-full"></div>
                  </div>

                  <div className="max-w-4xl mx-auto mb-8">
                    <p className="text-xl md:text-2xl text-gray-200 leading-relaxed text-center font-medium">
                      What truly sets SETXYFC apart is the presence of{" "}
                      <span className="text-accent-400 font-bold">
                        outside professional and high-level athletes
                      </span>{" "}
                      who attend as guest coaches and speakers, giving campers
                      exposure to real-world experience, motivation, and insight
                      that most camps simply cannot offer.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-8 md:p-10 text-center">
                    <div className="flex justify-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center shadow-lg">
                        <FaHeart className="h-6 w-6 text-white" />
                      </div>
                      <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                        <FaUsers className="h-6 w-6 text-white" />
                      </div>
                      <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center shadow-lg">
                        <FaShieldAlt className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-accent-300 to-white leading-tight">
                      We are more than a camp—we are mentors, leaders, and
                      advocates, here for your kids on and off the field.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="gallery"
        className="py-24 bg-gradient-to-b from-gray-50 to-gray-100 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scroll-animate text-center mb-20">
            <span className="inline-block bg-accent-100 text-accent-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Memories
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Camp Gallery
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-accent-400 to-accent-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[img1, img2, img3, img4, img5, img6, img7, img8].map(
              (img, index) => (
                <div
                  key={index}
                  className={`scroll-animate scale-in delay-${index + 1} group relative rounded-2xl h-56 overflow-hidden hover-lift card-shine shadow-lg`}
                >
                  <img
                    src={img}
                    alt={`Camp moment ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white font-semibold text-sm">
                      Camp Moment #{index + 1}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section
        id="sponsors"
        className="py-24 bg-white relative overflow-hidden"
      >
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100 rounded-full filter blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="scroll-animate text-center mb-20">
            <span className="inline-block bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Partners
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Our Sponsors
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-accent-400 to-accent-600 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We are grateful for the support of our sponsors who make this camp
              possible.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((sponsor, index) => (
              <div
                key={sponsor}
                className={`scroll-animate scale-in delay-${index + 1} group bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center border border-gray-200 hover:border-primary-300 hover:shadow-2xl transition-all duration-500 h-48 hover-lift card-shine`}
              >
                <div className="w-20 h-20 mx-auto bg-white rounded-2xl flex items-center justify-center mb-4 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                  <FaHandshake className="h-10 w-10 text-gray-400 group-hover:text-primary-600 transition-colors duration-300" />
                </div>
                <p className="text-gray-500 font-medium group-hover:text-primary-600 transition-colors">
                  Sponsor {sponsor}
                </p>
              </div>
            ))}
          </div>

          <div className="scroll-animate delay-5 text-center mt-16">
            <div className="inline-block bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8">
              <p className="text-gray-700 mb-4 text-lg">
                Interested in becoming a sponsor?
              </p>
              <a
                href="mailto:hanksclayton81@gmail.com"
                className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-primary-600/50"
              >
                <FaEnvelope className="mr-2" />
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="register" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-72 h-72 bg-accent-400 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="scroll-animate text-center mb-16">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <FaTshirt className="inline mr-2" />
              Limited Spots Available
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Register for Camp
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-accent-400 to-accent-600 mx-auto rounded-full mb-6"></div>
            <p className="text-primary-100 text-lg">
              Sign up today and secure your spot!
            </p>
            <p className="text-accent-300 font-bold text-xl mt-3">
              Shirts are ${SHIRT_PRICE} each
            </p>
          </div>

          <div className="scroll-animate delay-2 bg-white rounded-3xl shadow-2xl p-8 md:p-10">
            {submitResult && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-center ${submitResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {submitResult.success ? (
                  <FaCheck className="mr-3" />
                ) : (
                  <FaTimes className="mr-3" />
                )}
                {submitResult.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="scroll-animate delay-3 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 md:p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-primary-500/30">
                    <FaFootballBall className="text-white text-lg" />
                  </span>
                  Camper Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                      Kid's Full Name <span className="text-accent-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="kidName"
                        value={formData.kidName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 text-gray-800 font-medium placeholder-gray-400"
                        placeholder="Enter full name"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 group-focus-within:opacity-100 -z-10 blur transition-opacity duration-300"></div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                      Age <span className="text-accent-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        required
                        min="5"
                        max="12"
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 text-gray-800 font-medium placeholder-gray-400"
                        placeholder="5-12"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                      Nickname{" "}
                      <span className="text-gray-400 text-xs normal-case">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 text-gray-800 font-medium placeholder-gray-400"
                      placeholder="What should we call them?"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                      Shirt Size <span className="text-accent-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="shirtSize"
                        value={formData.shirtSize}
                        onChange={handleInputChange}
                        required
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 text-gray-800 font-medium appearance-none cursor-pointer hover:border-gray-300"
                      >
                        <option value="" className="text-gray-400">
                          Select a size
                        </option>
                        {SHIRT_SIZES.map((size) => (
                          <option key={size} value={size} className="py-2">
                            {size}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <FaChevronDown className="text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="group md:col-span-2">
                    <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                      Number of Shirts{" "}
                      <span className="text-accent-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() =>
                            handleInputChange({
                              target: { name: "shirtQuantity", value: num },
                            })
                          }
                          className={`flex-1 min-w-[80px] py-4 px-4 rounded-xl border-2 font-bold transition-all duration-300 ${
                            parseInt(formData.shirtQuantity) === num
                              ? "border-primary-500 bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-105"
                              : "border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50"
                          }`}
                        >
                          <div className="text-lg">{num}</div>
                          <div
                            className={`text-xs ${parseInt(formData.shirtQuantity) === num ? "text-primary-100" : "text-gray-500"}`}
                          >
                            ${num * SHIRT_PRICE}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="scroll-animate delay-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 md:p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-primary-500/30">
                    <FaUsers className="text-white text-lg" />
                  </span>
                  Parent/Guardian Contact
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                      Parent/Guardian Name{" "}
                      <span className="text-accent-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 text-gray-800 font-medium placeholder-gray-400"
                      placeholder="Full name"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                      Phone Number <span className="text-accent-500">*</span>
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="parentPhone"
                        value={formData.parentPhone}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-12 pr-5 py-4 rounded-xl border-2 border-gray-200 bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 text-gray-800 font-medium placeholder-gray-400"
                        placeholder="(555) 555-5555"
                      />
                    </div>
                  </div>

                  <div className="group md:col-span-2">
                    <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                      Email Address <span className="text-accent-500">*</span>
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="parentEmail"
                        value={formData.parentEmail}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-12 pr-5 py-4 rounded-xl border-2 border-gray-200 bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 text-gray-800 font-medium placeholder-gray-400"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="scroll-animate delay-5 bg-gradient-to-br from-accent-50/50 to-white rounded-2xl p-6 md:p-8 border border-accent-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-accent-500/30">
                    <FaShieldAlt className="text-white text-lg" />
                  </span>
                  Emergency Contact
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                      Contact Name <span className="text-accent-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="emergencyName"
                      value={formData.emergencyName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 bg-white focus:border-accent-500 focus:ring-4 focus:ring-accent-500/20 transition-all duration-300 text-gray-800 font-medium placeholder-gray-400"
                      placeholder="Emergency contact name"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                      Phone Number <span className="text-accent-500">*</span>
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-12 pr-5 py-4 rounded-xl border-2 border-gray-200 bg-white focus:border-accent-500 focus:ring-4 focus:ring-accent-500/20 transition-all duration-300 text-gray-800 font-medium placeholder-gray-400"
                        placeholder="(555) 555-5555"
                      />
                    </div>
                  </div>

                  <div className="group md:col-span-2">
                    <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                      Relationship to Child{" "}
                      <span className="text-accent-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="emergencyRelation"
                        value={formData.emergencyRelation}
                        onChange={handleInputChange}
                        required
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 bg-white focus:border-accent-500 focus:ring-4 focus:ring-accent-500/20 transition-all duration-300 text-gray-800 font-medium appearance-none cursor-pointer hover:border-gray-300"
                      >
                        <option value="">Select relationship</option>
                        {EMERGENCY_RELATIONS.map((relation) => (
                          <option key={relation} value={relation}>
                            {relation}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <FaChevronDown className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="scroll-animate delay-6 bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 md:p-8 border border-green-200">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-green-500/30">
                    <FaDollarSign className="text-white text-lg" />
                  </span>
                  Payment Information
                </h3>
                <div className="group">
                  <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                    CashApp Username or Email{" "}
                    <span className="text-gray-400 text-xs normal-case">
                      (optional)
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600 font-bold">
                      $
                    </span>
                    <input
                      type="text"
                      name="cashappUsername"
                      value={formData.cashappUsername}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-5 py-4 rounded-xl border-2 border-gray-200 bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 text-gray-800 font-medium placeholder-gray-400"
                      placeholder="username or email@example.com"
                    />
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    This helps us verify your payment. You can also add this
                    after registration.
                  </p>
                </div>
              </div>

              <div className="scroll-animate delay-7 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 md:p-8 text-white shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h4 className="font-bold text-xl mb-1">
                      Total Due at Camp
                    </h4>
                    <p className="text-primary-200">
                      {formData.shirtQuantity} shirt(s) x ${SHIRT_PRICE} each
                    </p>
                  </div>
                  <div className="text-5xl font-extrabold">${totalCost}</div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="scroll-animate delay-8 group w-full bg-gradient-to-r from-accent-500 to-accent-600 text-white py-5 rounded-2xl text-xl font-bold hover:from-accent-600 hover:to-accent-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-xl hover:shadow-2xl hover:shadow-accent-500/40 transform hover:scale-[1.02]"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
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

      <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 via-accent-400 to-primary-600"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <img
                  src={logo}
                  alt="SETX Football Camp"
                  className="h-14 w-14 object-contain"
                />
                <span className="ml-3 text-2xl font-bold">
                  SETX Football Camp
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Building champions on and off the field since day one. Join us
                for an unforgettable football experience.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                {["home", "about", "gallery", "sponsors", "register"].map(
                  (section) => (
                    <li key={section}>
                      <button
                        onClick={() => scrollToSection(section)}
                        className="text-gray-400 hover:text-accent-400 transition-all duration-300 capitalize flex items-center group"
                      >
                        <span className="w-0 group-hover:w-4 h-0.5 bg-accent-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                        {section}
                      </button>
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-6 text-white">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-400 group">
                  <span className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center mr-4 group-hover:bg-accent-400 transition-colors duration-300">
                    <FaMapMarkerAlt className="text-accent-400 group-hover:text-white transition-colors duration-300" />
                  </span>
                  SETX Area, Texas
                </li>
                <li className="flex items-center text-gray-400 group">
                  <span className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center mr-4 group-hover:bg-accent-400 transition-colors duration-300">
                    <FaPhone className="text-accent-400 group-hover:text-white transition-colors duration-300" />
                  </span>
                  936-641-0681
                </li>
                <li className="flex items-center text-gray-400 group">
                  <span className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center mr-4 group-hover:bg-accent-400 transition-colors duration-300">
                    <FaEnvelope className="text-accent-400 group-hover:text-white transition-colors duration-300" />
                  </span>
                  hanksclayton81@gmail.com
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-500">
              &copy; {new Date().getFullYear()} SETX Football Camp. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
