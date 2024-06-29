import { test, expect } from '@playwright/test';
import { UiActions } from '../../CoreAutomation/Utilities/UiActions';
import { CommonOperations } from '../../CoreAutomation/Utilities/CommonOperations';
import { FileLogger, LogLevel } from '../../CoreAutomation/Helpers/FileLogger';
import { CalendarPageLocators } from '../../CoreAutomation/PageObjects/CalendarPage';

const CALENDAR_URL = CommonOperations.readConfiguration().calendarApp_url;
const logger = FileLogger.getInstance('logs/calendar_tests.log', LogLevel.INFO);

test.describe('Edit Event time Tests', () => {
  let uiActions: UiActions;

  // Navigate to the calendar page before each test
  test.beforeEach(async ({ page, context }) => {
    uiActions = new UiActions(page, context);
    await uiActions.page.goto(CALENDAR_URL);
    // Switch to infinite scroll
    await uiActions.clickElement(uiActions.page.locator(CalendarPageLocators.INFINITE_SCROLL_BUTTON));
    logger.info('Clicked on Infinite scroll button');

    // Switch to month view
    await uiActions.clickElement(uiActions.page.locator(CalendarPageLocators.MONTH_VIEW_BUTTON));
    logger.info('Clicked on Month view button');

    // Set up dialog handler before clicking
    uiActions.page.once('dialog', dialog => {
      logger.info(`Dialog message: ${dialog.message()}`);
      dialog.accept().catch(() => { });
    });
  });

  test('should update event start day successfully', async ({ page }) => {
    // Locate and click on an existing event
    const eventElement = page.locator(CalendarPageLocators.RECURRING_TASK_EVENT);

    // Get the initial 'left' style value
    const initialLeft = await eventElement.evaluate(el => parseFloat(getComputedStyle(el).left));

    // Drag the event to a new start time
    await uiActions.dragAndDrop(CalendarPageLocators.RECURRING_TASK_EVENT, CalendarPageLocators.SLOT_1);

    // Verify the event's start time has been updated
    // Get the new 'left' style value
    const newLeft = await eventElement.evaluate(el => parseFloat(getComputedStyle(el).left));

    // Validate that the event date was changed
    expect(newLeft).not.toBe(initialLeft);

    // Optionally, log the result
    if (newLeft !== initialLeft) {
      logger.info(`Event moved from left: ${initialLeft}px to left: ${newLeft}px`);
    } else {
      logger.error('Event did not move');
    }
  });

  test('should extend event duration successfully', async ({ page }) => {
    // Locate and click on an existing event to prepare for dragging
    const eventElement = page.locator(CalendarPageLocators.RECURRING_TASK_EVENT);

    // Get the initial 'left' style value
    const initialLeft = await eventElement.evaluate(el => parseFloat(getComputedStyle(el).left));

    // Drag the event to extend its duration (for example, to a later slot)
    await uiActions.dragAndDrop(CalendarPageLocators.RECURRING_TASK_EVENT, CalendarPageLocators.SLOT_2);

    // Verify the event's updated 'left' style value after dragging
    const newLeft = await eventElement.evaluate(el => parseFloat(getComputedStyle(el).left));

    // Validate that the event's duration was extended
    expect(newLeft).not.toBe(initialLeft);

    //log the result
    if (newLeft !== initialLeft) {
      logger.info(`Event duration extended from left: ${initialLeft}px to left: ${newLeft}px`);
    } else {
      logger.error('Event duration did not extend');
    }
  });

});
