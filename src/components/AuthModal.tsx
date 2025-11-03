"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { X, Eye, EyeOff } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import GirlPoster from "../assets/Girl_Poster.png"
import type { AuthResult } from "../types/User"

const AuthModal: React.FC<any> = ({ isOpen, onClose, onSuccess, initialMode }) => {
  const { login, signup, resetPassword, confirmResetPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams() // to get token if exists in URL

  const [mode, setMode] = useState<"login" | "signup" | "forgot" | "reset">("signup")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const slideAnim = mode === "signup" ? "animate-slideInRight" : "animate-slideInLeft"

  // Detect reset token in URL or initialMode
  useEffect(() => {
    const path = location.pathname
    if (path.includes("/reset-password/")) {
      setMode("reset")
    }
  }, [location])

  // Auto-clear success message after 10 seconds
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => {
        setErrorMsg('');
      }, 5000); // 10 seconds

      return () => clearTimeout(timer); // Cleanup on unmount or when successMsg changes
    }
  }, [errorMsg]);

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setIsClosing(false)
      setEmail("")
      setName("")
      setPassword("")
      setErrorMsg("")
      setSuccessMsg("")
      setShowPassword(false)
      if (initialMode) setMode(initialMode)
    }
  }, [isOpen, initialMode])

  const handleEmailVerification = async (token: string) => {
    if (!token) {
      setVerifyStatus('error');
      setErrorMsg('Invalid verification link. No token provided.');
      return;
    }

    setVerifyStatus('loading');
    try {
      const result = await verifyEmail(token);

      if (result.success) {
        setVerifyStatus('success');
        setSuccessMsg('Email verified successfully! Redirecting to login...');

        // Wait 2 seconds before redirecting and closing modal
        setTimeout(() => {
          setMode('login');
          setVerifyStatus('loading'); // Reset verify status
          setSuccessMsg('Your email has been verified. Please login to continue.');
        }, 2000);
      } else {
        setVerifyStatus('error');
        setErrorMsg(result.message || 'Email verification failed. The link may be invalid or expired.');
      }
    } catch (error: any) {
      setVerifyStatus('error');
      setErrorMsg(error.response?.data?.message || 'Something went wrong during verification.');
    }
  };

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")

    setLoading(true)
    try {
      let result: AuthResult = { success: false }

      if (mode === "signup") {
        result = await signup(name, email, password, "student")
      } else if (mode === "login") {
        result = await login(email, password)
      } else if (mode === "forgot") {
        await resetPassword(email)
        setSuccessMsg("Password reset link sent! Please check your email.")
        setMode("login")
        setLoading(false)
        return
      } else if (mode === "reset") {
        const token = location.pathname.split("/").pop()
        await confirmResetPassword(token!, password)
        setSuccessMsg("Password reset successful! Redirecting to login...")
        setTimeout(() => {
          navigate("/")
          setMode("login")
        }, 2000)
        setLoading(false)
        return
      }
      if (result.success && result.user) {
        onSuccess()
        handleClose()
        if (result.user.user_type === "admin") navigate("/admin")
        else navigate("/dashboard")
      } else if (mode === "login" || mode === "signup") {
        setErrorMsg(result.message || `${mode === "signup" ? "Signup" : "Login"} failed.`)
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Something went wrong.")
    }
    setLoading(false)
  }

  if (!isVisible) return null

  return (
    <div
    className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-3 sm:px-4 md:px-6 transition-opacity duration-300 ease-out ${
      isClosing ? "opacity-0" : "opacity-100"
    }`}
    onClick={handleClose} 
  >
    {/* MODAL PANEL */}
    <div
      className={`bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-5xl flex flex-col lg:flex-row overflow-hidden relative transform transition-all duration-500 ease-in-out ${
        isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
      }`}
      onClick={(e) => e.stopPropagation()} // ✅ prevent inside clicks from closing
    >
        {/* Left Panel */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-teal-600/90 z-10" />
          <img
            src={GirlPoster || "/placeholder.svg"}
            alt="Join Community"
            className="w-full h-full object-cover object-top"
          />
          <div
            key={mode}
            className={`absolute inset-0 z-20 flex flex-col justify-center items-center text-white px-6 sm:px-8 py-8 sm:py-12 text-center space-y-4 sm:space-y-6 ${slideAnim}`}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold leading-tight">
              {mode === "signup" ? "Join the Future of" : mode === "reset" ? "Secure Your Account" : "Welcome Back to"}
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Academic Success
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg xl:text-xl text-blue-100 leading-relaxed">
              {mode === "reset"
                ? "Set a new password to regain access to your account."
                : "Access your projects, connect, and grow together."}
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-1/2 px-4 py-6 sm:px-8 sm:py-10 md:px-10 relative">
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent backdrop trigger
              handleClose();
            }}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>


          <div className="max-w-md mx-auto">
            <div key={mode} className={`text-center mb-4 sm:mb-6 md:mb-8 ${slideAnim}`}>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 capitalize">
                {mode === "reset"
                  ? "Reset Password"
                  : mode === "forgot"
                    ? "Forgot Password"
                    : mode === "signup"
                      ? "Create Account"
                      : "Login"}
              </h2>
            </div>

            <form onSubmit={handleAuthSubmit} className={`space-y-3 sm:space-y-4 md:space-y-6 ${slideAnim}`}>
              {/* SIGNUP ONLY */}
              {mode === "signup" && (
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-4 border rounded-lg sm:rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>
              )}

              {/* EMAIL FIELD */}
              {mode !== "reset" && (
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-4 border rounded-lg sm:rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>
              )}

              {/* PASSWORD FIELD */}
              {mode !== "forgot" && (
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    {mode === "reset" ? "New Password" : "Password"}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === "reset" ? "Enter new password" : "Enter your password"}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-4 pr-10 sm:pr-12 border rounded-lg sm:rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                  {mode === "login" && (
                    <div className="text-right mt-1.5 sm:mt-2">
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-xs sm:text-sm text-blue-600 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ERROR / SUCCESS MESSAGE */}
              {(errorMsg || successMsg) && (
                <div
                  className={`p-2 sm:p-3 text-xs sm:text-sm rounded-lg sm:rounded-xl font-medium ${successMsg
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-600"
                    }`}
                >
                  {errorMsg || successMsg}
                </div>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold rounded-lg sm:rounded-xl shadow-lg hover:scale-105 disabled:opacity-70 text-sm sm:text-base"
              >
                {loading
                  ? "Please wait..."
                  : mode === "signup"
                    ? "Create Account"
                    : mode === "login"
                      ? "Login"
                      : mode === "forgot"
                        ? "Send Reset Link"
                        : "Reset Password"}
              </button>

              {/* NAVIGATION */}
              {mode === "forgot" && (
                <div className="text-xs sm:text-sm text-center mt-3 sm:mt-4">
                  <button type="button" onClick={() => setMode("login")} className="text-blue-600 hover:underline">
                    Back to Login
                  </button>
                </div>
              )}
              {/* NAVIGATION BETWEEN LOGIN & SIGNUP */}
              {(mode === "login" || mode === "signup") && (
                <div className="text-xs sm:text-sm text-center mt-3 sm:mt-4">
                  {mode === "login" ? (
                    <p className="text-gray-600">
                      Don’t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("signup")}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Sign up
                      </button>
                    </p>
                  ) : (
                    <p className="text-gray-600">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Log in
                      </button>
                    </p>
                  )}
                </div>
              )}

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
