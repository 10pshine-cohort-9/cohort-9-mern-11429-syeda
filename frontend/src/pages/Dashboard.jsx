
import "./Dashboard.css";

const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="dashboard-page">

      <header className="dashboard-header">

        <div className="dashboard-brand">

          <div className="dashboard-logo">
            N
          </div>

          <div>
            <h2>Notes</h2>
            <span>Personal Workspace</span>
          </div>

        </div>

        <button
          type="button"
          className="dashboard-logout"
          onClick={onLogout}
        >
          <span>↪</span>
          Logout
        </button>

      </header>


      <main className="dashboard-content">

        <section className="welcome-section">

          <div>

            <span className="welcome-label">
              DASHBOARD
            </span>

            <h1>
              Welcome back,{" "}
              <span>
                {user?.name || "User"}
              </span>
            </h1>

            <p>
              Your account is authenticated and
              authorized successfully.
            </p>

          </div>


          <div className="welcome-logo">
            N
          </div>

        </section>


        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              Notes
            </div>

            <div>
              <span>Total Notes</span>
              <strong>0</strong>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              Secure
            </div>

            <div>
              <span>Authorization</span>
              <strong>Active</strong>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ✓
            </div>

            <div>
              <span>Account</span>
              <strong>Active</strong>
            </div>

          </div>

        </section>


        <section className="dashboard-grid">

          <div className="dashboard-box">

            <div className="box-title">

              <div>
                <h2>Your Profile</h2>
                <p>Account information</p>
              </div>

            </div>


            <div className="profile-row">
              <span>Name</span>

              <strong>
                {user?.name || "User"}
              </strong>
            </div>


            <div className="profile-row">
              <span>Email</span>

              <strong>
                {user?.email || "Not available"}
              </strong>
            </div>


            <div className="profile-row">
              <span>Status</span>

              <strong className="active">
                Authenticated
              </strong>
            </div>

          </div>


          <div className="dashboard-box">

            <div className="box-title">

              <div>
                <h2>My Notes</h2>
                <p>Your notes workspace</p>
              </div>

            </div>


            <div className="empty-state">

              <div className="empty-icon">
                +
              </div>

              <h3>
                Notes workspace ready
              </h3>

              <p>
                Note creation will be added
                in the next feature.
              </p>

            </div>

          </div>

        </section>


        <div className="security-banner">

          <div>

            <strong>
              Authentication & Authorization
            </strong>

            <p>
              You are securely logged in using
              your JWT authentication token.
            </p>

          </div>

          <span>
            SECURE
          </span>

        </div>

      </main>

    </div>
  );
};

export default Dashboard;