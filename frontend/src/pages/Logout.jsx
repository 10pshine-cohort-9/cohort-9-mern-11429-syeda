
import { useEffect } from "react";
import { logoutUser } from "../services/authService";
import "./Logout.css";

const Logout = ({ onLogout }) => {
  useEffect(() => {
    // Remove token and user from localStorage
    logoutUser();

    // Go back to login
    if (onLogout) {
      onLogout();
    }
  }, [onLogout]);

  return (
    <div className="logout-page">
      <div className="logout-card">
        <div className="logout-icon">✓</div>

        <h1>You've been logged out</h1>

        <p>
          Your account has been safely logged out.
        </p>

        <button
          type="button"
          onClick={onLogout}
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
};

export default Logout;