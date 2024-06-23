const { test, expect } = require("@playwright/test");

test.describe("Navbar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should navigate to Home page", async ({ page }) => {
    await page.click("text=Home");
    await expect(page).toHaveURL("/");
  });

  test("should navigate to Login page", async ({ page }) => {
    await page.click("text=Login");
    await expect(page).toHaveURL("/login");
  });

  test("should navigate to Page page", async ({ page }) => {
    await page.click("text=Page");
    await expect(page).toHaveURL("/page");
  });

  test("should navigate to CheckCall page", async ({ page }) => {
    await page.click("text=CheckCall");
    await expect(page).toHaveURL("/checkCall");
    await expect(page.locator("h1")).toHaveText("Search for Movies");
  });
});
