/**
 * One screen for both signing in and creating an account, switched by `isLogin`.
 *
 * The two modes share `FORM_FIELDS`; entries marked `signUpOnly` are dropped in
 * the sign-in case. They differ in what success means: signing in navigates to
 * the dashboard, while creating an account leaves the visitor here with a
 * message, because the address has to be verified before a session exists.
 *
 * The screen is split: the welcome on navy, the form card on paper.
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, ArrowLeft, ShieldCheck, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Field, Input, IconButton, Alert } from "@bradley-t-t/sunday-design-system";
import { useAuth } from "../../context/AuthContext";
import BrandMark from "../../components/layout/BrandMark";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";
import { actionClass } from "../../components/ui/actionClass";
import CampIcon from "../../components/ui/CampIcon";
import { CAMP_YEAR } from "../../utils/constants";

const FORM_FIELDS = [
  {
    name: "fullName",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
    icon: User,
    autoComplete: "name",
    signUpOnly: true,
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "email@example.com",
    icon: Mail,
    autoComplete: "email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "At least 6 characters",
    icon: Lock,
    minLength: 6,
  },
];

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formValues, setFormValues] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const updateField = (name) => (event) =>
    setFormValues((prev) => ({ ...prev, [name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(formValues.email, formValues.password);
        navigate("/dashboard");
      } else {
        await signUp(formValues.email, formValues.password, formValues.fullName);
        setMessage("Account created! Please check your email to verify your account.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setError("");
    setMessage("");
  };

  const visibleFields = FORM_FIELDS.filter((field) => !field.signUpOnly || !isLogin);

  return (
    <>
      <Seo {...PAGE_SEO.auth} title={isLogin ? "Sign In" : "Create Account"} />
      <div className="grid min-h-[100dvh] grid-cols-1 bg-ds-bg text-ds-text lg:grid-cols-2">
        <aside
          data-surface="navy"
          className="relative flex flex-col justify-between overflow-hidden bg-ds-bg px-5 py-8 text-ds-text sm:px-8 lg:px-16 lg:py-14"
        >
          <BrandMark size="sm" to="/" light className="relative" />
          <div className="relative py-14 lg:py-0">
            <CampIcon name={isLogin ? "helmet" : "jersey"} size={64} className="mb-8" />
            <span className="eyebrow">{isLogin ? "Locker Room" : "Roster"}</span>
            <h1 className="display mt-6 text-4xl sm:text-5xl lg:text-6xl">
              {isLogin ? "Welcome back." : "Create your account."}
            </h1>
            <p className="body-copy mt-6 max-w-md text-lg text-ds-text-muted">
              {isLogin
                ? "Sign in to view and manage your camp registrations."
                : "Join SETX Football Camp to track sign-ups and shirt orders."}
            </p>
          </div>
          <div className="relative flex items-center justify-between gap-4">
            <Link
              to="/"
              className="label-caps inline-flex min-h-control items-center gap-2 text-ds-text-muted hover:text-ds-gold"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Back to Home
            </Link>
            <span className="mono-tag text-ds-text-faint">SETX · Daisetta, TX · {CAMP_YEAR}</span>
          </div>
        </aside>

        <main
          id="main"
          tabIndex={-1}
          className="flex items-center justify-center px-5 py-12 outline-none sm:px-8 lg:px-16"
        >
          <div className="card w-full max-w-md p-7 sm:p-9">
            <h2 className="display text-3xl text-ds-text">
              {isLogin ? "Sign In" : "Create Account"}
            </h2>

            {error && (
              <Alert tone="danger" className="mt-5">
                {error}
              </Alert>
            )}
            {message && (
              <Alert tone="positive" className="mt-5">
                {message}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {visibleFields.map((field) => (
                <Field key={field.name} label={field.label} required>
                  <Input
                    name={field.name}
                    type={field.name === "password" && showPassword ? "text" : field.type}
                    value={formValues[field.name]}
                    onChange={updateField(field.name)}
                    placeholder={field.placeholder}
                    leading={<field.icon />}
                    minLength={field.minLength}
                    autoComplete={
                      field.autoComplete ?? (isLogin ? "current-password" : "new-password")
                    }
                    aria-invalid={error ? true : undefined}
                    required={field.signUpOnly ? !isLogin : true}
                    trailing={
                      field.name === "password" ? (
                        <IconButton
                          label={showPassword ? "Hide Password" : "Show Password"}
                          variant="ghost"
                          size="sm"
                          className="control"
                          onClick={() => setShowPassword((shown) => !shown)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          )}
                        </IconButton>
                      ) : undefined
                    }
                  />
                </Field>
              ))}

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className={actionClass({ size: "lg", block: true, className: "mt-2" })}
              >
                {loading ? "Working…" : isLogin ? "Sign In" : "Create Account"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between border-t-rule border-ds-border-strong pt-5">
              <span className="text-sm text-ds-text-muted">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </span>
              <button
                type="button"
                onClick={toggleMode}
                className="inline-flex min-h-control items-center gap-2 text-[15px] font-bold text-ds-accent-bright hover:underline"
              >
                {isLogin ? "Create One" : "Sign In"}{" "}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 rounded-ds-md bg-ds-bg-recessed px-3 py-3">
              <ShieldCheck className="h-4 w-4 text-ds-positive" aria-hidden="true" />
              <span className="label-caps text-ds-text-muted">
                Background-checked staff · Community-first
              </span>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AuthPage;
