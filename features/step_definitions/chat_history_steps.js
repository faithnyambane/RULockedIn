/**
 * Cucumber step definitions for chat and conversation history features
 * Driven by Puppeteer
 *
 * Prerequisites:
 *   1. Server must be running:  npm start
 *   2. Run acceptance tests:    npm run test:cucumber
 */

const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');
const assert = require('assert');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

let browser;
let page;

// ── Lifecycle ──────────────────────────────────────────────────────────────────

Before(async () => {
    browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
});

After(async () => {
    if (browser) await browser.close();
});

// ── Given ──────────────────────────────────────────────────────────────────────

Given('I am logged in as a new user', async () => {
    const email = `testuser_${Date.now()}@example.com`;

    // Navigate to home first to establish the session context
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });

    // Sign up via the API directly — sets the session cookie automatically
    await page.evaluate(async (email) => {
        await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email,
                password: 'password123',
                confirmPassword: 'password123'
            })
        });
    }, email);

    // Reload so the page reflects the logged-in session state
    await page.reload({ waitUntil: 'domcontentloaded' });
});

// ── When ───────────────────────────────────────────────────────────────────────

When('I navigate to the chat history page', async () => {
    await page.goto(`${BASE_URL}/chatHistory.html`, { waitUntil: 'domcontentloaded' });
});

When('I type {string} into the chat input', async (text) => {
    await page.type('#prompt', text);
});

When('I type {string} into the search input', async (text) => {
    await page.type('#Search', text);
});

When('I click the continue chat frog button without selecting a prompt', async () => {
    await page.click('.frogButton');
    await new Promise(r => setTimeout(r, 800));
});

// ── Then ───────────────────────────────────────────────────────────────────────

Then('I should see the chat input field', async () => {
    const input = await page.$('#prompt');
    assert.ok(input !== null, 'Expected to find chat input field #prompt');
});

Then('I should see the chat submit button', async () => {
    const button = await page.$('.submitBtn button');
    assert.ok(button !== null, 'Expected to find chat submit button');
});

Then('the chat input should contain {string}', async (expectedText) => {
    const value = await page.$eval('#prompt', el => el.value);
    assert.strictEqual(value, expectedText,
        `Expected chat input to contain "${expectedText}", got "${value}"`);
});

Then('the {string} navigation link should be hidden', async (linkText) => {
    const isVisible = await page.evaluate((text) => {
        const links = document.querySelectorAll('nav a');
        for (const link of links) {
            if (link.innerText.trim() === text) {
                const li = link.closest('li');
                const style = window.getComputedStyle(li);
                return style.display !== 'none';
            }
        }
        return false;
    }, linkText);
    assert.strictEqual(isVisible, false,
        `Expected "${linkText}" nav link to be hidden, but it was visible`);
});

Then('the {string} navigation link should be visible', async (linkText) => {
    // Wait for the async updateNav() call to complete
    await new Promise(r => setTimeout(r, 800));

    const isVisible = await page.evaluate((text) => {
        const links = document.querySelectorAll('nav a');
        for (const link of links) {
            if (link.innerText.trim() === text) {
                const li = link.closest('li');
                const style = window.getComputedStyle(li);
                return style.display !== 'none';
            }
        }
        return false;
    }, linkText);
    assert.strictEqual(isVisible, true,
        `Expected "${linkText}" nav link to be visible, but it was hidden`);
});

Then('I should see the prompt history container', async () => {
    const container = await page.$('#ask');
    assert.ok(container !== null, 'Expected to find prompt history container #ask');
});

Then('I should see the continue chat frog button', async () => {
    const button = await page.$('.frogButton');
    assert.ok(button !== null, 'Expected to find continue chat frog button (.frogButton)');
});

Then('I should see the search input field', async () => {
    const input = await page.$('#Search');
    assert.ok(input !== null, 'Expected to find search input field #Search');
});

Then('the search input should contain {string}', async (expectedText) => {
    const value = await page.$eval('#Search', el => el.value);
    assert.strictEqual(value, expectedText,
        `Expected search input to contain "${expectedText}", got "${value}"`);
});

Then('I should still be on the chat history page', async () => {
    const url = page.url();
    assert.ok(url.includes('chatHistory.html'),
        `Expected to remain on chat history page, but URL was "${url}"`);
});
