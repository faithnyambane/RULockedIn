/**
 * Cucumber step definitions — driven by Puppeteer
 *
 * Prerequisites:
 *   1. Server must be running:  npm start
 *   2. Run acceptance tests:    npm run test:cucumber
 */

const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const state = require('../support/shared_state');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

// ── Given ─────────────────────────────────────────────────────────────────────

Given('I navigate to the home page', async () => {
    await state.page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
});

Given('I am on the sign up page', async () => {
    await state.page.goto(`${BASE_URL}/signUp.html`, { waitUntil: 'domcontentloaded' });
});

Given('I am on the login page', async () => {
    await state.page.goto(`${BASE_URL}/logIn.html`, { waitUntil: 'domcontentloaded' });
});

// ── When ──────────────────────────────────────────────────────────────────────

When('I fill in {string} with {string}', async (fieldId, value) => {
    await state.page.$eval(`#${fieldId}`, el => { el.value = ''; });
    if (value !== '') {
        await state.page.type(`#${fieldId}`, value);
    }
});

When('I click the {string} button', async (buttonText) => {
    // Find a button whose visible text matches
    const buttons = await state.page.$$('button');
    for (const btn of buttons) {
        const text = await state.page.evaluate(el => el.innerText.trim(), btn);
        if (text === buttonText) {
            await btn.click();
            // Small wait for async fetch + DOM update
            await new Promise(r => setTimeout(r, 800));
            return;
        }
    }
    throw new Error(`Button with text "${buttonText}" not found`);
});

// ── Then ──────────────────────────────────────────────────────────────────────

Then('the page title should contain {string}', async (expectedTitle) => {
    const title = await state.page.title();
    assert.ok(title.includes(expectedTitle), `Expected title to contain "${expectedTitle}", got "${title}"`);
});

Then('I should see a {string} link in the navigation', async (linkText) => {
    const links = await state.page.$$('nav a');
    for (const link of links) {
        const text = await state.page.evaluate(el => el.innerText.trim(), link);
        if (text === linkText) return;
    }
    throw new Error(`Nav link "${linkText}" not found`);
});

Then('I should see a {string} link', async (linkText) => {
    const content = await state.page.content();
    assert.ok(content.includes(linkText), `Expected to find link text "${linkText}" on page`);
});

Then('I should be redirected to the home page', async () => {
    // Wait for navigation if still in progress; ignore timeout if it already completed
    try {
        await state.page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 5000 });
    } catch (e) { /* navigation may have already completed */ }
    const url = state.page.url();
    assert.ok(
        url === `${BASE_URL}/` || url === BASE_URL,
        `Expected to be on home page, got "${url}"`
    );
});

Then('I should see an error message {string}', async (expectedMessage) => {
    const errText = await state.page.$eval('#errorMessage', el => el.innerText.trim());
    assert.strictEqual(errText, expectedMessage,
        `Expected error "${expectedMessage}", got "${errText}"`);
});
