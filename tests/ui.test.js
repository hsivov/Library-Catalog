const { test, expect } = require('@playwright/test');
const baseUrl = 'http://localhost:3000';
const email = 'peter@abv.bg';
const password = '123456';

async function login(page) {
    await page.click('a[href="/login"]')
    await page.fill('#email', email);
    await page.fill('#password', password);
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

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await page.click('input[type="submit"]');

    await page.$('a[href="/login"]');
    expect(page.url()).toBe(baseUrl + '/login');
});

test('Login with empty password', async ({ page }) => {
    await page.goto(baseUrl + '/login');
    await page.fill('#email', email);

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await page.click('input[type="submit"]');

    await page.$('a[href="/login"]');
    expect(page.url()).toBe(baseUrl + '/login');
});

test('Login with empty email', async ({ page }) => {
    await page.goto(baseUrl + '/login');
    await page.fill('#password', password);

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await page.click('input[type="submit"]');

    await page.$('a[href="/login"]');
    expect(page.url()).toBe(baseUrl + '/login');
});

test('Register with valid credentials', async ({ page }) => {
    await page.goto(baseUrl + '/register');
    await page.fill('#email', 'test@email.com');
    await page.fill('#password', '12345');
    await page.fill('#repeat-pass', '12345');
    await page.click('input.button');

    await page.$('a[href="/catalog"]');
    expect(page.url()).toBe(baseUrl + '/catalog');
});

test('Register with empty input fields', async ({ page }) => {
    await page.goto(baseUrl + '/register');
    
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await page.click('input[type="submit"]');

    await page.$('a[href="/register"]');
    expect(page.url()).toBe(baseUrl + '/register');
});

test('Register with different passwords', async ({ page }) => {
    await page.goto(baseUrl + '/register');
    await page.fill('#email', 'test@email.com');
    await page.fill('#password', '12345');
    await page.fill('#repeat-pass', '54321');
    
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain("Passwords don't match!");
        await dialog.accept();
    });
    await page.click('input[type="submit"]');

    await page.$('a[href="/register"]');
    expect(page.url()).toBe(baseUrl + '/register');
    
});