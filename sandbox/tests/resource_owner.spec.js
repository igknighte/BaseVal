const { test, expect } = require("@playwright/test");

test.describe("Follow resource_owner flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/LoginPage");
    await page.fill('[data-testid="login-input-email"]', "user@erval.com");
    await page.fill('[data-testid="login-input-password"]', "12345678");
    await page.click('[data-testid="submit-button"]');
    await expect(page).toHaveURL("/Anomalies");
  });

  test("check resource_owner status", async ({ page }) => {
    await page.click('[data-testid="logout-button"]');
    await expect(page.locator('[data-testid="logout-modal-user"]')).toHaveText(
      "user",
    );
    await expect(page.locator('[data-testid="logout-modal-role"]')).toHaveText(
      "Account Type - resource_owner",
    );

    test("check permission anomalies", async ({ page }) => {
      await page.locator('[data-testid="anomalies-Type2"]').click();
      await page.waitForSelector('[data-testid="Type2-anomalies-card"]');
      const AnomaliesCardCount = await page
        .locator('[data-testid="Type2-anomalies-card"]')
        .count();
      expect(AnomaliesCardCount).toBeGreaterThan(0);
      // Check anomaly metadata
    });

    test("check entitlement anomalies", async ({ page }) => {
      await page.locator('[data-testid="anomalies-Type1"]').click();
      await page.waitForSelector('[data-testid="Type1-anomalies-card"]');
      const AnomaliesCardCount = await page
        .locator('[data-testid="Type1-anomalies-card"]')
        .count();
      expect(AnomaliesCardCount).toBeGreaterThan(0);
      // Check anomaly metadata
    });

    test("Perform logout for user", async ({ page }) => {
      //Add logout code
    });
  });
});
