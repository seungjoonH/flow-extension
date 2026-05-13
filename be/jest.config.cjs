/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.js"],
  moduleNameMapper: {
    "^#src/(.*)$": "<rootDir>/src/$1.js",
  },
};
