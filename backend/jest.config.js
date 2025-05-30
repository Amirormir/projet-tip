export default {
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  setupFiles: ["dotenv/config"],
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
};
