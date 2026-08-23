
const authService = require("../services/authService");

// =========================
// SIGNUP
// =========================
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate types and required values before using
    // trim() or length.
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Preserve normalized email flow
    const normalizedEmail = email.trim().toLowerCase();

    // Preserve password-length validation
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await authService.findUserByEmail(
      normalizedEmail
    );

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const result = await authService.signupUser({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    return res.status(201).json(result);
  } catch (error) {
    // MongoDB duplicate-key error
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// LOGIN
// =========================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await authService.loginUser({
      email: normalizedEmail,
      password,
    });

    return res.status(200).json(result);
  } catch (error) {
    if (
      error.message === "Invalid email or password"
    ) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// GET CURRENT USER
// =========================
const getMe = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  signup,
  login,
  getMe,
};