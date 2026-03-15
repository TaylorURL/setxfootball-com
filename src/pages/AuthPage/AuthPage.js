import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaFootballBall,
  FaArrowLeft,
} from "react-icons/fa";
import logo from "../../assets/logo.PNG";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        navigate("/dashboard");
      } else {
        await signUp(email, password, fullName);
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
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-400 to-primary-500"></div>

      <div className="absolute top-10 right-20 w-72 h-72 bg-accent-400 rounded-full filter blur-3xl opacity-10 hidden sm:block"></div>
      <div className="absolute bottom-10 left-20 w-96 h-96 bg-white rounded-full filter blur-3xl opacity-5 hidden sm:block"></div>

      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center text-white/80 hover:text-white mb-4 sm:mb-8 transition-colors text-sm sm:text-base"
        >
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <img
                  src={logo}
                  alt="SETX Football Camp"
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {isLogin ? "Welcome Back!" : "Create Account"}
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              {isLogin
                ? "Sign in to access your dashboard"
                : "Join SETX Football Camp"}
            </p>
          </div>

          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs sm:text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {!isLogin && (
              <div className="group">
                <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                    className="w-full pl-10 sm:pl-12 pr-4 sm:pr-5 py-3 sm:py-4 rounded-xl border-2 border-gray-200 bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 text-gray-800 font-medium placeholder-gray-400 text-sm sm:text-base"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div className="group">
              <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 sm:pl-12 pr-4 sm:pr-5 py-3 sm:py-4 rounded-xl border-2 border-gray-200 bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 text-gray-800 font-medium placeholder-gray-400 text-sm sm:text-base"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 sm:pl-12 pr-4 sm:pr-5 py-3 sm:py-4 rounded-xl border-2 border-gray-200 bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 text-gray-800 font-medium placeholder-gray-400 text-sm sm:text-base"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-accent-500 to-accent-600 text-white py-3 sm:py-4 rounded-xl text-base sm:text-lg font-bold hover:from-accent-600 hover:to-accent-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-accent-500/30 transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <FaFootballBall className="mr-2" />
                  {isLogin ? "Sign In" : "Create Account"}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-gray-600 text-sm sm:text-base">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleMode}
                className="ml-2 text-primary-600 font-bold hover:text-primary-700 transition-colors"
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
