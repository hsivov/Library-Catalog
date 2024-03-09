const { test, expect } = require('@playwright/test');
const baseUrl = 'http://localhost:3000';
const email = 'peter@abv.bg';
const password = '123456';

async function login(page) {
    await page.fill('#email', email);
    await page.fill('#password', password);
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
    await page.goto(baseUrl + '/login');
    await login(page);
    await page.click('input[type="submit"]');

    const allBooksLink = await page.$('a[href="/catalog"]');
    const isAllBooksLinkVisible = await allBooksLink.isVisible();
    expect(isAllBooksLinkVisible).toBe(true);
    const logoutButton = await page.$('#logoutBtn');
    const isLogoutButtonVisible = await logoutButton.isVisible();
    expect(isLogoutButtonVisible).toBe(true);
});

test('Verify "My Books" link is visible', async ({ page }) => {
    await page.goto(baseUrl + '/login');
    await login(page);
    await page.click('input[type="submit"]');
    await page.waitForSelector('nav.navbar');
    const myBooksButton = await page.$('a[href="/profile"]');
    const isMyBooksButtonVisible = await myBooksButton.isVisible();
    expect(isMyBooksButtonVisible).toBe(true);
});

test('Verify "Add Book" link is visible', async ({ page }) => {
    await page.goto(baseUrl + '/login');
    await login(page);
    await page.click('input[type="submit"]');
    await page.waitForSelector('nav.navbar');
    const addBookButton = await page.$('a[href="/create"]');
    const isAddBookButtonVisible = await addBookButton.isVisible();
    expect(isAddBookButtonVisible).toBe(true);
});


test('Verify that user email address is visible', async ({ page }) => {
    await page.goto(baseUrl + '/login');
    await login(page);
    await page.click('input[type="submit"]');
    await page.waitForSelector('nav.navbar');
    const emailAddress = await page.$('#user > span:nth-child(1)');
    const isEmailAddressVisible = await emailAddress.isVisible();
    expect(isEmailAddressVisible).toBe(true);
});

test('Login with valid credentials', async ({ page }) => {
    await page.goto(baseUrl + '/login');
    await login(page);
    await page.click('input[type="submit"]');

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

test('Add book with correct data', async ({ page }) => {
    await page.goto(baseUrl + '/login');

    await login(page);

    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL(baseUrl + '/catalog')
    ]);

    await page.click('a[href="/create"]');
    await page.waitForSelector('#create-form');

    await page.fill('#title', 'Test Book');
    await page.fill('#description', 'This is a test book description');
    await page.fill('#image', 'https://example.com/book-image.jpg');
    await page.selectOption('#type', 'Fiction');
    await page.click('#create-form input[type="submit"]');

    await page.waitForURL(baseUrl + '/catalog');

    expect(page.url()).toBe(baseUrl + '/catalog');
});

test('Login and verify all books are displayed', async ({ page }) => {
    await page.goto(baseUrl + '/login');
    await login(page);

    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL(baseUrl + '/catalog')
    ]);

    await page.waitForSelector('.dashboard');

    const bookElement = await page.$$('.other-books-list li');

    expect(bookElement.length).toBeGreaterThan(0);
});

test('Verify that no books are displayed', async ({ page }) => {
    await page.goto(baseUrl + '/login');
    await page.fill('#email', 'hsivov@gmail.com');
    await page.fill('#password', '1234');

    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL(baseUrl + '/catalog')
    ]);

    await page.click('a[href="/profile"]');

    await page.waitForSelector('.my-books');

    const noBooksMessage = await page.textContent('.no-books');

    expect(noBooksMessage).toBe('No books in database!');
});

test('Login and navigate to Details page', async ({ page }) => {
    await page.goto(baseUrl + '/login');

    await login(page);

    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL(baseUrl + '/catalog')
    ]);

    await page.click('a[href="/catalog"]');
    await page.waitForSelector('.otherBooks');

    await page.click('.otherBooks a.button');
    await page.waitForSelector('.book-information');

    const detailsPageTitle = await page.textContent('.book-information h3');
    expect(detailsPageTitle).toBe('Test Book');
});

test.only('Verify redirection of Logout link', async ({ page }) => {
    await page.goto(baseUrl + '/login');

    await login(page);
    await page.click('input[type="submit"]');

    const logoutLink = await page.$('a[href="javascript:void(0)"]');
    await logoutLink.click();

    const redirectedURL = page.url();
    expect(redirectedURL).toBe(baseUrl + '/catalog');
});