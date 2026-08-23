
const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000"
}/api/auth`;

/* =========================
   SIGNUP
========================= */

export const signupUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userData.name.trim(),
        email: userData.email.trim(),
        password: userData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    throw error;
  }
};

/* =========================
   LOGIN
========================= */

export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userData.email.trim(),
        password: userData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Invalid email or password");
    }

    if (!data.token) {
      throw new Error("Login successful but token was not received");
    }

    localStorage.setItem("token", data.token);

    if (data.user) {
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );
    }

    return data;
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    throw error;
  }
};

/* =========================
   GET TOKEN
========================= */

export const getToken = () => {
  return localStorage.getItem("token");
};

/* =========================
   GET USER
========================= */

export const getStoredUser = () => {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

/* =========================
   AUTHENTICATION
========================= */

export const isAuthenticated = () => {
  return Boolean(localStorage.getItem("token"));
};

/* =========================
   LOGOUT
========================= */

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

