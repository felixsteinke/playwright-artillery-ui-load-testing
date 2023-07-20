import {test} from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('https://www.google.com/');
    await page.getByRole('button', { name: 'Alle akzeptieren' }).click();
    await page.getByRole('combobox', { name: 'Suche' }).click();
    await page.getByRole('combobox', { name: 'Suche' }).fill('Playwright Codegen Tutorial');
    await page.getByRole('button', { name: 'Auf gut Glück!' }).first().click();
});
