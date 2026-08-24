
import { useState } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import Dashboard from "./pages/Dashboard";

import {
  getStoredUser,
  logoutUser,
} from "./services/authService";

import "./App.css";

function App() {
  const storedUser = getStoredUser();

  const [user, setUser] = useState(storedUser);

  const [page, setPage] = useState(
    storedUser ? "dashboard" : "login"
  );

  // =========================
  // LOGIN SUCCESS
  // =========================
  const handleLoginSuccess = (data) => {
    console.log("Login successful:", data);

    if (data.user) {
      setUser(data.user);
      setPage("dashboard");
    }
  };

  // =========================
  // SIGNUP SUCCESS
  // =========================
  const handleSignupSuccess = (data) => {
    console.log("Signup successful:", data);

    if (data.user) {
      setUser(data.user);
      setPage("dashboard");
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    logoutUser();

    setUser(null);
    setPage("login");
  };

  // =========================
  // SIGNUP
  // =========================
  if (page === "signup") {
    return (
      <Signup
        onLogin={() => setPage("login")}
        onSignupSuccess={handleSignupSuccess}
      />
    );
  }

  // =========================
  // LOGOUT
  // =========================
  if (page === "logout") {
    return (
      <Logout
        onLogout={handleLogout}
      />
    );
  }

  // =========================
  // DASHBOARD
  // =========================
  if (page === "dashboard" && user) {
    return (
      <Dashboard
        user={user}
        onLogout={() => setPage("logout")}
      />
    );
  }

  // =========================
  // LOGIN
  // =========================
  return (
    <Login
      onSignup={() => setPage("signup")}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}

export default App;