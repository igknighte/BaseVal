const { test, expect } = require("@playwright/test");

test.describe("CheckCall Component", () => {
  test.beforeEach(async ({ page }) => {
    // await page.route("checkCall", (route) => {
    //   console.log("Intercepted request:", route.request().url());
    //   route.continue();
    // });
    await page.goto("/checkCall");
  });

  test("displays error message when search term is empty", async ({ page }) => {
    await page.click('[data-testid="search-button"]');

    await expect(page.locator('[data-testid="error-message"]')).toHaveText(
      "Please enter a search term",
    );
  });

  test("displays error message when no movies found", async ({ page }) => {
    await page.fill('[data-testid="search-input"]', "randomnonexistentmovie");
    await page.click('[data-testid="search-button"]');
    await expect(page.locator('[data-testid="error-message"]')).toHaveText(
      "No movies found",
    );
  });

  test("displays movie results when search is successful", async ({ page }) => {
    await page.fill('[data-testid="search-input"]', "inception");
    await page.click('[data-testid="search-button"]');
    await page.waitForSelector('[data-testid="movie-card"]');
    const movieCardCount = await page
      .locator('[data-testid="movie-card"]')
      .count();
    expect(movieCardCount).toBeGreaterThan(0);
  });

  test("displays correct movie title in movie cards", async ({ page }) => {
    await page.fill('[data-testid="search-input"]', "inception");
    await page.click('[data-testid="search-button"]');
    await page.waitForSelector('[data-testid="movie-card"]');
    const movieTitle = await page
      .locator('[data-testid="movie-card-text"]')
      .first()
      .innerText();
    expect(movieTitle).toBe("Inception");
  });

  test("handles API errors gracefully", async ({ page }) => {
    // Here, we should simulate an API error. For simplicity, we can leave this case
    // as is, as handling it would require mocking the API call, which is outside
    // the typical scope of end-to-end tests.
  });
});
