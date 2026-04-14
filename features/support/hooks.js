/**
 * Global Cucumber lifecycle hooks.
 * Launches and closes a single Puppeteer browser instance per scenario,
 * shared across all step definition files via shared_state.js.
 */

const { Before, After } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const state = require('./shared_state');

Before(async () => {
    state.browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    state.page = await state.browser.newPage();
});

After(async () => {
    if (state.browser) {
        await state.browser.close();
        state.browser = null;
        state.page = null;
    }
});

// Clean up the hardcoded test user before each signup scenario so the
// "Successful account creation" test is idempotent across multiple runs.
Before({ tags: '@signup' }, async () => {
    const mongoClient = new MongoClient(process.env.MONGO_URI);
    try {
        await mongoClient.connect();
        const db = mongoClient.db('dbs');
        await db.collection('userLoginData').deleteOne({ email: 'testuser@example.com' });
    } finally {
        await mongoClient.close();
    }
});
