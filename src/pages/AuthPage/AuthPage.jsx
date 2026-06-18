/**
 * AuthPage — login / signup for SETX Football Camp.
 *
 * A focused, theme-aware auth screen with a varsity brand mark and a small
 * trust strip beneath the form. Built on design-system CenteredLayout + Card
 * + Field primitives.
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, ArrowLeft, ShieldCheck } from "lucide-react";
import {
  CenteredLayout,
  Card,
  Field,
  Input,
  Button,
  Alert,
  Text,
  Eyebrow,
} from "@bradley-t-t/sunday-design-system";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.PNG";

const FORM_FIELDS = [
  { name: "fullName", label: "Full Name", type: "text", placeholder: "Enter your full name", icon: User, signUpOnly: true },
  { name: "email", label: "Email Address", type: "email", placeholder: "email@example.com", icon: Mail },
  { name: "password", label: "Password", type: "password", placeholder: "••••••••", icon: Lock, minLength: 6 },
];

const Brand = () => (
  <Link to="/" className="flex flex-col items-center gap-3" aria-label="SETX Football home">
    <span className="relative inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-ds-xl bg-ds-accent shadow-[0_10px_30px_-14px_rgba(191,10,48,0.7)] ring-1 ring-white/15">
      <img src={logo} alt="SETX Football Camp" className="h-12 w-12 object-contain" />
    </span>
    <span className="text-center">
      <span className="block text-[15px] font-black uppercase tracking-[0.08em] text-ds-text">
        SETX Football
      </span>
      <span className="mt-1 inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.24em] text-ds-text-muted">
        <span className="inline-block h-0.5 w-3 bg-ds-accent" />
        Youth Camp · Daisetta TX
      </span>
    </span>
  </Link>
);

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
    <CenteredLayout
      width="md"
      brand={<Brand />}
      footer={
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-ds-text-muted transition-colors duration-150 ease-ds-out hover:text-ds-accent-bright"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
        </Link>
      }
    >
      <Card variant="elevated" padding="lg" className="relative overflow-hidden">
        <span aria-hidden="true" className="sideline-stripes absolute inset-x-0 top-0 h-1.5 opacity-90" />

        <div className="mb-7 text-center">
          <Eyebrow strong className="text-ds-accent-bright">
            {isLogin ? "Locker Room" : "Roster"}
          </Eyebrow>
          <h1 className="heading-stencil heading-stencil-tight mt-2 text-4xl text-ds-text sm:text-5xl">
            {isLogin ? "Welcome back." : "Create account."}
          </h1>
          <Text tone="muted" className="mt-2">
            {isLogin
              ? "Sign in to view and manage your camp registrations."
              : "Join SETX Football Camp — track sign-ups and shirt orders."}
          </Text>
        </div>

        {error && (
          <Alert tone="danger" className="mb-4">
            {error}
          </Alert>
        )}
        {message && (
          <Alert tone="positive" className="mb-4">
            {message}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            block
            loading={loading}
            className="mt-2 font-bold uppercase tracking-[0.08em]"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 border-t border-ds-border pt-5 text-center">
          <Text size="sm" tone="muted" as="span">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </Text>{" "}
          <Button variant="link" size="sm" className="px-1 align-baseline" onClick={toggleMode}>
            {isLogin ? "Sign Up" : "Sign In"}
          </Button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 rounded-ds-md border border-ds-border bg-ds-surface-2 px-3 py-2.5">
          <ShieldCheck className="h-3.5 w-3.5 text-ds-accent-bright" />
          <Text size="xs" tone="muted" className="uppercase tracking-[0.12em]">
            Background-checked staff · Community-first camp
          </Text>
        </div>
      </Card>
    </CenteredLayout>
  );
};

export default AuthPage;
