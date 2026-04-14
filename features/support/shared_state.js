/**
 * Shared Puppeteer browser/page state across all step definition files.
 * Lifecycle (launch/close) is managed in hooks.js.
 */

const state = {
    browser: null,
    page: null
};

module.exports = state;
