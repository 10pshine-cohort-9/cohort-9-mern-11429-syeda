
import { useEffect } from "react";
import "./Logout.css";

import { logoutUser } from "../services/authService";

const Logout = ({ onLogout }) => {
  useEffect(() => {
    logoutUser();
  }, []);

  const handleConfirmLogout = () => {
    onLogout();
  };

  return (
    <div className="logout-page">
      <div className="logout-card">
        <div className="logout-icon">
          N
        </div>

        <h1>Ready to leave?</h1>

        <p>
          Your local authentication session has
          been cleared.
        </p>

        <button
          type="button"
          className="logout-button"
          onClick={handleConfirmLogout}
        >
          Continue to Login
        </button>
      </div>
    </div>
  );
};

export default Logout;