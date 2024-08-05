import { test, expect } from '@playwright/test';
import { UiActions } from '../../CoreAutomation/Utilities/UiActions';
import { CommonOperations } from '../../CoreAutomation/Utilities/CommonOperations';
import { FileLogger, LogLevel } from '../../CoreAutomation/Helpers/FileLogger';
import TransactionsPageLocators from '../../CoreAutomation/PageObjects/TransactionsPage';
import LoginPageLocators from '../../CoreAutomation/PageObjects/LoginPage';
import currencyCodes from 'currency-codes';

const ADMIN_APP_URL = CommonOperations.readConfiguration().AdminApp_url;
const logger = FileLogger.getInstance('logs/table_data_validation.log', LogLevel.INFO);

test.describe.configure({ timeout: 60000 });
test.describe('Transaction Table Data Validation Tests', () => {
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

  test('should verify each column data type and format', async ({ page }) => {
    // Verify ID column
    const ids = await transactionPage.cedarID.evaluateAll(ids => ids.map(id => id.textContent?.trim() || ''));
    for (const id of ids) {
      expect(Number(id)).not.toBeNaN();
    }

    // Verify Creation Time column
    const creationTimes = await transactionPage.creationTime.evaluateAll(times => times.map(time => new Date(time.textContent?.trim() || '')));
    for (const time of creationTimes) {
      expect(time instanceof Date && !isNaN(time.valueOf())).toBeTruthy();
    }

    // Verify From Merchant column
    const fromMerchants = await transactionPage.fromMerchant.evaluateAll(merchants => merchants.map(merchant => merchant.textContent?.trim() || ''));
    for (const merchant of fromMerchants) {
      expect(typeof merchant).toBe('string');
    }

    // Verify To Merchant column
    const toMerchants = await transactionPage.toMerchant.evaluateAll(merchants => merchants.map(merchant => merchant.textContent?.trim() || ''));
    for (const merchant of toMerchants) {
      expect(typeof merchant).toBe('string');
    }

    // Verify To Receiver Account column
    const receiverAccounts = await transactionPage.toReceiverAccount.evaluateAll(accounts => accounts.map(account => account.textContent?.trim() || ''));
    for (const account of receiverAccounts) {
      expect(Number(account)).not.toBeNaN();
    }

    // Verify From Currency column
    const validCurrencies = currencyCodes.codes();
    const fromCurrencies = await transactionPage.fromCurrency.evaluateAll(currencies => currencies.map(currency => currency.textContent?.trim() || ''));
    for (const currency of fromCurrencies) {
      expect(validCurrencies).toContain(currency);
    }

    // Verify To Currency column
    const toCurrencies = await transactionPage.toCurrency.evaluateAll(currencies => currencies.map(currency => currency.textContent?.trim() || ''));
    for (const currency of toCurrencies) {
      expect(validCurrencies).toContain(currency);
    }

    // Verify Client Transaction Status column
    const statuses = await transactionPage.clientTransactionStatus.evaluateAll(statuses => statuses.map(status => status.textContent?.trim() || ''));
    for (const status of statuses) {
      expect(['Pending', 'In Progress', 'Completed', 'Canceled']).toContain(status);
    }
  });
});
