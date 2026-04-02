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

const INPUT_CLASS =
  "w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 focus:bg-white transition-all duration-200";

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

const AlertBanner = ({ variant, icon: Icon, children }) => {
  const styles = {
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
  };
  const iconColors = { error: "text-red-400", success: "text-emerald-500" };

  return (
    <div
      className={`mb-6 p-3.5 border rounded-xl text-sm flex items-start gap-2.5 ${styles[variant]}`}
    >
      <Icon className={`${iconColors[variant]} mt-0.5 shrink-0`} />
      <span>{children}</span>
    </div>
  );
};

const FormField = ({ field, value, onChange, isLogin }) => {
  const Icon = field.icon;
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
        {field.label}
      </label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input
          type={field.type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.signUpOnly ? !isLogin : true}
          minLength={field.minLength}
          className={INPUT_CLASS}
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
    <div className="min-h-screen bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-400 to-primary-500" />

      <div className="absolute top-10 right-20 w-72 h-72 bg-accent-400 rounded-full filter blur-3xl opacity-10 hidden sm:block" />
      <div className="absolute bottom-10 left-20 w-96 h-96 bg-white rounded-full filter blur-3xl opacity-5 hidden sm:block" />

      <div className="w-full max-w-md animate-fade-in">
        <Link
          to="/"
          className="inline-flex items-center text-white/70 hover:text-white mb-4 sm:mb-8 transition-all duration-200 text-sm font-medium"
        >
          <FaArrowLeft className="mr-2 text-xs" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
                <img
                  src={logo}
                  alt="SETX Football Camp"
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {isLogin ? "Welcome Back!" : "Create Account"}
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
                className="w-full bg-gradient-to-r from-accent-500 to-accent-600 text-white py-3 rounded-xl text-sm font-semibold hover:from-accent-600 hover:to-accent-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg hover:shadow-accent-500/20 hover:scale-[1.01]"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    <FaFootballBall className="mr-2 text-xs" />
                    {isLogin ? "Sign In" : "Create Account"}
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleMode}
                className="ml-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors duration-200"
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
