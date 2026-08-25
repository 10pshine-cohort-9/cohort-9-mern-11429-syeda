
import { useState } from "react";
import { loginUser } from "../services/authService";
import "./Login.css";

const Login = ({ onSignup, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await loginUser(formData);

      console.log("Login successful:", data);

      onLoginSuccess(data);

    } catch (error) {
      console.error(error);
      setError(error.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* LEFT SIDE */}
        <div className="auth-visual">

          <div className="visual-logo">
            N
          </div>

          <h1>
            Your ideas.
            <br />
            Your notes.
            <br />
            Your space.
          </h1>

          <p>
            A simple and secure place to organize
            your thoughts and ideas.
          </p>

          <div className="visual-decoration">
            <span>✦</span>
            <span>✓</span>
            <span>✎</span>
          </div>

        </div>


        {/* RIGHT SIDE */}
        <div className="auth-form-container">

          <div className="auth-form">

            <div className="mobile-logo">
              N
            </div>

            <span className="form-label">
              WELCOME BACK
            </span>

            <h2>
              Sign in
            </h2>

            <p className="form-subtitle">
              Sign in to continue to your Notes workspace.
            </p>


            {error && (
              <div className="error-message">
                {error}
              </div>
            )}


            <form onSubmit={handleSubmit}>

              <div className="form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />

              </div>


              <div className="form-group">

                <label>
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />

              </div>


              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

            </form>


            <div className="auth-switch">

              <span>
                Don't have an account?
              </span>

              <button
                type="button"
                onClick={onSignup}
              >
                Create account
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;