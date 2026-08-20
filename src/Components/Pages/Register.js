import React, { useContext } from "react";
import { myContext } from "../Context/Context";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../Firebase/Firebase";
import "../Css/Register.css"; // Reuse the same CSS for styling


const Register = () => {
  const { register, setRegister, error, setError } = useContext(myContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setRegister({ ...register, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !register.name ||
      !register.email ||
      !register.password ||
      !register.confirmPassword
    ) {
      setError("Enter all fields");
      return;
    }
    if (register.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (register.password !== register.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(register.email)) {
      setError("Enter a valid email");
      return;
    }
    setError("");
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        register.email,
        register.password
      );
      await updateProfile(userCredentials.user, { displayName: register.name });
      await sendEmailVerification(userCredentials.user);
      alert(
        `Registration successful! Please check ${userCredentials.user.email} to verify.`
      );
      navigate("/login");
    } catch (err) {
      setError(err.message);
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

        {/* Right panel - Form */}
        <div className="register-right">
          <h3>Register</h3>
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

            <button type="submit">Register</button>
          </form>

          <p className="login-text">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
