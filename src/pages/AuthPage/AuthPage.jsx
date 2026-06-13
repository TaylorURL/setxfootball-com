/**
 * AuthPage — login / signup for SETX Football Camp.
 *
 * A focused, theme-aware auth screen built on the design system's
 * CenteredLayout + Card + Field form primitives.
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import {
  CenteredLayout,
  Card,
  Field,
  Input,
  Button,
  Alert,
  Heading,
  Text,
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
    <span className="inline-flex h-16 w-16 items-center justify-center rounded-ds-xl bg-ds-surface-2 ring-1 ring-ds-border-strong">
      <img src={logo} alt="SETX Football Camp" className="h-11 w-11 object-contain" />
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
          className="inline-flex items-center gap-1.5 text-ds-text-muted transition-colors duration-150 ease-ds-out hover:text-ds-text"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
        </Link>
      }
    >
      <Card variant="elevated" padding="lg">
        <div className="mb-6 text-center">
          <Heading level={1}>{isLogin ? "Welcome back" : "Create account"}</Heading>
          <Text tone="muted" className="mt-2">
            {isLogin ? "Sign in to access your dashboard" : "Join SETX Football Camp"}
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

          <Button type="submit" variant="primary" size="lg" block loading={loading} className="mt-2">
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
      </Card>
    </CenteredLayout>
  );
};

export default AuthPage;
