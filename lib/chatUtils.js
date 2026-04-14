/**
 * Pure utility functions for chat, history, and search features.
 *
 * These functions contain the core logic for Iteration 2 features and are
 * kept separate from server/browser code so they can be unit tested with Jasmine.
 */

// ── Chat ──────────────────────────────────────────────────────────────────────

/**
 * Validates a chat message before sending it to the LLM.
 * @param {string} message
 * @returns {{ valid: boolean, message: string }}
 */
function validateChatMessage(message) {
    if (message === null || message === undefined) {
        return { valid: false, message: 'Message cannot be null.' };
    }
    if (typeof message !== 'string') {
        return { valid: false, message: 'Message must be a string.' };
    }
    if (message.trim() === '') {
        return { valid: false, message: 'Message cannot be empty.' };
    }
    return { valid: true, message: '' };
}

// ── History ───────────────────────────────────────────────────────────────────

/**
 * Extracts the logs array from an API history response object.
 * Returns an empty array if the response is missing or malformed.
 * @param {object} data
 * @returns {Array}
 */
function getLogsFromResponse(data) {
    if (!data || typeof data !== 'object') {
        return [];
    }
    if (!Array.isArray(data.logs)) {
        return [];
    }
    return data.logs;
}

// ── Search ────────────────────────────────────────────────────────────────────

/**
 * Filters a chat log array by a search term.
 * Matches against both the user message and the LLM reply (case-insensitive).
 * @param {Array} logs
 * @param {string} searchText
 * @returns {Array}
 */
function filterChatLogs(logs, searchText) {
    if (!Array.isArray(logs)) {
        return [];
    }
    if (typeof searchText !== 'string' || searchText.trim() === '') {
        return logs;
    }
    const term = searchText.toLowerCase();
    return logs.filter(function (chat) {
        const prompt = (chat.userMessage || '').toLowerCase();
        const reply  = (chat.reply || '').toLowerCase();
        return prompt.includes(term) || reply.includes(term);
    });
}

module.exports = { validateChatMessage, getLogsFromResponse, filterChatLogs };
