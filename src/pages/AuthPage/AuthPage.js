import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaFootballBall,
  FaArrowLeft,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";
import logo from "../../assets/logo.PNG";

const FIELD_INPUT_CLASS =
  "w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 hover:border-slate-300 focus:border-primary-500 focus:bg-white";

const FIELD_INPUT_STYLE = {
  transition:
    "background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
};

const FORM_FIELDS = [
  {
    name: "fullName",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
    icon: FaUser,
    signUpOnly: true,
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "email@example.com",
    icon: FaEnvelope,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "••••••••",
    icon: FaLock,
    minLength: 6,
  },
];

const ALERT_STYLES = {
  error: {
    container: "bg-red-50 border-red-200 text-red-700",
    icon: "text-red-500",
  },
  success: {
    container: "bg-emerald-50 border-emerald-200 text-emerald-700",
    icon: "text-emerald-500",
  },
};

const AlertBanner = ({ variant, icon: Icon, children }) => {
  const style = ALERT_STYLES[variant];
  return (
    <div
      role="alert"
      className={`mb-6 px-4 py-3 border rounded-xl text-sm flex items-start gap-3 ${style.container}`}
    >
      <Icon className={`${style.icon} mt-0.5 shrink-0`} />
      <span>{children}</span>
    </div>
  );
};

const FormField = ({ field, value, onChange, isLogin }) => {
  const Icon = field.icon;
  return (
    <div>
      <label
        htmlFor={field.name}
        className="block text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-[0.14em]"
      >
        {field.label}
      </label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input
          id={field.name}
          type={field.type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.signUpOnly ? !isLogin : true}
          minLength={field.minLength}
          className={FIELD_INPUT_CLASS}
          style={FIELD_INPUT_STYLE}
          placeholder={field.placeholder}
        />
      </div>
    </div>
  );
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const updateField = (name) => (value) =>
    setFormValues((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(formValues.email, formValues.password);
        navigate("/dashboard");
      } else {
        await signUp(
          formValues.email,
          formValues.password,
          formValues.fullName,
        );
        setMessage(
          "Account created! Please check your email to verify your account.",
        );
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setMessage("");
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900"
      />
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-400/60 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute -top-32 right-10 h-[28rem] w-[28rem] bg-accent-500/15 rounded-full blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 left-10 h-[24rem] w-[24rem] bg-primary-400/15 rounded-full blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative w-full max-w-md animate-fade-in-up">
        <Link
          to="/"
          className="inline-flex items-center text-white/70 hover:text-white mb-6 sm:mb-8 text-sm font-medium"
          style={{ transition: "color 180ms ease" }}
        >
          <FaArrowLeft className="mr-2 text-xs" />
          Back to Home
        </Link>

        <div className="rounded-3xl bg-white shadow-[0_30px_60px_-30px_rgba(0,12,26,0.6)] ring-1 ring-white/10 p-7 sm:p-9">
          <div className="text-center mb-7">
            <div className="flex justify-center mb-5">
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-[0_18px_40px_-18px_rgba(0,12,26,0.55)] ring-1 ring-primary-700/40">
                <img
                  src={logo}
                  alt="SETX Football Camp"
                  className="w-14 h-14 object-contain"
                />
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-accent-500 ring-4 ring-white flex items-center justify-center"
                >
                  <FaFootballBall className="text-white text-[10px]" />
                </span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-[28px] font-black text-slate-900 tracking-[-0.02em]">
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              {isLogin
                ? "Sign in to access your dashboard"
                : "Join SETX Football Camp"}
            </p>
          </div>

          {error && (
            <AlertBanner variant="error" icon={FaExclamationCircle}>
              {error}
            </AlertBanner>
          )}

          {message && (
            <AlertBanner variant="success" icon={FaCheckCircle}>
              {message}
            </AlertBanner>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {FORM_FIELDS.filter((f) => !f.signUpOnly || !isLogin).map(
              (field) => (
                <FormField
                  key={field.name}
                  field={field}
                  value={formValues[field.name]}
                  onChange={updateField(field.name)}
                  isLogin={isLogin}
                />
              ),
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white py-3.5 rounded-xl text-sm font-bold shadow-[0_18px_40px_-12px_rgba(191,10,48,0.55)] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  transition:
                    "background-color 200ms ease, transform 140ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 280ms cubic-bezier(0.23, 1, 0.32, 1)",
                }}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    <FaFootballBall className="text-xs" />
                    {isLogin ? "Sign In" : "Create Account"}
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-7 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleMode}
                className="ml-2 text-primary-600 font-bold hover:text-primary-700"
                style={{ transition: "color 180ms ease" }}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
