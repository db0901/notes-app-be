module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/"],
  moduleNameMapper: {
    "^helpers/(.*)$": "<rootDir>/src/helpers/$1",
    "^middleware/(.*)$": "<rootDir>/src/middleware/$1",
    "^routes/(.*)$": "<rootDir>/src/routes/$1",
    "^schemas/(.*)$": "<rootDir>/src/schemas/$1",
    "^index$": "<rootDir>/src/index.ts",
  },
};
