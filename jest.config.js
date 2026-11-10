module.exports = {
    verbose: true,
    testMatch: ["**/unitest/**/*.spec.js"],
    testEnvironment: "node",
    transform: { "^.+\\.[jt]sx?$": "babel-jest" },
};
