const {chromium} = require('@playwright/test');

//configuration
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
    // start recording
    await page.pause();
})();
