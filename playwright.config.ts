import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './Automation',
  timeout: 30000,
  retries: 2,
  projects: [
    {
      name: 'api',
      testDir: './ApiTests',
      use: {
        baseURL: 'https://petstore.swagger.io/v2',
        headless: true,
        viewport: { width: 1280, height: 720 },
        actionTimeout: 10000,
      },
    },
    {
      name: 'ui',
      testDir: './UITests',
      use: {
        baseURL: 'https://stephenchou1017.github.io/scheduler',
        headless: false,
        viewport: { width: 1280, height: 720 },
        actionTimeout: 10000,
      },
    },
  ],
  use: {
    baseURL: 'https://stephenchou1017.github.io/scheduler',
    headless: false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
  },
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results.json' }],
    ['html', { outputFolder: 'playwright-report' }],
  ],
});
