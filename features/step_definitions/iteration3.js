/**
* Cucumber/Puppeteer tests for Iteration 3 LLM features
*The Iteration 3 acceptance tests were run using:
*npx cucumber-js features/iteration3.feature --require features/step_definitions/iteration3.js
*All 7 scenarios and 46 steps passed. 
*These tests used Cucumber.js with Puppeteer to automate the browser and verify the main Iteration 3 features, 
*including model selection, local model use, math and weather prompts, model comparison, comparison history, 
*and continuing a previous comparison conversation.
*/


const { Given, When, Then, BeforeAll, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');
const assert = require('assert');


setDefaultTimeout(120000);


const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';


let browser;
let page;


BeforeAll(async () => {
    browser = await puppeteer.launch({
        headless: false,
        slowMo: 150,
        defaultViewport: null,
        args: [
            '--start-maximized',
            '--force-device-scale-factor=1.5',
            '--high-dpi-support=1',
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });

    page = await browser.newPage();

    await page.goto(`${BASE_URL}/logIn.html`, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('#existingUserEmail', { timeout: 20000 });
    await page.waitForSelector('#existingUserPassword', { timeout: 20000 });

    await page.type('#existingUserEmail', 'testuser2@example.com');
    await page.type('#existingUserPassword', 'password123');

    const buttons = await page.$$('button');

    for (const button of buttons) {
        const text = await page.evaluate(el => el.innerText.trim(), button);

        if (text === 'Login') {
            await button.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
            break;
        }
    }
});


AfterAll(async () => {
    if (browser) await browser.close();
});


// ── Given ─────────────────────────────────────────


Given('I am on the chat page for Iteration 3', async () => {
    // Go to chat page after login
    await page.goto(`${BASE_URL}/chat.html`, { waitUntil: 'domcontentloaded' });
});


// ── Model Selection ───────────────────────────────


Then('I should see the model selection dropdown', async () => {
    await page.waitForSelector('#modelSelect', { timeout: 20000 });


    const exists = await page.$('#modelSelect');
    assert.ok(exists, 'Expected model selection dropdown to exist');
});


When('I select a local model from the model dropdown', async () => {
    await page.waitForSelector('#modelSelect', { timeout: 20000 });


    await page.waitForFunction(() => {
        const select = document.querySelector('#modelSelect');
        if (!select) return false;


        const validOptions = Array.from(select.options).filter(option =>
            option.value &&
            !option.text.includes('Loading') &&
            !option.text.includes('No models') &&
            !option.text.includes('Could')
        );


        return validOptions.length > 0;
    }, { timeout: 30000 });


    const options = await page.$$eval('#modelSelect option', opts =>
        opts
            .map(option => option.value)
            .filter(value => value)
    );


    await page.select('#modelSelect', options[0]);
});


Then('the selected model should stay selected', async () => {
    const selectedValue = await page.$eval('#modelSelect', el => el.value);


    assert.ok(selectedValue, 'Expected selected model to stay selected');
});


// ── Chat Prompt ───────────────────────────────────


When('I enter {string} into the chat input for Iteration 3', async (promptText) => {
    await page.waitForSelector('#chatInput', { timeout: 20000 });


    await page.$eval('#chatInput', el => {
        el.value = '';
    });


    await page.type('#chatInput', promptText);
});


When('I send the Iteration 3 chat prompt', async () => {
    await page.waitForSelector('#chatWindow', { timeout: 20000 });

    const beforeText = await page.$eval('#chatWindow', el => el.innerText.trim());

    const buttons = await page.$$('button');

    for (const button of buttons) {
        const text = await page.evaluate(el => el.innerText.trim(), button);

        if (text === 'Send') {
            await button.click();

            // Wait until the chat window updates after sending
            await page.waitForFunction(
                (oldText) => {
                    const chatWindow = document.querySelector('#chatWindow');
                    const chatError = document.querySelector('#chatError');

                    const newText = chatWindow ? chatWindow.innerText.trim() : '';
                    const errorText = chatError ? chatError.innerText.trim() : '';

                    return newText.length > oldText.length || errorText.length > 0;
                },
                { timeout: 60000 },
                beforeText
            );

            // Small extra pause so the response is visible in the recording
            await new Promise(resolve => setTimeout(resolve, 2000));

            return;
        }
    }

    throw new Error('Send button not found');
});


Then('I should see a response in the chat window', async () => {
    await page.waitForSelector('#chatWindow', { timeout: 20000 });

    const chatText = await page.$eval('#chatWindow', el => el.innerText.trim());
    const errorText = await page.$eval('#chatError', el => el.innerText.trim());

    assert.ok(chatText.length > 0, 'Expected a response in the chat window');

    assert.strictEqual(
        errorText,
        '',
        `Expected no error message, but got: ${errorText}`
    );

    // Pause so the AI response stays visible in the screen recording
    await new Promise(resolve => setTimeout(resolve, 7000));
});


// ── Compare Models ────────────────────────────────


When('I click the Iteration 3 compare models button', async () => {
    await page.waitForSelector('#compareBtn', { timeout: 20000 });
    await page.click('#compareBtn');
});


When('I select two local models to compare for Iteration 3', async () => {
    await page.waitForSelector('#compareModelA', { timeout: 20000 });
    await page.waitForSelector('#compareModelB', { timeout: 20000 });


    await page.waitForFunction(() => {
        const modelASelect = document.querySelector('#compareModelA');
        const modelBSelect = document.querySelector('#compareModelB');


        if (!modelASelect || !modelBSelect) return false;


        const validOptions = (select) =>
            Array.from(select.options).filter(option =>
                option.value &&
                !option.text.includes('Loading') &&
                !option.text.includes('No models') &&
                !option.text.includes('Could')
            );


        return validOptions(modelASelect).length > 0 && validOptions(modelBSelect).length > 0;
    }, { timeout: 30000 });


    const optionsA = await page.$$eval('#compareModelA option', opts =>
        opts
            .map(option => option.value)
            .filter(value => value)
    );


    const optionsB = await page.$$eval('#compareModelB option', opts =>
        opts
            .map(option => option.value)
            .filter(value => value)
    );


    assert.ok(optionsA.length > 0, 'Expected Model A dropdown to have model options');
    assert.ok(optionsB.length > 0, 'Expected Model B dropdown to have model options');


    await page.select('#compareModelA', optionsA[0]);


    const secondModel = optionsB.find(model => model !== optionsA[0]) || optionsB[0];
    await page.select('#compareModelB', secondModel);
});


When('I click the Iteration 3 start comparing button', async () => {
    await page.waitForSelector('#startCompareBtn', { timeout: 20000 });
    await page.click('#startCompareBtn');


    await new Promise(resolve => setTimeout(resolve, 1000));
});


Then('I should see comparison results in the chat window', async () => {
    await page.waitForSelector('#chatWindow', { timeout: 20000 });

    await page.waitForFunction(() => {
        const chatWindow = document.querySelector('#chatWindow');
        if (!chatWindow) return false;

        const text = chatWindow.innerText.trim();

        // For comparison mode, we expect the prompt plus model responses
        return text.length > 0;
    }, { timeout: 60000 });

    const chatText = await page.$eval('#chatWindow', el => el.innerText.trim());
    const errorText = await page.$eval('#chatError', el => el.innerText.trim());

    assert.ok(chatText.length > 0, 'Expected comparison results in the chat window');

    assert.strictEqual(
        errorText,
        '',
        `Expected no error message, but got: ${errorText}`
    );
    await new Promise(resolve => setTimeout(resolve, 7000));
});


// ── Comparison History ────────────────────────────


When('I click the comparison history tab', async () => {
    await page.waitForSelector('#tabComparison', { timeout: 20000 });
    await page.click('#tabComparison');


    await new Promise(resolve => setTimeout(resolve, 2000));
});


Then('I should see the comparison history area', async () => {
    await page.waitForSelector('#conversationList', { timeout: 20000 });


    const historyText = await page.$eval('#conversationList', el => el.innerText.trim());


    assert.ok(
        historyText.length > 0,
        'Expected comparison history area to display content'
    );
});


When('I open the first comparison conversation', async () => {
    await page.waitForSelector('#tabComparison', { timeout: 20000 });
    await page.click('#tabComparison');

    await page.waitForSelector('#conversationList', { timeout: 20000 });

    await page.waitForFunction(() => {
        const buttons = document.querySelectorAll('#conversationList button');
        return buttons.length > 0;
    }, { timeout: 30000 });

    const conversationButtons = await page.$$('#conversationList button');

    assert.ok(
        conversationButtons.length > 0,
        'Expected at least one comparison conversation in history'
    );

    await conversationButtons[0].click();

    // Wait for the loaded conversation to appear in chatWindow
    await page.waitForFunction(() => {
        const chatWindow = document.querySelector('#chatWindow');
        return chatWindow && chatWindow.innerText.trim().length > 0;
    }, { timeout: 30000 });

    await new Promise(resolve => setTimeout(resolve, 5000));
});