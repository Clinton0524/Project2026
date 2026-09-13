import React, { useContext } from "react";
import { myContext } from "../Context/Context";
import { useNavigate } from "react-router-dom";
import "../Css/Register.css";

const Register = () => {
  const {
    register,
    setRegister,
    error,
    setError,
    registerUser,
  } = useContext(myContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setRegister({
      ...register,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error
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
      const result = await registerUser(
        register.name,
        register.email,
        register.password
      );

      if (result.success) {
        alert("Registration successful!.");

        setRegister({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        navigate("/");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">

        {/* Left panel */}
        <div className="register-left">
          <h2>Welcome!</h2>
          <p>Create an account to start shopping</p>
        </div>

        {/* Right panel */}
        <div className="register-right">
          <h3 className="register-text">Register</h3>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={register.name || ""}
                onChange={handleChange}
                placeholder="Enter full name"
              />
            </div>

            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={register.email || ""}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                value={register.password || ""}
                onChange={handleChange}
                placeholder="Enter password"
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                value={register.confirmPassword || ""}
                onChange={handleChange}
                placeholder="Confirm password"
              />
            </div>

            <button type="submit">
              Register
            </button>

          </form>

          <p className="login-text">
            Already have an account?{" "}
            <a href="/login">Login</a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;