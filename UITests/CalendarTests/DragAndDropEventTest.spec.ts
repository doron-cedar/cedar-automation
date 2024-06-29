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

  test('should move event in all directions using coordinates successfully', async ({ page }) => {
    // Locate and click on an existing event
    const eventElement = page.locator(CalendarPageLocators.RECURRING_TASK_EVENT);

    // Get the initial bounding box
    const initialBoundingBox = await eventElement.boundingBox();
    if (!initialBoundingBox) throw new Error('Event bounding box not found');

    // Define movements using deltaX and deltaY
    const movements = [
      { direction: 'down', deltaX: 0, deltaY: 200 },
      { direction: 'right', deltaX: 200, deltaY: 0 },
      { direction: 'up', deltaX: 0, deltaY: -200 },
      { direction: 'left', deltaX: -200, deltaY: 0 }
    ];

    for (const move of movements) {
      // Calculate new coordinates based on deltas
      const newX = initialBoundingBox.x + move.deltaX;
      const newY = initialBoundingBox.y + move.deltaY;

      // Perform the drag and drop operation using coordinates
      await uiActions.dragAndDropToCoordinates(CalendarPageLocators.RECURRING_TASK_EVENT, newX, newY);

      // Verify the event's new position or other expected behavior
      const newBoundingBox = await eventElement.boundingBox();
      if (!newBoundingBox) throw new Error('Event bounding box not found after move');

      logger.info(`Event moved ${move.direction} to (${newBoundingBox.x}, ${newBoundingBox.y})`);
    }
  });

});
