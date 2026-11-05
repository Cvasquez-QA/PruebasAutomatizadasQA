// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testMatch: '**/*.js',
    projects: [
        { name: 'administrativo', testDir: './AdministrativoHgi360PW', testIgnore: '**/Grabar/**' },
        { name: 'generales', testDir: './GeneralesPW' }
    ],
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
