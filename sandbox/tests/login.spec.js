const { test, expect } = require("@playwright/test");

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("displays error message when username or password is empty", async ({
    page,
  }) => {
    await page.click('[data-testid="login-button"]');
    await expect(page.locator('[data-testid="error-message"]')).toHaveText(
      "Invalid username or password",
    );
  });

  test("navigates to movie search page on successful login", async ({
    page,
  }) => {
    await page.fill('[data-testid="username-input"]', "user");
    await page.fill('[data-testid="password-input"]', "password");
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL("/checkCall");
  });
});
