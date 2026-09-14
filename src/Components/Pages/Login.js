import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { myContext } from "../Context/Context";
import "../Css/Login.css";

const Login = () => {
  const {
    loginInfo,
    setLoginInfo,
    error,
    setError,
    currentUser,
    loginUser,
  } = useContext(myContext);

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setLoginInfo({
      ...loginInfo,
      [e.target.name]: e.target.value,
    });

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginInfo.email || !loginInfo.password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await loginUser(
        loginInfo.email,
        loginInfo.password
      );

      if (result.success) {
        setLoginInfo({
          email: "",
          password: "",
        });

        navigate("/");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-wrapper">

        {/* ================= LEFT SIDE ================= */}
        <div className="login-brand">

          <div className="brand-content">

            <div className="brand-logo">
              🛒
            </div>

            <h1>
              Welcome Back!
            </h1>

            <p>
              Login to your account and continue
              shopping with us.
            </p>

            <div className="brand-features">

              <div className="brand-feature">
                <span>✓</span>
                <p>Easy and secure shopping</p>
              </div>

              <div className="brand-feature">
                <span>✓</span>
                <p>Track your orders easily</p>
              </div>

              <div className="brand-feature">
                <span>✓</span>
                <p>Exclusive deals and offers</p>
              </div>

            </div>

          </div>

        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="login-form-section">

          <div className="login-form-container">

          
            <h2>Login</h2>

            <p className="login-subtitle">
              Enter your details to access your account
            </p>

            {error && (
              <div className="login-error">
                <span>!</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* EMAIL */}
              <div className="login-input-group">

                <label htmlFor="email">
                  Email Address
                </label>

                <div className="login-input-wrapper">

                  <span className="input-icon">
                    ✉
                  </span>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={loginInfo.email || ""}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />

                </div>

              </div>

              {/* PASSWORD */}
              <div className="login-input-group">

                <label htmlFor="password">
                  Password
                </label>

                <div className="login-input-wrapper">

                  <span className="input-icon">
                    🔒
                  </span>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginInfo.password || ""}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

              </div>

              {/* FORGOT PASSWORD */}
              <div className="login-options">

                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() =>
                    setError("Password reset feature coming soon.")
                  }
                >
                  Forgot password?
                </button>

              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="login-spinner"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                    <span className="login-arrow">→</span>
                  </>
                )}
              </button>

            </form>

            <div className="login-divider">
              <span>OR</span>
            </div>

            <p className="register-account">
              Don't have an account?
              <Link to="/register">
                Create an account
              </Link>
            </p>

            <Link to="/" className="back-home">
              ← Back to shopping
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;