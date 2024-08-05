import { test, expect, Page } from '@playwright/test';
import { UiActions } from '../../CoreAutomation/Utilities/UiActions';
import { CommonOperations } from '../../CoreAutomation/Utilities/CommonOperations';
import { FileLogger, LogLevel } from '../../CoreAutomation/Helpers/FileLogger';
import { DataGenerator } from '../../CoreAutomation/Helpers/DataGenerator';
import ClientLoginLocators from '../../CoreAutomation/PageObjects/FEClient/ClientLoginPage';
import ClientSendPageLocators from '../../CoreAutomation/PageObjects/FEClient/Send';
import path from 'path';

const CLIENT_APP_URL = CommonOperations.readConfiguration().ClientApp_url;
const USER = CommonOperations.readConfiguration().clientUsername;
const PASS = CommonOperations.readConfiguration().clientPassword;
const logger = FileLogger.getInstance('logs/userSendTransaction.log', LogLevel.INFO);
const PAY_CURRENCY = CommonOperations.readConfiguration().currencyToSend;
const PAID_CURRENCY = CommonOperations.readConfiguration().youArePaying;

test.describe('User send transaction flow', () => {
    let uiActions: UiActions;
    let loginPage: ClientLoginLocators;
    let sendPage: ClientSendPageLocators;

    test.beforeEach(async ({ page }) => {
        uiActions = new UiActions(page, page.context());
        loginPage = new ClientLoginLocators(page, page.context());
        sendPage = new ClientSendPageLocators(page, page.context());

        await uiActions.page.goto(CLIENT_APP_URL);
        await uiActions.fillText(loginPage.emailInput, USER);
        await uiActions.clickElement(loginPage.continueButton);
        await uiActions.fillText(loginPage.passwordInput, PASS);
        await uiActions.clickElement(loginPage.continueButton);
    });

    test('should log in and navigate to send page', async ({ page }) => {
        // Navigate to Send transaction page 
        await uiActions.clickElement(sendPage.sendPageLink);

        // Fill in the amount of the transaction
        await uiActions.fillText(sendPage.amount, "5000");

        // Log current values before setting new ones
        logger.info(`Current 'Currency to Send' value: ${await sendPage.currencyToSend.inputValue()}`);
        logger.info(`Current 'You're Paying' value: ${await sendPage.youArePaying.inputValue()}`);

        // Set the Currency to Send
        await uiActions.setMUIAutocompleteValue(sendPage.currencyToSend, PAY_CURRENCY);
        logger.info(`Set 'Currency to Send' to: ${PAY_CURRENCY}`);

        // Set the 'You're Paying' currency
        await uiActions.setMUIAutocompleteValue(sendPage.youArePaying, PAID_CURRENCY);
        logger.info(`Set 'You're Paying' to: ${PAID_CURRENCY}`);

        // Log values after setting to verify
        logger.info(`Final 'Currency to Send' value: ${await sendPage.currencyToSend.inputValue()}`);
        logger.info(`Final 'You're Paying' value: ${await sendPage.youArePaying.inputValue()}`);


        // Upload invoice file
        const filePath = path.resolve(__dirname, '..', '..', 'Files', 'simple-invoice-template.docx');
        await uiActions.uploadFile('input[type="file"]', filePath);

        // Select vendor
        await uiActions.clickElement(sendPage.sendTo);
        await uiActions.selectOptionByName('Automation Test vendor');

        // Select bank account for payout
        await uiActions.clickElement(sendPage.bankAccountInput);
        await uiActions.selectOptionByName('Automation Test vendor /');

        // Select purpose of transaction
        await uiActions.clickElement(sendPage.purpose);
        await uiActions.selectOptionByName('Goods Purchased');

        // Confirm request
        await uiActions.clickElement(sendPage.confirmRequestButton);

        await uiActions.verifyNotificationDialog(
            'Request Submitted',
            'Thank you for submitting your request. You will receive an email once your request has been approved.'
        );
        logger.info('Notification dialog verified successfully');
    });
})