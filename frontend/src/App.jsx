
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";

import {
  getStoredUser,
  getToken,
  logoutUser,
} from "./services/authService";

const API_URL =
  `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth`;

function App() {
  const [user, setUser] = useState(null);
  const [authPending, setAuthPending] = useState(true);
  const [page, setPage] = useState("login");

  useEffect(() => {
    const validateSession = async () => {
      const token = getToken();

      if (!token) {
        setUser(null);
        setAuthPending(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Session validation failed");
        }

        const data = await response.json();

        if (!data.user) {
          throw new Error("User session is invalid");
        }

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setUser(data.user);
        setPage("dashboard");
      } catch (error) {
        logoutUser();
        setUser(null);
        setPage("login");
      } finally {
        setAuthPending(false);
      }
    };

    validateSession();
  }, []);

  const handleLoginSuccess = (data) => {
    setUser(data.user);
    setPage("dashboard");
  };

  const handleSignupSuccess = (data) => {
    setUser(data.user);
    setPage("dashboard");
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setPage("login");
  };

  if (authPending) {
    return (
      <div className="app-loading">
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (page === "signup") {
    return (
      <Signup
        onSignupSuccess={handleSignupSuccess}
        onLogin={() => setPage("login")}
      />
    );
  }

  if (page === "logout") {
    return (
      <Logout
        onLogout={handleLogout}
      />
    );
  }

  if (user && page === "dashboard") {
    return (
      <Dashboard
        user={user}
        onLogout={() => setPage("logout")}
      />
    );
  }

  return (
    <Login
      onLoginSuccess={handleLoginSuccess}
      onSignup={() => setPage("signup")}
    />
  );
}

export default App;