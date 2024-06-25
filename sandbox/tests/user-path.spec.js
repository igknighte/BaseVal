const { test, expect } = require("@playwright/test");

test.describe("Follow user flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/LoginPage");
    await page.fill('[data-testid="login-input-email"]', "user@erval.com");
    await page.fill('[data-testid="login-input-password"]', "12345678");
    await page.click('[data-testid="submit-button"]');
    await expect(page).toHaveURL("/UserDashboard");
  });

  test("check user status", async ({ page }) => {
    await page.click('[data-testid="logout-button"]');
    await expect(page.locator('[data-testid="logout-modal-user"]')).toHaveText(
      "user",
    );
    await expect(page.locator('[data-testid="logout-modal-role"]')).toHaveText(
      "Account Type - user",
    );

    test("search entitlements", async ({ page }) => {
      await page.fill('[data-testid="search-input"]', "catalog");
      await page.click('[data-testid="search"]');
      await page.waitForSelector('[data-testid="entitlement-card"]');
      const EntitlementCardCount = await page
        .locator('[data-testid="entitlement-card"]')
        .count();
      expect(EntitlementCardCount).toBeGreaterThan(0);
      // Check anomalous entitlement
      await page.fill('[data-testid="search-input"]', "catalog_1");
      await expect(
        page.locator('[data-testid="entitlement-card-button"]').first(),
      ).toBeDisabled();
      await expect(
        page.locator('[data-testid="entitlement-card-button"]').first(),
      ).toHaveText("Cannot Request");
      const firstMovieCard = page.locator('[data-testid="movie-card"]').first();
      await expect(
        firstMovieCard.locator('[data-testid="movie-title"]'),
      ).toHaveText("Inception");
      await expect(
        firstMovieCard.locator('[data-testid="movie-year"]'),
      ).toHaveText("Year: 2010");
      // Check normal entitlement
      await page.fill('[data-testid="search-input"]', "catalog_2");
      await expect(
        page.locator('[data-testid="entitlement-card-button"]').first(),
      ).toBeEnabled();
      await expect(
        page.locator('[data-testid="entitlement-card-button"]').first(),
      ).toHaveText("Requestable");
      // Check already accepted entitlement
      await page.fill('[data-testid="search-input"]', "catalog_3");
      await expect(
        page.locator('[data-testid="entitlement-card-button"]').first(),
      ).toBeDisabled();
      await expect(
        page.locator('[data-testid="entitlement-card-button"]').first(),
      ).toHaveText("Already Requested");
    });

    test("Perform logout for user", async ({ page }) => {
      //Add logout code
    });
  });
});
