import { Locator, Page, test, expect, BrowserContext } from '@playwright/test';

export class UiActions {

    readonly page: Page;
    readonly context: BrowserContext;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
    }

    public async validatePageUrl(url: string) {
        await test.step(`Validating that a correct value of URL is ${url}`, async () => {
            await expect(this.page).toHaveURL(url);
        });
    }

    public async validateTitle(locator: Locator, title: string) {
        await this.validateElementText(locator, title);
    }

    public async validateElementText(element: Locator, expectedText: string) {
        await test.step(`Validating that a correct element text is ${expectedText}`, async () => {
            await expect(element).toContainText(expectedText);
        });
    }

    public async clickElement(locator: Locator) {
        await test.step(`Clicking the '${locator}' element`, async () => {
            const element = await locator.first();
            if (!element) throw new Error(`Element not found with locator: ${locator}`);
            await element.click();
        });
    }

    public async fillText(locator: Locator, textToFill: string) {
        if (textToFill === undefined) {
            console.warn("Trying to fill with undefined value. Skipping.");
            return;
        }

        await test.step(`Filling '${textToFill}' into the '${locator}' element`, async () => {
            const element = await locator.first();
            if (!element) throw new Error(`Element not found with locator: ${locator}`);
            await element.fill(textToFill);
        });
    }

    public async clearText(locator: Locator) {
        await test.step(`Clearing text from the '${locator}' element`, async () => {
            const element = await locator.first();
            if (!element) throw new Error(`Element not found with locator: ${locator}`);
            await element.clear();
        });
    }

    public async selectOptionByValue(locator: Locator, value: string) {
        await test.step(`Selecting option with value '${value}' from '${locator}'`, async () => {
            const element = await locator.first();
            if (!element) throw new Error(`Element not found with locator: ${locator}`);
            await element.selectOption({ value });
        });
    }

    public async selectOptionByIndex(locator: Locator, index: number) {
        await test.step(`Selecting option at index '${index}' from '${locator}'`, async () => {
            const element = await locator.first();
            if (!element) throw new Error(`Element not found with locator: ${locator}`);
            await element.selectOption({ index });
        });
    }

    public async toggleSwitchSelection(locator: Locator, state: 'on' | 'off') {
        await test.step(`Toggling switch '${locator}' to '${state}'`, async () => {
            const element = await locator.first();
            if (!element) throw new Error(`Element not found with locator: ${locator}`);
            const isChecked = await element.isChecked();
            if ((isChecked && state === 'off') || (!isChecked && state === 'on')) {
                await element.click();
            }
        });
    }

    public async selectCheckBox(element: Locator) {
        await test.step(`Selecting checkbox '${element}'`, async () => {
            await element.check();
        });
    }

    public async unselectCheckBox(element: Locator) {
        await test.step(`Unselecting checkbox '${element}'`, async () => {
            await element.uncheck();
        });
    }

    public async selectRadioButton(element: Locator) {
        await test.step(`Selecting radio button '${element}'`, async () => {
            await element.check();
        });
    }

    public async handleConfirmationDialog(action: 'accept' | 'dismiss') {
        await test.step(`Handling confirmation dialog: ${action}`, async () => {
            if (action === 'accept') {
                await this.page.on('dialog', async (dialog: any) => await dialog.accept());
            } else {
                await this.page.on('dialog', async (dialog: any) => await dialog.dismiss());
            }
        });
    }

    public async scrollToElement(locator: Locator) {
        await test.step(`Scrolling to element '${locator}'`, async () => {
            const element = await locator.first();
            if (!element) throw new Error(`Element not found with locator: ${locator}`);
            await element.scrollIntoViewIfNeeded();
        });
    }

    public async pressKey(key: string) {
        await test.step(`Pressing the '${key}' key on the keyboard`, async () => {
            await this.page.keyboard.press(key);
        });
    }

    public async waitForElement(selectorOrLocator: string | Locator, timeout: number = 10000) {
        try {
            if (typeof selectorOrLocator === 'string') {
                await this.page.waitForSelector(selectorOrLocator, { timeout });
            } else {
                await this.page.waitForSelector(selectorOrLocator.toString(), { timeout });
            }
        } catch (error) {
            const locatorString = typeof selectorOrLocator === 'string' ? selectorOrLocator : selectorOrLocator.toString();
            throw new Error(`Timed out ${timeout}ms waiting for element with locator "${locatorString}"`);
        }
    }

    public async dblclickElement(locator: Locator) {
        await test.step(`Double-clicking the '${locator}' element`, async () => {
            const element = await locator.first();
            if (!element) throw new Error(`Element not found with locator: ${locator}`);
            await element.dblclick();
        });
    }

    public async isVisible(locator: Locator) {
        await test.step(`Checking visibility of the '${locator}' element`, async () => {
            const element = await locator.first();
            if (!element) throw new Error(`Element not found with locator: ${locator}`);
            return await element.isVisible();
        });
    }

    public async handleDialog(action: 'accept' | 'dismiss') {
        await test.step(`Handling dialog: ${action}`, async () => {
            if (action === 'accept') {
                this.page.once('dialog', async (dialog) => {
                    console.log(`Dialog message: ${dialog.message()}`);
                    await dialog.accept();
                });
            } else {
                this.page.once('dialog', async (dialog) => {
                    console.log(`Dialog message: ${dialog.message()}`);
                    await dialog.dismiss();
                });
            }
        });
    }

    public async dragAndDrop(source: string | Locator, target: string | Locator) {
        const sourceSelector = typeof source === 'string' ? source : source.toString();
        const targetSelector = typeof target === 'string' ? target : target.toString();

        await test.step(`Dragging element '${sourceSelector}' to '${targetSelector}'`, async () => {
            await this.page.dragAndDrop(sourceSelector, targetSelector);
        });
    }

        public async dragAndDropToCoordinates(source: string | Locator, x: number, y: number) {
        const sourceSelector = typeof source === 'string' ? source : source.toString();

        const sourceElement = await this.page.locator(sourceSelector);
        const sourceBoundingBox = await sourceElement.boundingBox();
        if (!sourceBoundingBox) {
            throw new Error(`Could not find element with selector '${sourceSelector}' or get its bounding box`);
        }

        // Calculate target coordinates
        const targetX = sourceBoundingBox.x + x;
        const targetY = sourceBoundingBox.y + y;

        // Perform drag and drop to coordinates
        await this.page.mouse.move(sourceBoundingBox.x + sourceBoundingBox.width / 2, sourceBoundingBox.y + sourceBoundingBox.height / 2);
        await this.page.mouse.down();
        await this.page.mouse.move(targetX, targetY);
        await this.page.mouse.up();
    }

}
