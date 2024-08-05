import { test, expect, Page } from '@playwright/test';
import { DataGenerator } from '../../CoreAutomation/Helpers/DataGenerator';
import { CLERK_FRONTEND_API } from '../../CoreAutomation/clerkConfig';
import { FileLogger, LogLevel } from '../../CoreAutomation/Helpers/FileLogger';
import ClientLoginLocators from '../../CoreAutomation/PageObjects/FEClient/ClientLoginPage';
import { UiActions } from '../../CoreAutomation/Utilities/UiActions';
import ClientSignUpLocators from '../../CoreAutomation/PageObjects/FEClient/ClientSignupPage';

declare global {
    interface Window {
        Clerk: any;
    }
}

interface VerificationResult {
    success: boolean;
    error?: string;
    details?: any
}

const logger = FileLogger.getInstance('logs/userRegistration.log', LogLevel.INFO);
const CLIENT_APP_URL = 'https://app.staging.mycedar.xyz';
const CLERK_STAGING_API = 'https://welcome-camel-52.clerk.accounts.dev';

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

async function waitForClerkToLoad(page: Page, timeout = 10000): Promise<boolean> {
    try {
        await page.waitForFunction(() => window.Clerk && window.Clerk.client, { timeout });
        return true;
    } catch (error) {
        console.error('Error waiting for Clerk to load:', error);
        return false;
    }
}

async function signUpAndVerifyEmail(page: Page, email: string, password: string): Promise<VerificationResult> {
    const clerkLoaded = await waitForClerkToLoad(page);
    if (!clerkLoaded) {
        logger.error('Clerk client failed to load within the timeout period');
        return { success: false, error: 'Clerk client failed to load' };
    }

    return await page.evaluate(async ({ email, password }: { email: string; password: string }): Promise<VerificationResult> => {
        if (!window.Clerk || !window.Clerk.client) {
            console.error('Clerk client not found even after waiting');
            return { success: false, error: 'Clerk client not found even after waiting' };
        }

        try {
            // Clear cookies and sign out existing session
            document.cookie.split(';').forEach(c => {
                document.cookie = c.trim().replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
            });
            await window.Clerk.signOut();

            console.log('Starting sign-up process...');
            // Create new sign-up
            const signUpResponse = await window.Clerk.client.signUp.create({
                emailAddress: email,
                password: password,
            });
            console.log('Sign-up response:', JSON.stringify(signUpResponse, null, 2));

            console.log('Preparing email verification...');
            // Prepare email address verification
            const prepareResponse = await signUpResponse.prepareEmailAddressVerification();
            console.log('Prepare verification response:', JSON.stringify(prepareResponse, null, 2));

            console.log('Attempting email verification...');
            // Attempt email address verification with the test code
            const verificationResponse = await signUpResponse.attemptEmailAddressVerification({
                code: '424242',
            });
            console.log('Verification response:', JSON.stringify(verificationResponse, null, 2));

            if (verificationResponse.status === 'complete') {
                console.log('Email verification successful');
                return { success: true };
            } else {
                console.log('Verification status:', verificationResponse.status);
                console.log('Verification error:', verificationResponse.error);
                return {
                    success: false,
                    error: `Verification failed: ${verificationResponse.error}`,
                    details: verificationResponse
                };
            }
        } catch (error) {
            console.error('Error during sign-up process:', error);
            return {
                success: false,
                error: `Sign-up process error: ${error.message}`,
                details: error
            };
        }
    }, { email, password });
}


test('user sign up with email code', async ({ page, context }) => {
    let uiActions = new UiActions(page, context);
    let loginPage = new ClientLoginLocators(page, context);

    // Get dev session token
    const token = await getDevSessionToken(page);

    // Visit the registration page with the token
    await page.goto(`${CLIENT_APP_URL}/auth/register/#/?redirect_url=${encodeURIComponent(CLIENT_APP_URL + '/app')}&dev_browser_token=${token}`);

    // Wait for Clerk to load
    const clerkLoaded = await waitForClerkToLoad(page);
    if (!clerkLoaded) {
        throw new Error('Clerk failed to load within the timeout period');
    }

    // Generate random user data
    const user = {
        email: DataGenerator.createRandomEmail(),
        password: DataGenerator.createRandomPassword()
    };

    // Log network requests
    page.on('request', request => {
        logger.info(`Network request: ${request.method()} ${request.url()}`);
    });
    page.on('response', async response => {
        const status = response.status();
        const url = response.url();
        logger.info(`Network response: ${status} ${url}`);
        if (status >= 400) {
            const text = await response.text();
            logger.error(`Error response body: ${text}`);
        }
    });

    // Perform sign-up and email verification
    const result = await signUpAndVerifyEmail(page, user.email, user.password);

    // Log the result of the sign-up and verification process
    logger.info(`Sign-up and verification result: ${JSON.stringify(result)}`);

    if (!result.success) {
        throw new Error(`Email verification failed: ${result.error || 'Unknown error'}`);
    }

    logger.info('Email verification successful');

    // Navigate to the login page
    await page.goto(`${CLIENT_APP_URL}/auth/login`);

    // Login to the app
    await uiActions.fillText(loginPage.emailInput, user.email);
    await uiActions.fillText(loginPage.passwordInput, user.password);
    await uiActions.clickElement(loginPage.continueButton);

    // Assert that the user is successfully logged in
    await expect(page.locator('[data-cy="welcomeMessage"]')).toBeVisible({ timeout: 10000 });
    logger.info('User successfully logged in');
});