import { test, expect } from '@playwright/test';
import { UiActions } from '../../CoreAutomation/Utilities/UiActions';
import { CommonOperations } from '../../CoreAutomation/Utilities/CommonOperations';
import { FileLogger, LogLevel } from '../../CoreAutomation/Helpers/FileLogger';
import { CalendarPageLocators } from '../../CoreAutomation/PageObjects/CalendarPage';

const CALENDAR_URL = CommonOperations.readConfiguration().calendarApp_url;
const logger = FileLogger.getInstance('logs/calendar_tests.log', LogLevel.INFO);

test.describe('Create new event Tests', () => {
    let uiActions: UiActions;
    const eventText = 'New event you just created'; // Event text variable

    // Navigate to the calendar page before the test
    test.beforeEach(async ({ page, context }) => {
        uiActions = new UiActions(page, context);
        await uiActions.page.goto(CALENDAR_URL);
        // Switch to infinite scroll
        await uiActions.clickElement(uiActions.page.locator(CalendarPageLocators.INFINITE_SCROLL_BUTTON));
        logger.info('Clicked on Infinite scroll button');
    });

    test('should create a new event in a Day view', async ({ page }) => {
        // Set up dialog handler before clicking
        uiActions.page.once('dialog', dialog => {
            logger.info(`Dialog message: ${dialog.message()}`);
            dialog.accept().catch(() => {});
        });
        // Click on a time slot to create a new event
        await uiActions.clickElement(uiActions.page.locator(CalendarPageLocators.SLOT_0));
        logger.info('Clicked on a time slot to create a new event.');

        // Verify the new event's existence
        const newEventElement = page.locator(CalendarPageLocators.NEW_EVENT);
        const isEventVisible = await newEventElement.isVisible();
        expect(isEventVisible).toBe(true);
        logger.info('New event created successfully.');

        // Optionally, log the result
        if (isEventVisible) {
            logger.info('New event created successfully in Day view');
        } else {
            logger.error('Failed to create a new event in Day view');
        }
    });

        test('should create a new event in Month view', async ({ page }) => {
        // Set up dialog handler before clicking
        uiActions.page.once('dialog', dialog => {
            logger.info(`Dialog message: ${dialog.message()}`);
            dialog.accept().catch(() => {});
        });   
        // Switch to Month view
        await uiActions.clickElement(uiActions.page.locator(CalendarPageLocators.MONTH_VIEW_BUTTON));
        logger.info('Clicked on Month view button');

        // Click on a time slot to create a new event in Month view
        await uiActions.clickElement(uiActions.page.locator(CalendarPageLocators.SLOT_1));
        logger.info('Clicked on a time slot to create a new event in Month view.');

        // Verify the new event's existence in Month view
        const newEventElement = page.locator(CalendarPageLocators.NEW_EVENT);
        const isEventVisible = await newEventElement.isVisible();
        expect(isEventVisible).toBe(true);
        logger.info('New event created successfully in Month view.');

        // Optionally, log the result
        if (isEventVisible) {
            logger.info('New event created successfully in Month view');
        } else {
            logger.error('Failed to create a new event in Month view');
        }
    });

    test('should not create a new event if the dialog is dismissed', async ({ page }) => {
        // Set up dialog handler to dismiss the dialog
        uiActions.page.once('dialog', dialog => {
            logger.info(`Dialog message: ${dialog.message()}`);
            dialog.dismiss().catch(() => {});
            logger.info('Dialog dismissed');
        });

        // Click on a time slot to create a new event
        await uiActions.clickElement(uiActions.page.locator(CalendarPageLocators.SLOT_2));
        logger.info('Clicked on a time slot to create a new event.');

        // Verify the new event's existence
        const newEventElement = page.locator(CalendarPageLocators.NEW_EVENT);
        const isEventVisible = await newEventElement.isVisible();
        expect(isEventVisible).toBe(false);
        logger.info('New event was not created because the dialog was dismissed.');

        // Optionally, log the result
        if (!isEventVisible) {
            logger.info('New event was not created as expected because the dialog was dismissed');
        } else {
            logger.error('Event was created despite dismissing the dialog');
        }
    });

});
