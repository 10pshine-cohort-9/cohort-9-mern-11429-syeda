
import { useState } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";

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

  /*
   * =========================
   * LOGIN SUCCESS
   * =========================
   */
  const handleLoginSuccess = (data) => {
    console.log("Login successful:", data);

    if (data.user) {
      setUser(data.user);
      setPage("dashboard");
    }
  };

  /*
   * =========================
   * SIGNUP SUCCESS
   * =========================
   */
  const handleSignupSuccess = (data) => {
    console.log("Signup successful:", data);

    if (data.user) {
      setUser(data.user);
      setPage("dashboard");
    }
  };

  /*
   * =========================
   * LOGOUT
   * =========================
   */
  const handleLogout = () => {
    logoutUser();

    setUser(null);
    setPage("login");
  };

  /*
   * =========================
   * SIGNUP PAGE
   * =========================
   */
  if (page === "signup") {
    return (
      <Signup
        onLogin={() => setPage("login")}
        onSignupSuccess={handleSignupSuccess}
      />
    );
  }

  /*
   * =========================
   * LOGOUT PAGE
   * =========================
   */
  if (page === "logout") {
    return (
      <Logout
        onLogout={handleLogout}
      />
    );
  }

  /*
   * =========================
   * DASHBOARD
   * =========================
   */
  if (page === "dashboard" && user) {
    return (
      <div className="dashboard-page">

        {/* HEADER */}
        <header className="dashboard-header">

          <div className="brand">
            <div className="brand-logo">
              N
            </div>

            <span>Notes</span>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={() => setPage("logout")}
          >
            Logout
          </button>

        </header>


        {/* MAIN */}
        <main className="dashboard-main">

          <section className="hero-section">

            <div className="hero-text">

              <span className="dashboard-label">
                YOUR WORKSPACE
              </span>

              <h1>
                Welcome back,
                <br />

                <span>
                  {user.name}
                </span>{" "}
                👋
              </h1>

              <p>
                Your personal space for capturing ideas,
                organizing thoughts, and keeping your notes
                in one place.
              </p>

            </div>


            <div className="hero-decoration">

              <div className="floating-note note-one">
                ✦
              </div>

              <div className="floating-note note-two">
                ✓
              </div>

              <div className="hero-logo">
                N
              </div>

            </div>

          </section>


          {/* CARDS */}
          <section className="dashboard-cards">

            {/* PROFILE */}
            <div className="dashboard-card">

              <div className="card-top">

                <div className="card-icon">
                  👤
                </div>

                <span className="card-status">
                  ● Active
                </span>

              </div>

              <h2>
                Your Profile
              </h2>

              <div className="profile-info">

                <div>
                  <small>
                    Name
                  </small>

                  <strong>
                    {user.name}
                  </strong>
                </div>


                <div>
                  <small>
                    Email
                  </small>

                  <strong>
                    {user.email}
                  </strong>
                </div>

              </div>

            </div>


            {/* NOTES */}
            <div className="dashboard-card">

              <div className="card-icon">
                📝
              </div>

              <h2>
                Your Notes
              </h2>

              <p>
                Your notes workspace is ready.
                Notes functionality can be added here.
              </p>

              <button
                type="button"
                className="notes-button"
                disabled
              >
                + Create Note
              </button>

              <small className="coming-soon">
                Coming soon
              </small>

            </div>

          </section>

        </main>

      </div>
    );
  }

  /*
   * =========================
   * LOGIN PAGE
   * =========================
   */

  return (
    <Login
      onSignup={() => setPage("signup")}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}

export default App;