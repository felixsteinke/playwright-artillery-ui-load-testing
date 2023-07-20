const {chromium} = require('@playwright/test');

// configuration
const username = '';
const password = '';
const pageUrl = '';

// codegen browser setup
(async () => {
    // launch options
    const browser = await chromium.launch({headless: false});
    // context options
    const context = await browser.newContext({
        ignoreHTTPSErrors: true,
        httpCredentials: {"username": username, "password": password}
    });
    await context.route('**/*', route => route.continue());
    // open page
    const page = await context.newPage();
    await page.goto(pageUrl);
    // insert generated code before breakpoint


    // breakpoint for recording
    await page.pause();
    // insert generated code after breakpoint


    // teardown after recording
    await context.close();
    await browser.close();
})();

// === UTILITY ===

async function isVisible(locator, timeout) {
    if (!timeout) {
        timeout = 5000;
    }
    await locator.isVisible({timeout: timeout});
}

async function checkSingleAdditionalFrame(page, timeout, attempts) {
    if (!timeout) {
        timeout = 10000;
    }
    if (!attempts) {
        attempts = 10;
    }
    for (let i = 0; i < attempts; i++) {
        if (page.frames().length <= 2) {
            return;
        } else {
            await sleep(timeout / attempts);
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
