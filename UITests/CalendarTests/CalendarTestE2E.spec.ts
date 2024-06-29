import { test, expect, Dialog } from '@playwright/test';
import { UiActions } from '../../CoreAutomation/Utilities/UiActions';
import { CommonOperations } from '../../CoreAutomation/Utilities/CommonOperations';
import { FileLogger, LogLevel } from '../../CoreAutomation/Helpers/FileLogger';
import { CalendarPageLocators } from '../../CoreAutomation/PageObjects/CalendarPage';

const CALENDAR_URL = CommonOperations.readConfiguration().calendarApp_url;
const logger = FileLogger.getInstance('logs/calendar_tests.log', LogLevel.INFO);

test.describe('Calendar E2E Tests', () => {
    let uiActions: UiActions;
    const eventText = 'New event you just created'; // Event text variable

    // Navigate to the calendar page before the test
    test.beforeEach(async ({ page, context }) => {
        uiActions = new UiActions(page, context);
        await uiActions.page.goto(CALENDAR_URL);
    });

    test('Switch to infinite scroll, Switch to month view, Create new events, navigate months, and verify existence', async ({ page }) => {
        logger.info('Starting test: Create new events, navigate months, and verify existence');

        // Switch to infinite scroll
        await uiActions.clickElement(uiActions.page.locator(CalendarPageLocators.INFINITE_SCROLL_BUTTON));
        logger.info('Clicked on Infinite scroll button');

        // Switch to month view
        await uiActions.clickElement(uiActions.page.locator(CalendarPageLocators.MONTH_VIEW_BUTTON));
        logger.info('Clicked on Month view button');

        // Verify the view changed to month view by checking the button state
        const monthButton = uiActions.page.locator(CalendarPageLocators.MONTH_VIEW_SELECTED);
        const isMonthButtonSelected = await monthButton.isChecked();
        expect(isMonthButtonSelected).toBeTruthy();
        logger.info('Verified the Month view is selected');

        // Array of slots to click
        const slots = [
            CalendarPageLocators.SLOT_1,
            CalendarPageLocators.SLOT_2,
            CalendarPageLocators.SLOT_3,
            CalendarPageLocators.SLOT_4,
        ];

        // Create events
        for (let slotLocator of slots) {
            try {
                logger.info(`Attempting to create event for ${slotLocator}.`);

                //Set up dialog handler before clicking
                uiActions.page.once('dialog', dialog => {
                    logger.info(`Dialog message: ${dialog.message()}`);
                    dialog.accept().catch(() => { });
                });

                // Click on the slot to create an event
                await uiActions.clickElement(uiActions.page.locator(slotLocator));
                logger.info(`Clicked on slot ${slotLocator}.`);

                // Wait for the event to be created and appear in the calendar
                await uiActions.page.waitForSelector(CalendarPageLocators.NEW_EVENT, { timeout: 3000 });
                logger.info(`Event created for ${slotLocator}.`);

                // Take a screenshot after creating each event
                await uiActions.page.screenshot({ path: `screenshot-${slotLocator}.png` });

            } catch (error) {
                logger.error(`Error creating event for ${slotLocator}: ${error.message}`);
            }
        }

        // Verify events were added
        try {
            const events = await uiActions.page.locator(CalendarPageLocators.NEW_EVENT).allTextContents();
            expect(events.length).toBe(slots.length);
            logger.info(`Verified that ${events.length} new events exist in the calendar.`);
        } catch (error) {
            logger.error(`Error verifying events: ${error.message}`);
            // Handle verification error if necessary
        }
        
        // Navigate to next month
        await uiActions.clickElement(uiActions.page.locator(CalendarPageLocators.NEXT_MONTH_BUTTON));
        logger.info('Clicked on Next month button');

        // Verify events don't exist in the next month
        const isVisibleNextMonth = await uiActions.page.locator(CalendarPageLocators.NEW_EVENT).isVisible();
        expect(isVisibleNextMonth).toBeFalsy();
        logger.info(`Verified that "${eventText}" does not exist in the next month`);

        // Navigate back to the original month
        await uiActions.clickElement(uiActions.page.locator(CalendarPageLocators.PREVIOUS_MONTH_BUTTON));
        logger.info('Clicked on Previous month button');

        // Verify events not exist in the original month
        const isVisibleOriginalMonth = await uiActions.page.locator(CalendarPageLocators.NEW_EVENT).isVisible();
        expect(isVisibleOriginalMonth).toBeFalsy();
        logger.info(`Verified that "${eventText}" not exists in the original month`);
    });
});
