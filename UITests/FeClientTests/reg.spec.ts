import { test, expect, Page, BrowserContext } from '@playwright/test';
import { UiActions } from '../../CoreAutomation/Utilities/UiActions';
import { CommonOperations } from '../../CoreAutomation/Utilities/CommonOperations';
import { FileLogger, LogLevel } from '../../CoreAutomation/Helpers/FileLogger';
import { DataGenerator } from '../../CoreAutomation/Helpers/DataGenerator';
import ClientLoginLocators from '../../CoreAutomation/PageObjects/FEClient/ClientLoginPage';
import ClientSignUpLocators from '../../CoreAutomation/PageObjects/FEClient/ClientSignupPage';
import { setupClerkTestingToken } from "@clerk/testing/playwright";
import { CLERK_FRONTEND_API } from '../../CoreAutomation/clerkConfig';
import { EmailCodeFactor, SignInCreateParams } from "@clerk/types";

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
    const createEmailUrl = `${CLERK_STAGING_API}/v1/me/email_addresses?_clerk_dev_session=${devSessionToken}`;
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

async function login(page: Page, username: string, password: string) {
    await page.goto(CLIENT_APP_URL);
    await page.fill('input[name=identifier]', username);
    await page.click('button[data-localization-key=formButtonPrimary]');
    await page.fill('input[name=password]', password);
    await page.click('button[data-localization-key=formButtonPrimary]');
    await expect(page).toHaveURL(/app\/business\/\d+\/overview/);
}

async function userSignInWithEmailCode(page: Page, email: string, devSessionToken: string) {
    logger.info('Initializing auth state for email code sign-in.');
    await setupClerkTestingToken({ page });

    const status = await page.evaluate(async ({ email, devSessionToken }) => {
        const clerk = (window as any).Clerk;
        if (clerk && clerk.client) {
            await clerk.signOut();
            const signInResp = await clerk.client.signIn.create({ 
                identifier: email,
                _clerk_dev_session: devSessionToken 
            });
            const { emailAddressId } = signInResp.supportedFirstFactors.find(
                (ff: any) => ff.strategy === "email_code" && ff.safeIdentifier === email
            ) as EmailCodeFactor;
            await clerk.client.signIn.prepareFirstFactor({
                strategy: "email_code",
                emailAddressId,
                _clerk_dev_session: devSessionToken
            });
            const attemptResponse = await clerk.client.signIn.attemptFirstFactor({
                strategy: "email_code",
                code: "424242",
                _clerk_dev_session: devSessionToken
            });
            return attemptResponse.status;
        }
        return null;
    }, { email, devSessionToken });

    if (status === 'complete') {
        logger.info('Sign in with email code successful');
    } else {
        logger.error('Sign in with email code failed');
    }
}

async function userSignIn(page: Page, email: string, password: string, devSessionToken: string) {
    logger.info('Initializing auth state for password sign-in.');
    await setupClerkTestingToken({ page });

    const status = await page.evaluate(async ({ email, password, devSessionToken }) => {
        const clerk = (window as any).Clerk;
        if (clerk && clerk.client) {
            await clerk.signOut();
            const params = {
                identifier: email,
                password,
                strategy: "password",
                _clerk_dev_session: devSessionToken
            };
            const attemptResponse = await clerk.client.signIn.create(params);
            return attemptResponse.status;
        }
        return null;
    }, { email, password, devSessionToken });

    if (status === 'complete') {
        logger.info('Sign in with password successful');
    } else {
        logger.error('Sign in with password failed');
    }
}

async function userSignUpWithEmailCode(page: Page, email: string, password: string, devSessionToken: string) {
    logger.info('Initializing auth state for email code sign-up.');
    await setupClerkTestingToken({ page });

    const status = await page.evaluate(async ({ email, password, devSessionToken }) => {
        const clerk = (window as any).Clerk;
        if (clerk && clerk.client) {
            await clerk.signOut();
            await clerk.client.signUp.create({
                emailAddress: email,
                password,
                _clerk_dev_session: devSessionToken
            });
            await clerk.client.signUp.prepareEmailAddressVerification({ _clerk_dev_session: devSessionToken });
            const res = await clerk.client.signUp.attemptEmailAddressVerification({
                code: "424242",
                _clerk_dev_session: devSessionToken
            });
            return res.verifications.emailAddress.status;
        }
        return null;
    }, { email, password, devSessionToken });

    if (status === 'verified') {
        logger.info('Sign-up and verification successful');
    } else {
        logger.error('Sign-up or verification failed');
    }
}

test.describe('User registration and authentication tests', () => {
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
            await userSignUpWithEmailCode(page, email, password, devSessionToken);
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

    test('Should sign in with email code', async ({ page }) => {
        const email = 'testuser@example.com'; // Use a known test user email
        await userSignInWithEmailCode(page, email, devSessionToken);
    });

    test('Should sign in with email and password', async ({ page }) => {
        const email = 'testuser@example.com'; // Use a known test user email
        const password = 'password123'; // Use a known test user password
        await userSignIn(page, email, password, devSessionToken);
    });

    test('Should login with username and password', async ({ page }) => {
        const username = 'testuser@example.com'; // Use a known test user email
        const password = 'password123'; // Use a known test user password
        await login(page, username, password);
    });
});