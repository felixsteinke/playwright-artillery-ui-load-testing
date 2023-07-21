module.exports = { usageScenario };

async function usageScenario(page) {
    
    await page.goto('https://www.google.com/');

    const e2 = page.getByRole('button', { name: 'Alle akzeptieren' });
    await isVisible(e2);
    await e2.click();
    await sleep(2000);

    const e3 = page.getByRole('combobox', { name: 'Suche' });
    await isVisible(e3);
    await e3.click();
    await sleep(2000);

    const e4 = page.getByRole('combobox', { name: 'Suche' });
    await isVisible(e4);
    await e4.fill('Playwright Codegen Tutorial');
    await sleep(2000);

    const e5 = page.getByRole('button', { name: 'Auf gut Glück!' }).first();
    await isVisible(e5);
    await e5.click();
    await sleep(2000);

    // manual modification
    await sleep(5000);
}

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
