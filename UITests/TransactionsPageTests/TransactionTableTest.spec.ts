import { test, expect } from '@playwright/test';
import { UiActions } from '../../CoreAutomation/Utilities/UiActions';
import { CommonOperations } from '../../CoreAutomation/Utilities/CommonOperations';
import { FileLogger, LogLevel } from '../../CoreAutomation/Helpers/FileLogger';
import TransactionsPageLocators from '../../CoreAutomation/PageObjects/TransactionsPage';
import LoginPageLocators from '../../CoreAutomation/PageObjects/LoginPage';

const ADMIN_APP_URL = CommonOperations.readConfiguration().AdminApp_url;
const logger = FileLogger.getInstance('logs/table_tests.log', LogLevel.INFO);

test.describe.configure({ timeout: 60000 });
test.describe('Edit Event time Tests', () => {
  let uiActions: UiActions;
  let loginPage: LoginPageLocators;
  let transactionPage: TransactionsPageLocators;

  const expectedHeaders = ["Cedar IDCreation TimeFrom MerchantTo MerchantTo Receiver Account / Wallet AddressFrom CurrencyFrom AmountTo CurrencyTo AmountClient Transaction StatusQuote Market RateQuote Service RateDeposit Received DateOn Ramp PartnerOff Ramp Partner​​​​​​​​​​​​​​​"]

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

    //Navigate to transactions page
    await uiActions.clickElement(loginPage.transactionPage);
    //Wait untill transation page is fully loaded
    await uiActions.waitForPageLoad();
    logger.info('Transactions page loaded')
  });

  test('should verify table header in In New tab', async ({ page }) => {
    await verifyTableHeader(page);
  });

  test('should verify table header in In Progress tab', async ({ page }) => {
    await uiActions.clickElement(transactionPage.inProgressTab);
    await uiActions.waitForPageLoad();
    await verifyTableHeader(page);
  });

  test('should verify table header in In Progress - Deposit Confirmed tab', async ({ page }) => {
    await uiActions.clickElement(transactionPage.inProgressDepositConfirmedTab);
    await uiActions.waitForPageLoad();
    await verifyTableHeader(page);
  });

  test('should verify table header in Completed - Telex Requested tab', async ({ page }) => {
    await uiActions.clickElement(transactionPage.completedTelexRequestedTab);
    await uiActions.waitForPageLoad();
    await verifyTableHeader(page);
  });

  test('should verify table header in Completed tab', async ({ page }) => {
    await uiActions.clickElement(transactionPage.completedTab);
    await uiActions.waitForPageLoad();
    await verifyTableHeader(page);
  });

  test('should verify table header in Cancelled tab', async ({ page }) => {
    await uiActions.clickElement(transactionPage.cancelledTab);
    await uiActions.waitForPageLoad();
    await verifyTableHeader(page);
  });

  test('should verify table header in All tab', async ({ page }) => {
    await uiActions.clickElement(transactionPage.allTab);
    await uiActions.waitForPageLoad();
    await verifyTableHeader(page);
  });

  async function verifyTableHeader(page: any) {
    const tableHeaderLocators = transactionPage.tableHeader;

    const headerTexts = await tableHeaderLocators.evaluateAll(headers =>
      headers.map(header => header.textContent?.trim() || '')
    );

    await expect(headerTexts).toEqual(expectedHeaders);
  }

});
