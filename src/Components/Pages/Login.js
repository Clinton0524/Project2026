import React, { useContext, useEffect } from "react";
import { myContext } from "../Context/Context";
import { useNavigate } from "react-router-dom";
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginInfo.email || !loginInfo.password) {
      setError("Please fill all fields");
      return;
    }

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
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <div className="register-left">
          <h2>Welcome Back!</h2>
          <p>Login to continue shopping</p>
        </div>

        <div className="register-right">
          <h3 className="register-text">Login</h3>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={loginInfo.email || ""}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                value={loginInfo.password || ""}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>

            <button type="submit">
              Login
            </button>
          </form>

          <p className="login-text">
            Don't have an account?{" "}
            <a href="/register">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;