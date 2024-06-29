import { Locator } from '@playwright/test';

export class CalendarPageLocators {
    static readonly INFINITE_SCROLL_BUTTON = 'text=Infinite scroll';
    static readonly MONTH_VIEW_BUTTON = '//span/span[text()="Month"]';
    static readonly MONTH_VIEW_SELECTED = 'input.ant-radio-button-input[value="200"]';
    static readonly DAY_VIEW_BUTTON = '//span/span[text()="Day"]';
    static readonly DAY_VIEW_SELECTED = 'input.ant-radio-button-input[value="000"]';
    static readonly SCHEDULER_VIEW_HEADER = '.scheduler-view-header';
    static readonly RESOURCE_ID_R1_ADD_EVENT = 'div.event-container > a.timeline-event';
    static readonly TITLE_INPUT = 'input[name="title"]';
    static readonly NEXT_MONTH_BUTTON = 'svg[data-icon="right"]';
    static readonly PREVIOUS_MONTH_BUTTON = 'svg[data-icon="left"]';
    static readonly EVENT_NAME_TEXT = (eventName: string) => `//span[contains(text(), '${eventName}')]`;
    static readonly SLOT_0 = 'tr:nth-child(4) > td > .event-container';
    static readonly SLOT_1 = 'tr:nth-child(5) > td > .event-container';
    static readonly SLOT_2 = 'tr:nth-child(6) > td > .event-container';
    static readonly SLOT_3 = 'tr:nth-child(7) > td > .event-container';
    static readonly SLOT_4 = 'tr:nth-child(8) > td > .event-container';
    static readonly NEW_EVENT = '//span[text()="New event you just created"]';
    static readonly RECURRING_TASK_EVENT = 'a:nth-child(9)';
    static readonly FIRST_EVENT_CONTAINER = '(//div[contains(@class, "event-container")])[1]';
    static readonly SECOND_EVENT_CONTAINER = '(//div[contains(@class, "event-container")])[2]';
    static readonly DATE_HEADER = '.header2-text-label';
}
