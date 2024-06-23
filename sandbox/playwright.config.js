const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
    // Increase the timeout for web server
    actionTimeout: 0,
    navigationTimeout: 0,
    screenshot: "only-on-failure",
    headless: true,
  },
  webServer: {
    command: "npm run dev",
    port: 5173,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // Increase timeout to 120 seconds
  },
});
