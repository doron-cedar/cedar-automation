import { test, expect } from '@playwright/test';
import { UiActions } from '../../CoreAutomation/Utilities/UiActions';
import { CommonOperations } from '../../CoreAutomation/Utilities/CommonOperations';
import { FileLogger, LogLevel } from '../../CoreAutomation/Helpers/FileLogger';
import { CalendarPageLocators } from '../../CoreAutomation/PageObjects/CalendarPage';

const CALENDAR_URL = CommonOperations.readConfiguration().calendarApp_url;
const logger = FileLogger.getInstance('logs/calendar_tests.log', LogLevel.INFO);

test.describe('Navigation Tests', () => {

  let uiActions: UiActions;

  // Navigate to the calendar page before the test
  test.beforeEach(async ({ page, context }) => {
    uiActions = new UiActions(page, context);
    await uiActions.page.goto(CALENDAR_URL);
    // Switch to infinite scroll
    await uiActions.clickElement(uiActions.page.locator(CalendarPageLocators.INFINITE_SCROLL_BUTTON));
    logger.info('Clicked on Infinite scroll button');

  });

  test('should navigate to next and previous month', async ({ page }) => {
    // Switch to month view
    await uiActions.clickElement(uiActions.page.locator(CalendarPageLocators.MONTH_VIEW_BUTTON));
    logger.info('Clicked on Month view button');

    // Get the initial state of the scheduler
    const initialDateText = await page.textContent(CalendarPageLocators.DATE_HEADER);

    // Click the next button to go to the next date
    await uiActions.clickElement(uiActions.page.locator(CalendarPageLocators.NEXT_MONTH_BUTTON));
    const nextDateText = await page.textContent(CalendarPageLocators.DATE_HEADER);

    // Ensure that the date has changed
    expect(nextDateText).not.toBe(initialDateText);

    // Click the previous button to go back to the initial date
    await uiActions.clickElement(uiActions.page.locator(CalendarPageLocators.PREVIOUS_MONTH_BUTTON));
    const prevDateText = await page.textContent(CalendarPageLocators.DATE_HEADER);

    // Ensure that the date has returned to the initial date
    expect(prevDateText).toBe(initialDateText);
  });

  test('should change view from day to month and back to day', async ({ page }) => {
    // Ensure that the day view is active by default
    const dayViewSelected = await page.locator(CalendarPageLocators.DAY_VIEW_SELECTED).isChecked();
    expect(dayViewSelected).toBe(true);
    logger.info('Day view is selected by default');

    // Click the month view button
    await uiActions.clickElement(uiActions.page.locator(CalendarPageLocators.MONTH_VIEW_BUTTON));
    logger.info('Clicked on Month view button');

    // Ensure that the month view is active
    const monthViewSelected = await page.locator(CalendarPageLocators.MONTH_VIEW_SELECTED).isChecked();
    expect(monthViewSelected).toBe(true);
    logger.info('Month view is active');

    // Click the day view button to switch back
    await uiActions.clickElement(uiActions.page.locator(CalendarPageLocators.DAY_VIEW_BUTTON));
    logger.info('Clicked on Day view button');

    // Ensure that the day view is active again
    const dayViewActiveAgain = await page.locator(CalendarPageLocators.DAY_VIEW_SELECTED).isChecked();
    expect(dayViewActiveAgain).toBe(true);
    logger.info('Day view is active again');
  });

});
