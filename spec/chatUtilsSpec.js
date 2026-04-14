/**
 * Jasmine unit tests for lib/chatUtils.js
 *
 * Run with:  npm run test:unit
 */

const { validateChatMessage, getLogsFromResponse, filterChatLogs } = require('../lib/chatUtils');

// ── validateChatMessage ───────────────────────────────────────────────────────
describe('validateChatMessage', () => {

    it('fails when message is null', () => {
        const result = validateChatMessage(null);
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Message cannot be null.');
    });

    it('fails when message is undefined', () => {
        const result = validateChatMessage(undefined);
        expect(result.valid).toBe(false);
    });

    it('fails when message is not a string', () => {
        const result = validateChatMessage(42);
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Message must be a string.');
    });

    it('fails when message is an empty string', () => {
        const result = validateChatMessage('');
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Message cannot be empty.');
    });

    it('fails when message is only whitespace', () => {
        const result = validateChatMessage('   ');
        expect(result.valid).toBe(false);
    });

    it('passes when message has valid text', () => {
        const result = validateChatMessage('What is 2 + 2?');
        expect(result.valid).toBe(true);
        expect(result.message).toBe('');
    });

    it('passes when message has leading and trailing whitespace', () => {
        const result = validateChatMessage('  hello  ');
        expect(result.valid).toBe(true);
    });
});

// ── getLogsFromResponse ───────────────────────────────────────────────────────
describe('getLogsFromResponse', () => {

    it('returns empty array when data is null', () => {
        expect(getLogsFromResponse(null)).toEqual([]);
    });

    it('returns empty array when data is undefined', () => {
        expect(getLogsFromResponse(undefined)).toEqual([]);
    });

    it('returns empty array when data is not an object', () => {
        expect(getLogsFromResponse('string')).toEqual([]);
    });

    it('returns empty array when logs key is missing', () => {
        expect(getLogsFromResponse({})).toEqual([]);
    });

    it('returns empty array when logs is not an array', () => {
        expect(getLogsFromResponse({ logs: 'notanarray' })).toEqual([]);
    });

    it('returns the logs array when present', () => {
        const logs = [{ userMessage: 'hello', reply: 'hi' }];
        expect(getLogsFromResponse({ logs })).toEqual(logs);
    });

    it('returns empty array when logs is an empty array', () => {
        expect(getLogsFromResponse({ logs: [] })).toEqual([]);
    });
});

// ── filterChatLogs ────────────────────────────────────────────────────────────
describe('filterChatLogs', () => {

    const sampleLogs = [
        { userMessage: 'What is the weather?', reply: 'It is sunny today.' },
        { userMessage: 'Tell me a joke', reply: 'Why did the chicken cross the road?' },
        { userMessage: 'Hello', reply: 'Hi there!' }
    ];

    it('returns empty array when logs is not an array', () => {
        expect(filterChatLogs(null, 'hello')).toEqual([]);
    });

    it('returns all logs when search text is empty', () => {
        expect(filterChatLogs(sampleLogs, '')).toEqual(sampleLogs);
    });

    it('returns all logs when search text is only whitespace', () => {
        expect(filterChatLogs(sampleLogs, '   ')).toEqual(sampleLogs);
    });

    it('matches on user message text', () => {
        const result = filterChatLogs(sampleLogs, 'joke');
        expect(result.length).toBe(1);
        expect(result[0].userMessage).toBe('Tell me a joke');
    });

    it('matches on reply text', () => {
        const result = filterChatLogs(sampleLogs, 'sunny');
        expect(result.length).toBe(1);
        expect(result[0].reply).toBe('It is sunny today.');
    });

    it('is case-insensitive', () => {
        const result = filterChatLogs(sampleLogs, 'HELLO');
        expect(result.length).toBe(1);
        expect(result[0].userMessage).toBe('Hello');
    });

    it('returns empty array when no logs match', () => {
        const result = filterChatLogs(sampleLogs, 'zzznomatch');
        expect(result.length).toBe(0);
    });

    it('returns all logs when search text matches all entries', () => {
        const result = filterChatLogs(sampleLogs, 'the');
        expect(result.length).toBe(3);
    });

    it('handles logs with missing userMessage gracefully', () => {
        const logs = [{ reply: 'some reply' }];
        const result = filterChatLogs(logs, 'reply');
        expect(result.length).toBe(1);
    });

    it('handles logs with missing reply gracefully', () => {
        const logs = [{ userMessage: 'some prompt' }];
        const result = filterChatLogs(logs, 'prompt');
        expect(result.length).toBe(1);
    });
});
