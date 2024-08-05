import { test, expect, Page, BrowserContext } from '@playwright/test';
import { UiActions } from '../../CoreAutomation/Utilities/UiActions';
import { CommonOperations } from '../../CoreAutomation/Utilities/CommonOperations';
import { FileLogger, LogLevel } from '../../CoreAutomation/Helpers/FileLogger';
import { DataGenerator } from '../../CoreAutomation/Helpers/DataGenerator';
import ClientLoginLocators from '../../CoreAutomation/PageObjects/FEClient/ClientLoginPage';
import ClientSignUpLocators from '../../CoreAutomation/PageObjects/FEClient/ClientSignupPage';
import { setupClerkTestingToken } from "@clerk/testing/playwright";
import { CLERK_FRONTEND_API } from '../../CoreAutomation/clerkConfig';

const CLIENT_APP_URL = CommonOperations.readConfiguration().ClientApp_url;
const CLERK_STAGING_API = 'https://welcome-camel-52.clerk.accounts.dev';
const logger = FileLogger.getInstance('logs/userRegistration.log', LogLevel.INFO);

async function getDevSessionToken(page: Page): Promise<string> {
    logger.info('Attempting to get dev session token');
    logger.info(`Sending POST request to: ${CLERK_STAGING_API}/v1/dev_browser`);

    try {
        const response = await page.request.post(`${CLERK_STAGING_API}/v1/dev_browser`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Log response status and headers
        logger.info(`Response status: ${response.status()}`);
        logger.info(`Response status text: ${response.statusText()}`);
        logger.info('Response headers:');
        const headers = response.headers();
        for (const [key, value] of Object.entries(headers)) {
            logger.info(`${key}: ${value}`);
        }

        // Log response body
        const responseBody = await response.text();
        logger.info(`Response body: ${responseBody}`);

        if (!response.ok()) {
            throw new Error(`Failed to get dev session token: ${response.statusText()}`);
        }

        const data = JSON.parse(responseBody);
        if (!data.token) {
            throw new Error('Dev session token not found in response');
        }

        logger.info('Successfully retrieved dev session token');
        return data.token;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Error in getDevSessionToken: ${error.message}`);
        } else {
            logger.error('An unknown error occurred in getDevSessionToken');
        }
        throw error;
    }
}

async function createEmailAddress(page: Page, email: string, devSessionToken: string): Promise<string> {
    const createEmailUrl = `${CLERK_STAGING_API}/v1/client/sign_ups?_clerk_dev_session=${devSessionToken}`;
    logger.info(`Attempting to create email address: ${email}`);
    logger.info(`Sending POST request to: ${createEmailUrl}`);

    const response = await page.request.post(createEmailUrl, {
        data: { email_address: email },
        headers: { 'Content-Type': 'application/json' }
    });

    logger.info(`Response status: ${response.status()}`);
    logger.info(`Response status text: ${response.statusText()}`);

    if (!response.ok()) {
        throw new Error(`Failed to create email address: ${response.statusText()}`);
    }

    const data = await response.json();
    logger.info(`Email creation successful. Email ID: ${data.id}`);
    return data.id;
}

async function verifyEmailAddress(page: Page, emailId: string, verificationCode: string, devSessionToken: string): Promise<void> {
    const verifyUrl = `${CLERK_STAGING_API}/v1/me/email_addresses/${emailId}/attempt_verification?_clerk_dev_session=${devSessionToken}`;
    logger.info(`Attempting to verify email address. Email ID: ${emailId}`);
    logger.info(`Sending POST request to: ${verifyUrl}`);

    const response = await page.request.post(verifyUrl, {
        data: { code: verificationCode },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    logger.info(`Response status: ${response.status()}`);
    logger.info(`Response status text: ${response.statusText()}`);

    if (!response.ok()) {
        throw new Error(`Failed to verify email address: ${response.statusText()}`);
    }

    logger.info('Email verification successful');
}

async function completeOnboarding(page: Page, devSessionToken: string): Promise<void> {
    const onboardingUrl = `${CLIENT_APP_URL}/onboarding?_clerk_dev_session=${devSessionToken}`;
    logger.info(`Navigating to onboarding page: ${onboardingUrl}`);
    await page.goto(onboardingUrl);

    await page.fill('input[name="applicationName"]', 'Test Application');
    await page.fill('input[name="applicationType"]', 'B2C');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    logger.info('Onboarding form submitted');
}

async function checkOnboardingStatus(page: Page, devSessionToken: string): Promise<boolean> {
    const url = `${CLERK_STAGING_API}/v1/me?_clerk_dev_session=${devSessionToken}`;
    logger.info(`Checking onboarding status. Sending GET request to: ${url}`);

    const response = await page.request.get(url);
    const userData = await response.json();

    const isComplete = userData.publicMetadata?.onboardingComplete === true;
    logger.info(`Onboarding status: ${isComplete ? 'Complete' : 'Incomplete'}`);
    return isComplete;
}

test.describe('User registration and onboarding test', () => {
    let uiActions: UiActions;
    let loginPage: ClientLoginLocators;
    let signup: ClientSignUpLocators;
    let devSessionToken: string;

    test.beforeEach(async ({ page, context }) => {
        await setupClerkTestingToken({
            page,
            options: {
                frontendApiUrl: new URL(CLERK_FRONTEND_API).hostname
            }
        });
        uiActions = new UiActions(page, page.context());
        loginPage = new ClientLoginLocators(page, page.context());
        signup = new ClientSignUpLocators(page, page.context());
        try {
            devSessionToken = await getDevSessionToken(page);
            logger.info('Dev session token retrieved successfully');
        } catch (error) {
            logger.error('Failed to get dev session token. Proceeding without it.');
            devSessionToken = '';
        }
    });

    test('Should register a user, verify email, and complete onboarding successfully', async ({ page }) => {
        const email = DataGenerator.createRandomEmail();
        const password = DataGenerator.createRandomPassword();

        await test.step('Register user', async () => {
            await uiActions.page.goto(CLIENT_APP_URL);
            await uiActions.clickElement(loginPage.signup);
            await uiActions.fillText(signup.email, email);
            await uiActions.fillText(signup.password, password);
            await uiActions.clickElement(signup.continueButton);
        });

        await test.step('Create and verify email', async () => {
            const emailId = await createEmailAddress(page, email, devSessionToken);
            const verificationCode = '424242'; // Using the fixed test verification code
            await verifyEmailAddress(page, emailId, verificationCode, devSessionToken);
        });

        await test.step('Complete onboarding', async () => {
            await completeOnboarding(page, devSessionToken);
        });

        await test.step('Verify onboarding completion', async () => {
            const isOnboardingComplete = await checkOnboardingStatus(page, devSessionToken);
            expect(isOnboardingComplete).toBe(true);
        });

        logger.info(`User registered and onboarding completed for email: ${email}`);
    });
});