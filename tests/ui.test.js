const { test, expect } = require('@playwright/test');
const baseUrl = 'http://localhost:3000';

async function login(page) {
    await page.click('a[href="/login"]')
    await page.fill('#email', 'peter@abv.bg');
    await page.fill('#password', '123456');
    await page.click('input[type="submit"]');
}

test('Verify "All Books" link is visible', async ({ page }) => {
    await page.goto(baseUrl);
    await page.waitForSelector('nav.navbar');
    const allBooksLink = await page.$('a[href="/catalog"]');
    const isLinkVisible = await allBooksLink.isVisible();
    expect(isLinkVisible).toBe(true);
});

test('Verify Login button is visible', async ({ page }) => {
    await page.goto(baseUrl);
    await page.waitForSelector('nav.navbar');
    const loginButton = await page.$('a[href="/login"]');
    const isLoginButtonVisible = await loginButton.isVisible();
    expect(isLoginButtonVisible).toBe(true);
});

test('Verify Register button is visible', async ({ page }) => {
    await page.goto(baseUrl);
    await page.waitForSelector('nav.navbar');
    const registerButton = await page.$('a[href="/register"]');
    const isRegisterButtonVisible = await registerButton.isVisible();
    expect(isRegisterButtonVisible).toBe(true);
});

test('Verify "All Books" link is visible after user login', async ({ page }) => {
    await page.goto(baseUrl);
    await login(page);

    const allBooksLink = await page.$('a[href="/catalog"]');
    const isAllBooksLinkVisible = await allBooksLink.isVisible();
    expect(isAllBooksLinkVisible).toBe(true);
    const logoutButton = await page.$('#logoutBtn');
    const isLogoutButtonVisible = await logoutButton.isVisible();
    expect(isLogoutButtonVisible).toBe(true);
});

test('Verify "My Books" link is visible', async ({ page }) => {
    await page.goto(baseUrl);
    await login(page);
    await page.waitForSelector('nav.navbar');
    const myBooksButton = await page.$('a[href="/profile"]');
    const isMyBooksButtonVisible = await myBooksButton.isVisible();
    expect(isMyBooksButtonVisible).toBe(true);
});

test('Verify "Add Book" link is visible', async ({ page }) => {
    await page.goto(baseUrl);
    await login(page);
    await page.waitForSelector('nav.navbar');
    const addBookButton = await page.$('a[href="/create"]');
    const isAddBookButtonVisible = await addBookButton.isVisible();
    expect(isAddBookButtonVisible).toBe(true);
});


test('Verify that user email address is visible', async ({ page }) => {
    await page.goto(baseUrl);
    await login(page);
    await page.waitForSelector('nav.navbar');
    const emailAddress = await page.$('#user > span:nth-child(1)');
    const isEmailAddressVisible = await emailAddress.isVisible();
    expect(isEmailAddressVisible).toBe(true);
});

test('Login with valid credentials', async ({ page }) => {
    await page.goto(baseUrl);
    await login(page);

    await page.$('a[href="/catalog"]');
    expect(page.url()).toBe(baseUrl + '/catalog');
});

test('Login with empty input fields', async ({ page }) => {
    await page.goto(baseUrl + '/login');
    await page.click('input[type="submit"]');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('All fields are required!');
        await dialog.accept();
    });

    await page.$('a[href="/login"]');
    expect(page.url()).toBe(baseUrl + '/login');
});