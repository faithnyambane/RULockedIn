/**
 * Cucumber step definitions for chat and conversation history features
 * Driven by Puppeteer
 *
 * Prerequisites:
 *   1. Server must be running:  npm start
 *   2. Run acceptance tests:    npm run test:cucumber
 */

const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const state = require('../support/shared_state');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

// ── Given ──────────────────────────────────────────────────────────────────────

Given('I am logged in as a new user', async () => {
    const email = `testuser_${Date.now()}@example.com`;

    // Navigate to home first to establish the session context
    await state.page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });

    // Sign up via the API directly — sets the session cookie automatically
    await state.page.evaluate(async (email) => {
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
    await state.page.reload({ waitUntil: 'domcontentloaded' });
});

// ── When ───────────────────────────────────────────────────────────────────────

When('I navigate to the chat history page', async () => {
    await state.page.goto(`${BASE_URL}/chatHistory.html`, { waitUntil: 'domcontentloaded' });
});

When('I type {string} into the chat input', async (text) => {
    await state.page.type('#prompt', text);
});

When('I type {string} into the search input', async (text) => {
    await state.page.type('#Search', text);
});

When('I click the continue chat frog button without selecting a prompt', async () => {
    await state.page.click('.frogButton');
    await new Promise(r => setTimeout(r, 800));
});

// ── Then ───────────────────────────────────────────────────────────────────────

Then('I should see the chat input field', async () => {
    const input = await state.page.$('#prompt');
    assert.ok(input !== null, 'Expected to find chat input field #prompt');
});

Then('I should see the chat submit button', async () => {
    const button = await state.page.$('.submitBtn button');
    assert.ok(button !== null, 'Expected to find chat submit button');
});

Then('the chat input should contain {string}', async (expectedText) => {
    const value = await state.page.$eval('#prompt', el => el.value);
    assert.strictEqual(value, expectedText,
        `Expected chat input to contain "${expectedText}", got "${value}"`);
});

Then('the {string} navigation link should be hidden', async (linkText) => {
    const isVisible = await state.page.evaluate((text) => {
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

    const isVisible = await state.page.evaluate((text) => {
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
    const container = await state.page.$('#ask');
    assert.ok(container !== null, 'Expected to find prompt history container #ask');
});

Then('I should see the continue chat frog button', async () => {
    const button = await state.page.$('.frogButton');
    assert.ok(button !== null, 'Expected to find continue chat frog button (.frogButton)');
});

Then('I should see the search input field', async () => {
    const input = await state.page.$('#Search');
    assert.ok(input !== null, 'Expected to find search input field #Search');
});

Then('the search input should contain {string}', async (expectedText) => {
    const value = await state.page.$eval('#Search', el => el.value);
    assert.strictEqual(value, expectedText,
        `Expected search input to contain "${expectedText}", got "${value}"`);
});

Then('I should still be on the chat history page', async () => {
    const url = state.page.url();
    assert.ok(url.includes('chatHistory.html'),
        `Expected to remain on chat history page, but URL was "${url}"`);
});
