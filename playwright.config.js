// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './AdministrativoHgi360PW',
    testMatch: '**/*.js',
    testIgnore: '**/Grabar/**',
    timeout: 10 * 60 * 1000,
    expect: { timeout: 10000 },
    fullyParallel: false,
    workers: 1,
    retries: 0,
    reporter: [['list'], ['html', { outputFolder: 'Reportes/playwright', open: 'never' }]],
    outputDir: 'Reportes/playwright-resultados',
    use: {
        channel: 'chrome',
        headless: false,
        viewport: null,
        launchOptions: { args: ['--start-maximized'] },
        actionTimeout: 15000,
        navigationTimeout: 60000,
        ignoreHTTPSErrors: true,
        acceptDownloads: true,
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure'
    }
});
