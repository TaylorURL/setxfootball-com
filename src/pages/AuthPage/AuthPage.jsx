import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, ArrowLeft, ShieldCheck, ArrowRight } from "lucide-react";
import {
  Field,
  Input,
  Alert,
} from "@bradley-t-t/sunday-design-system";
import { useAuth } from "../../context/AuthContext";
import BrandMark from "../../components/brand/BrandMark";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";
import { Squares, ShinyText, Magnet } from "../../components/reactbits";

const FORM_FIELDS = [
  { name: "fullName", label: "Full Name", type: "text", placeholder: "Enter your full name", icon: User, signUpOnly: true },
  { name: "email", label: "Email Address", type: "email", placeholder: "email@example.com", icon: Mail },
  { name: "password", label: "Password", type: "password", placeholder: "••••••••", icon: Lock, minLength: 6 },
];

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formValues, setFormValues] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
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
      <div className="relative min-h-[100dvh] overflow-hidden bg-ds-bg text-ds-text">
        <div aria-hidden="true" className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-ds-accent-soft blur-[160px]" />
        <div aria-hidden="true" className="absolute -left-20 bottom-10 h-80 w-80 rounded-full bg-ds-surface-2 blur-[160px] opacity-60" />
        <Squares className="absolute inset-0 opacity-60" size={56} speed={0.2} lineColor="var(--ds-border)" />

        <div className="relative mx-auto grid min-h-[100dvh] w-full max-w-[1440px] grid-cols-1 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:px-10 lg:py-20">
          <div className="flex flex-col">
            <BrandMark size="sm" to="/" />
            <div className="mt-auto pt-16 lg:pt-0 lg:my-auto">
              <span className="mono-tag inline-flex items-center gap-3 text-ds-accent-bright">
                <span aria-hidden="true" className="inline-block h-px w-10 bg-ds-accent" />
                <ShinyText text={isLogin ? "Locker Room" : "Roster"} speed={5} />
              </span>
              <h1 className="editorial-display editorial-display-tight mt-6 text-5xl text-ds-text sm:text-6xl lg:text-7xl">
                {isLogin ? (
                  <>
                    Welcome<br />
                    <span className="text-ds-accent-bright">back.</span>
                  </>
                ) : (
                  <>
                    Create your<br />
                    <span className="text-ds-accent-bright">account.</span>
                  </>
                )}
              </h1>
              <p className="editorial-body mt-6 max-w-md text-lg text-ds-text-muted">
                {isLogin
                  ? "Sign in to view and manage your camp registrations."
                  : "Join SETX Football Camp — track sign-ups and shirt orders."}
              </p>
            </div>
          </div>

          <div className="mt-12 flex items-center lg:mt-0">
            <div className="relative w-full max-w-md border border-ds-border bg-ds-surface p-7 sm:p-10">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-ds-accent" />

              <h2 className="editorial-display text-2xl text-ds-text">
                {isLogin ? "Sign in" : "Create account"}
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

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                {visibleFields.map((field) => (
                  <Field key={field.name} label={field.label} required>
                    <Input
                      name={field.name}
                      type={field.type}
                      value={formValues[field.name]}
                      onChange={updateField(field.name)}
                      placeholder={field.placeholder}
                      leading={<field.icon />}
                      minLength={field.minLength}
                      required={field.signUpOnly ? !isLogin : true}
                    />
                  </Field>
                ))}

                <Magnet className="!flex w-full" padding={70} strength={0.25}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="mono-tag mt-3 flex w-full items-center justify-center gap-2 border border-ds-accent bg-ds-accent px-5 py-4 text-white transition-colors duration-200 hover:bg-ds-accent-bright hover:border-ds-accent-bright disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Working…" : isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Magnet>
              </form>

              <div className="mt-6 flex items-center justify-between border-t border-ds-border pt-5">
                <span className="text-sm text-ds-text-muted">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </span>
                <button
                  type="button"
                  onClick={toggleMode}
                  className="mono-tag-sm inline-flex items-center gap-1.5 text-ds-accent-bright hover:text-ds-accent"
                >
                  {isLogin ? "Sign Up" : "Sign In"} <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 border border-ds-border bg-ds-surface-2 px-3 py-3">
                <ShieldCheck className="h-3.5 w-3.5 text-ds-accent-bright" />
                <span className="mono-tag-sm text-ds-text-muted">
                  Background-checked staff · Community-first
                </span>
              </div>
            </div>
          </div>

          <div className="col-span-full mt-10 flex items-center justify-between border-t border-ds-border pt-6">
            <Link
              to="/"
              className="mono-tag-sm inline-flex items-center gap-2 text-ds-text-muted hover:text-ds-text"
            >
              <ArrowLeft className="h-3 w-3" /> Back to Home
            </Link>
            <span className="mono-tag-sm text-ds-text-faint">
              SETX · Daisetta, TX · 2026
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
