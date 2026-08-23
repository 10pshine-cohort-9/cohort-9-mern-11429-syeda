
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// =========================
// FIND USER BY EMAIL
// =========================
const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

// =========================
// SIGNUP
// =========================
const signupUser = async ({
  name,
  email,
  password,
}) => {
  try {
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    return {
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    // Keep duplicate-key error available to controller
    if (error.code === 11000) {
      throw error;
    }

    throw new Error("Signup failed");
  }
};

// =========================
// LOGIN
// =========================
const loginUser = async ({
  email,
  password,
}) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken(user._id);

    return {
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    if (
      error.message ===
      "Invalid email or password"
    ) {
      throw error;
    }

    throw new Error("Login failed");
  }
};

// =========================
// GET USER BY ID
// =========================
const getUserById = async (userId) => {
  return User.findById(userId).select(
    "-password"
  );
};

module.exports = {
  findUserByEmail,
  signupUser,
  loginUser,
  getUserById,
};