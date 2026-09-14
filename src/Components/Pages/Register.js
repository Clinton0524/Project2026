
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { myContext } from "../Context/Context";
import "../Css/Register.css";
import Image from "../Images/Pink and Blue Playful Kids Clothing Store Logo.png";
const Register = () => {
  const {
    register,
    setRegister,
    error,
    setError,
    registerUser,
  } = useContext(myContext);

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setRegister({
      ...register,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Check required fields
    if (
      !register.name ||
      !register.email ||
      !register.password ||
      !register.confirmPassword
    ) {
      setError("Enter all fields");
      return;
    }

    // Password length
    if (register.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Confirm password
    if (register.password !== register.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(register.email)) {
      setError("Enter a valid email");
      return;
    }

    try {
      setLoading(true);

      const result = await registerUser(
        register.name,
        register.email,
        register.password
      );

      if (result.success) {
        alert("Registration successful!");

        setRegister({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        navigate("/");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-wrapper">

        {/* ================= LEFT BRAND SECTION ================= */}
        <div className="register-brand">

          <div className="register-brand-content">

            <img className="register-brand-logo" src={Image}/>
              
            

            <h1>
              Join Our Family!
            </h1>

            <p>
              Create your account and enjoy a
              simple and convenient shopping experience.
            </p>

            <div className="register-features">

              <div className="register-feature">
                <span>✓</span>
                <p>Quick and easy registration</p>
              </div>

              <div className="register-feature">
                <span>✓</span>
                <p>Discover amazing products</p>
              </div>

              <div className="register-feature">
                <span>✓</span>
                <p>Enjoy exclusive offers</p>
              </div>

            </div>

          </div>

        </div>

        {/* ================= RIGHT FORM SECTION ================= */}
        <div className="register-form-section">

          <div className="register-form-container">

            {/* Mobile Logo */}
          

            <h2>
              Create Account
            </h2>

            <p className="register-subtitle">
              Sign up to get started with us
            </p>

            {/* Error Message */}
            {error && (
              <div className="register-error">
                <span>!</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* FULL NAME */}
              <div className="register-input-group">

                <label htmlFor="register-name">
                  Full Name
                </label>

                <div className="register-input-wrapper">

                  <span className="register-input-icon">
                    👤
                  </span>

                  <input
                    id="register-name"
                    type="text"
                    name="name"
                    value={register.name || ""}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />

                </div>

              </div>

              {/* EMAIL */}
              <div className="register-input-group">

                <label htmlFor="register-email">
                  Email Address
                </label>

                <div className="register-input-wrapper">

                  <span className="register-input-icon">
                    ✉
                  </span>

                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    value={register.email || ""}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />

                </div>

              </div>

              {/* PASSWORD */}
              <div className="register-input-group">

                <label htmlFor="register-password">
                  Password
                </label>

                <div className="register-input-wrapper">

                  <span className="register-input-icon">
                    🔒
                  </span>

                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={register.password || ""}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

              </div>

              {/* CONFIRM PASSWORD */}
              <div className="register-input-group">

                <label htmlFor="register-confirm-password">
                  Confirm Password
                </label>

                <div className="register-input-wrapper">

                  <span className="register-input-icon">
                    🔐
                  </span>

                  <input
                    id="register-confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={register.confirmPassword || ""}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>

                </div>

              </div>

              {/* REGISTER BUTTON */}
              <button
                type="submit"
                className="register-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="register-spinner"></span>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <span className="register-arrow">
                      →
                    </span>
                  </>
                )}
              </button>

            </form>

            {/* DIVIDER */}
            <div className="register-divider">
              <span>OR</span>
            </div>

            {/* LOGIN LINK */}
            <p className="register-login-text">
              Already have an account?
              <Link to="/login">
                Login
              </Link>
            </p>

            {/* HOME LINK */}
            <Link to="/" className="register-back-home">
              ← Back to shopping
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;