import { test, expect } from '@playwright/test';
import { UiActions } from '../../CoreAutomation/Utilities/UiActions';
import { CommonOperations } from '../../CoreAutomation/Utilities/CommonOperations';
import { FileLogger, LogLevel } from '../../CoreAutomation/Helpers/FileLogger';
import TransactionsPageLocators from '../../CoreAutomation/PageObjects/TransactionsPage';
import LoginPageLocators from '../../CoreAutomation/PageObjects/LoginPage';

const ADMIN_APP_URL = CommonOperations.readConfiguration().AdminApp_url;
const logger = FileLogger.getInstance('logs/table_navigation_tests.log', LogLevel.INFO);

test.describe.configure({ timeout: 60000 });

test.describe('Transactions Table Navigation Tests', () => {
  let uiActions: UiActions;
  let loginPage: LoginPageLocators;
  let transactionPage: TransactionsPageLocators;

  // Navigate to the transaction page before each test
  test.beforeEach(async ({ page, context }) => {
    uiActions = new UiActions(page, context);
    loginPage = new LoginPageLocators(page, context);
    transactionPage = new TransactionsPageLocators(page, context);

    await uiActions.page.goto(ADMIN_APP_URL);

    // Login to admin app
    await uiActions.fillText(loginPage.emailInput, CommonOperations.readConfiguration().username);
    await uiActions.fillText(loginPage.passwordInput, CommonOperations.readConfiguration().password);
    await uiActions.clickElement(loginPage.loginButton);
    logger.info('Logged in to admin application');

    // Navigate to transactions page
    await uiActions.clickElement(loginPage.transactionPage);

    // Wait until transaction page is fully loaded
    await uiActions.waitForPageLoad();

    logger.info('Transactions page loaded');
  });

  test('should navigate through all pages using navigation buttons', async ({ page }) => {
    // Navigate to page 2
    await transactionPage.navigateToPage2.click();
    logger.info('Navigated to page 2');
    expect(await transactionPage.page2Button.isVisible()).toBeTruthy();

    // Navigate to page 3
    await transactionPage.navigateToPage3.click();
    logger.info('Navigated to page 3');
    expect(await transactionPage.page3Button.isVisible()).toBeTruthy();

    // Navigate to previous page
    await transactionPage.navigateToPreviousPage.click();
    logger.info('Navigated to previous page');
    expect(await transactionPage.page2Button.isVisible()).toBeTruthy();

    // Navigate to next page
    await transactionPage.navigateToNextPage.click();
    logger.info('Navigated to next page');
    expect(await transactionPage.page3Button.isVisible()).toBeTruthy();

    // Navigate to first page
    await transactionPage.navigateToFirstPage.click();
    logger.info('Navigated to first page');
    const firstPageButton = page.locator('button[aria-label="page 1"][aria-current="true"]');
    expect(await firstPageButton.isVisible()).toBeTruthy();

    // Navigate to last page
    await transactionPage.navigateToLastPage.click();
    logger.info('Navigated to last page');
    expect(await transactionPage.page3Button.isVisible()).toBeTruthy();
  });
});
