const { test, expect } = require("@playwright/test");

test.describe("Page Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/LoginPage");
    await page.fill('[data-testid="login-input-email"]', "user@erval.com");
    await page.fill('[data-testid="login-input-password"]', "12345678");
    await page.click('[data-testid="submit-button"]');
    await expect(page).toHaveURL("/UserDashboard");
    await page.fill('[data-testid="search"]', "e");
    await page.click('[data-testid="search-button"]');
    await page.waitForSelector('[data-testid="entitlement-card"]');
  });

  test("increments and decrements page correctly", async ({ page }) => {
    // Verify initial page number
    await expect(page.locator(".bg-blue-500").last()).toHaveText("1");

    // Click next button
    await page.click('button[aria-label="Next Page"]');
    await expect(page.locator(".bg-blue-500").last()).toHaveText("2");

    // Click previous button
    await page.click('button[aria-label="Previous Page"]');
    await expect(page.locator(".bg-blue-500").last()).toHaveText("1");
  });

  test("limits page number between 1 and 30", async ({ page }) => {
    // Navigate to the page
    await page.goto("/page");

    // Verify initial page number
    await expect(page.locator(".bg-blue-500").last()).toHaveText("1");

    // Set input to a value greater than 30
    const pageNumberInput = await page.locator('input[type="number"]');
    await pageNumberInput.fill("50");
    await pageNumberInput.press("Tab");

    // Verify page number is now 30
    await expect(page.locator(".bg-blue-500").last()).toHaveText("30");

    // Set input to a value within the range
    await pageNumberInput.fill("23");
    await pageNumberInput.press("Tab");

    // Verify page number is now 23
    await expect(page.locator(".bg-blue-500").last()).toHaveText("23");

    // Set input to a value less than 1
    await pageNumberInput.fill("0");
    await pageNumberInput.press("Tab");

    // Verify page number is now 1
    await expect(page.locator(".bg-blue-500").last()).toHaveText("1");
  });
});
