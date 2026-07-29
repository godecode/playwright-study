const { chromium } = require('playwright');

const BASE_URL = 'https://www.saucedemo.com';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // ── 1. LOGIN ──────────────────────────────────────────────
  await page.goto(BASE_URL);
  await page.locator('[data-test="username"]').waitFor();

  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  await page.waitForURL(/.*\/inventory\.html/);
  console.log('[PASS] Login berhasil — masuk ke inventory page');

  // ── 2. ADD TO CART ────────────────────────────────────────
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

  const badge = page.locator('[data-test="shopping-cart-badge"]');
  const badgeText = await badge.textContent();
  console.log('[PASS] Cart badge:', badgeText);

  // ── 3. GO TO CART ─────────────────────────────────────────
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.waitForURL(/.*\/cart\.html/);
  console.log('[PASS] Masuk ke cart page');

  // ── 4. CHECKOUT ───────────────────────────────────────────
  await page.locator('[data-test="checkout"]').click();
  await page.waitForURL(/.*\/checkout-step-one\.html/);

  await page.locator('[data-test="firstName"]').fill('Test');
  await page.locator('[data-test="lastName"]').fill('User');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();

  await page.waitForURL(/.*\/checkout-step-two\.html/);
  console.log('[PASS] Checkout step 1 selesai');

  // ── 5. FINISH ─────────────────────────────────────────────
  await page.locator('[data-test="finish"]').click();
  await page.waitForURL(/.*\/checkout-complete\.html/);

  const header = await page.locator('[data-test="complete-header"]').textContent();
  console.log('[PASS] Order complete —', header);

  await browser.close();
  console.log('\n=== ALL TESTS PASSED ===');
})();
