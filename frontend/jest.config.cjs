

module.exports = {
  testEnvironment: "jsdom",

  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],

  testMatch: [
    "**/?(*.)+(spec|test).js",
    "**/?(*.)+(spec|test).jsx"
  ],

  moduleFileExtensions: ["js", "jsx", "json"],

  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  }
};