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
    // insert generated code here



    // insert generated code here
    // start recording
    await page.pause();
    // teardown after recording
    await context.close();
    await browser.close();
})();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function isVisible(locator, timeout) {
    if (timeout) {
        await locator.isVisible({timeout: timeout});
    } else {
        await locator.isVisible({timeout: 5000});
    }
}
