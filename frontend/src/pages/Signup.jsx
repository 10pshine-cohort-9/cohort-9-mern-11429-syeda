
import { useState } from "react";
import { signupUser } from "../services/authService";
import "./Signup.css";

const Signup = ({ onLogin, onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await signupUser(formData);

      console.log("Signup successful:", data);

      /*
       * Signup endpoint may only create account.
       * In that case send user to login.
       */
      if (data.token && data.user) {
        onSignupSuccess(data);
      } else {
        onLogin();
      }

    } catch (error) {
      console.error("SIGNUP ERROR:", error);
      setError(error.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">

      <div className="signup-card">

        <div className="signup-logo">
          N
        </div>

        <span className="signup-label">
          GET STARTED
        </span>

        <h1>
          Create your account
        </h1>

        <p className="signup-subtitle">
          Create your account and start using your
          personal Notes workspace.
        </p>


        {error && (
          <div className="signup-error">
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          <div className="signup-field">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
            />

          </div>


          <div className="signup-field">

            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />

          </div>


          <div className="signup-field">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
            />

          </div>


          <div className="signup-field">

            <label>
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

          </div>


          <button
            type="submit"
            className="signup-button"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>

        </form>


        <div className="signup-switch">

          <span>
            Already have an account?
          </span>

          <button
            type="button"
            onClick={onLogin}
          >
            Sign in
          </button>

        </div>

      </div>

    </div>
  );
};

export default Signup;