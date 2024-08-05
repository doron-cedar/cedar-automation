import { Locator, Page, test, expect, BrowserContext } from '@playwright/test';
import { FileLogger, LogLevel } from '../Helpers/FileLogger';
import fs from 'fs';
import path from 'path';
type AriaRole = 'button' | 'checkbox' | 'link' | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'option' | 'radio' | 'switch' | 'tab' | 'treeitem';

export class UiActions {

    logger = FileLogger.getInstance('logs/uiActions.log', LogLevel.INFO);
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
            try {
                await locator.fill(textToFill);
            } catch (error) {
                console.error(`Error filling text into element: ${error.message}`);
                throw error; // Rethrow to allow test to handle the error
            }
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

    async waitForElement(selectorOrLocator: string | Locator, timeout = 10000): Promise<void> {
        try {
            let locatorString: string;

            if (typeof selectorOrLocator === 'string') {
                locatorString = selectorOrLocator;
            } else if (selectorOrLocator) {
                // Assuming Locator has a method to convert to string
                locatorString = selectorOrLocator.toString();
            } else {
                throw new Error('Invalid selector or locator provided');
            }

            await this.page.waitForSelector(locatorString, { timeout });
        } catch (error) {
            console.error('Error while waiting for element:', error);
            throw error;
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

    async waitForPageLoad(timeout: number = 5000) {
        await this.page.waitForTimeout(timeout);
        await this.page.waitForLoadState('networkidle');
    }

    public async selectDropdownOption(inputSelector: string, optionText: string, timeoutMs: number = 5000) {
        console.log(`Attempting to select option: "${optionText}"`);

        try {
            // Clear and fill the input
            const input = this.page.locator(inputSelector);
            await input.clear();
            await input.fill(optionText);
            console.log('Input filled');

            // Wait for dropdown to appear
            const dropdownSelector = 'ul[role="listbox"], .dropdown-menu, .select-options';
            await this.page.waitForSelector(dropdownSelector, { state: 'visible', timeout: timeoutMs });
            console.log('Dropdown appeared');

            // Find all matching options
            const options = this.page.locator(`${dropdownSelector} li, ${dropdownSelector} .option`)
                .filter({ hasText: new RegExp(optionText, 'i') });

            const count = await options.count();
            console.log(`Found ${count} matching options`);

            if (count === 0) {
                throw new Error(`No options found matching "${optionText}"`);
            }

            // Click the first matching option
            await options.first().click();
            console.log('Option clicked');

            // Verify selection
            const selectedValue = await input.inputValue();
            console.log(`Selected value: "${selectedValue}"`);

            if (!selectedValue.includes(optionText)) {
                throw new Error(`Selection verification failed. Expected "${optionText}", got "${selectedValue}"`);
            }

            console.log('Selection successful');
        } catch (error) {
            console.error(`Error in dropdown selection: ${error.message}`);
            // Capture and log the page state
            await this.page.screenshot({ path: 'dropdown-error-screenshot.png' });
            console.log('Error screenshot saved as dropdown-error-screenshot.png');
            const pageContent = await this.page.content();
            console.log('Page content at time of error:', pageContent);
            throw error;
        }
    }

    public async selectMUIAutocomplete(labelText: string, optionText: string, timeoutMs: number = 10000) {
        console.log(`Attempting to select "${optionText}" from dropdown labeled "${labelText}"`);

        try {
            // Try different strategies to find the dropdown
            const dropdown = await this.findDropdownInput(labelText, timeoutMs);

            // Ensure the dropdown is interactable
            await this.ensureDropdownInteractable(dropdown);

            // Clear any existing value and type the new value
            await dropdown.click();
            await dropdown.fill('');
            await dropdown.type(optionText, { delay: 100 });

            console.log('Typed option text into input');

            // Wait for and select the option
            await this.selectOption(optionText, timeoutMs);

            // Verify the selection
            await this.verifySelection(dropdown, optionText);

            console.log('Selection successful');
        } catch (error) {
            console.error(`Error in MUI Autocomplete selection: ${error.message}`);
            await this.page.screenshot({ path: `mui-dropdown-error-${labelText.replace(/\s+/g, '-')}.png` });
            console.log(`Error screenshot saved as mui-dropdown-error-${labelText.replace(/\s+/g, '-')}.png`);
            throw error;
        }
    }

    private async findDropdownInput(labelText: string, timeoutMs: number): Promise<Locator> {
        const selectors = [
            `label:has-text("${labelText}")`,
            `[data-cy="${labelText.toLowerCase().replace(/\s+/g, '-')}"]`,
            `div:has-text("${labelText}") input[role="combobox"]`,
        ];

        for (const selector of selectors) {
            try {
                const element = this.page.locator(selector).first();
                await element.waitFor({ state: 'attached', timeout: timeoutMs });
                if (await element.isVisible()) {
                    return element;
                }
            } catch (error) {
                console.log(`Selector "${selector}" failed: ${error.message}`);
            }
        }

        throw new Error(`Unable to find dropdown for "${labelText}"`);
    }

    private async ensureDropdownInteractable(dropdown: Locator): Promise<void> {
        await dropdown.waitFor({ state: 'visible', timeout: 5000 });
        if (await dropdown.isDisabled()) {
            console.log('Dropdown is disabled. Attempting to enable...');
            await this.page.evaluate((selector) => {
                const element = document.querySelector(selector);
                if (element) (element as HTMLInputElement).disabled = false;
            }, await dropdown.evaluate((el) => CSS.escape(el.id)));
        }
    }

    private async selectOption(optionText: string, timeoutMs: number): Promise<void> {
        await this.page.waitForSelector('ul[role="listbox"]', { state: 'visible', timeout: timeoutMs });
        const option = this.page.locator('ul[role="listbox"] li').filter({ hasText: new RegExp(`^${optionText}$`, 'i') });
        await option.waitFor({ state: 'visible', timeout: timeoutMs });
        await option.click();
    }

    private async verifySelection(dropdown: Locator, optionText: string): Promise<void> {
        await dropdown.waitFor({ state: 'visible', timeout: 5000 });
        const selectedValue = await dropdown.inputValue();
        console.log(`Selected value: "${selectedValue}"`);
        if (selectedValue !== optionText) {
            throw new Error(`Selection verification failed. Expected "${optionText}", got "${selectedValue}"`);
        }
    }

    public async selectOptionByName(name: string, role: AriaRole = 'option') {
        await test.step(`Selecting ${role} with name "${name}"`, async () => {
            const element = this.page.getByRole(role, { name: name });
            await element.waitFor({ state: 'visible' });
            await element.click();
        });
    }

    public async verifyNotificationDialog(title: string, content: string, timeout: number = 10000) {
        await test.step(`Verify notification dialog: ${title}`, async () => {
            const notificationDialog = this.page.locator('div[role="dialog"]');
            await expect(notificationDialog).toBeVisible({ timeout });
    
            const dialogTitle = notificationDialog.locator('h2.MuiDialogTitle-root');
            await expect(dialogTitle).toContainText(title);
    
            const dialogContent = notificationDialog.locator('p.MuiDialogContentText-root');
            await expect(dialogContent).toContainText(content);
        });
    }

    public async uploadFile(fileInputSelector: string, filePath: string, timeout: number = 5000) {
        await test.step(`Uploading file: ${filePath}`, async () => {
            if (!fs.existsSync(filePath)) {
                this.logger.error(`File not found: ${filePath}`);
                throw new Error(`File not found at ${filePath}`);
            }

            try {
                const fileInput = this.page.locator(fileInputSelector);

                // Wait for the element to be attached to the DOM
                await fileInput.waitFor({ state: 'attached', timeout });

                const count = await fileInput.count();
                this.logger.info(`Found ${count} matching file input elements`);

                if (count === 0) {
                    const pageContent = await this.page.content();
                    this.logger.error(`Page content: ${pageContent}`);
                    throw new Error('File input element not found');
                }

                // Get file input details
                const fileInputDetails = await this.getFileInputDetails(fileInput);
                this.logger.info(`File input details: ${JSON.stringify(fileInputDetails, null, 2)}`);

                // If the file input is hidden, make it visible
                if (fileInputDetails.isHidden) {
                    await this.makeFileInputVisible(fileInputSelector);
                }

                // Upload the file
                await fileInput.setInputFiles(filePath);
                this.logger.info(`File upload attempted: ${filePath}`);

                // Wait for any post-upload processes
                await this.page.waitForTimeout(1000);

                // Check if the file name is visible on the page
                const fileName = path.basename(filePath);
                const fileNameVisible = await this.page.isVisible(`text=${fileName}`);
                if (fileNameVisible) {
                    this.logger.info(`File name "${fileName}" is visible on the page after upload`);
                } else {
                    this.logger.warn(`File name "${fileName}" is not visible on the page after upload`);
                }

            } catch (error) {
                this.logger.error(`Error during file upload: ${error instanceof Error ? error.message : String(error)}`);
                await this.page.screenshot({ path: 'file-upload-error-screenshot.png', fullPage: true });
                throw error;
            }
        });
    }

    private async getFileInputDetails(fileInput: Locator) {
        return await fileInput.evaluate((el) => {
            if (el instanceof HTMLInputElement) {
                return {
                    tagName: el.tagName,
                    type: el.type,
                    id: el.id,
                    name: el.name,
                    isHidden: !el.offsetParent
                };
            }
            return {
                tagName: el.tagName,
                id: el.id,
                isHidden: !(el as HTMLElement).offsetParent
            };
        });
    }

    private async makeFileInputVisible(selector: string) {
        await this.page.evaluate((sel) => {
            const el = document.querySelector(sel) as HTMLElement;
            if (el) {
                el.style.opacity = '1';
                el.style.display = 'block';
                el.style.visibility = 'visible';
            }
        }, selector);
        this.logger.info('Made hidden file input visible');
    }

    public async clearAllInputFields() {
        await test.step('Clear all input fields', async () => {
            const inputSelectors = [
                'input[type="text"]',
                'input[type="number"]',
                'textarea',
                '.MuiAutocomplete-input'
            ];

            for (const selector of inputSelectors) {
                const inputs = this.page.locator(selector);
                const count = await inputs.count();

                for (let i = 0; i < count; i++) {
                    const input = inputs.nth(i);
                    await input.click();
                    await input.fill('');
                }
            }

            // Clear file input
            const fileInput = this.page.locator('input[type="file"]');
            if (await fileInput.count() > 0) {
                await fileInput.evaluate((el: HTMLInputElement) => {
                    el.value = '';
                });
            }
        });
    }

    public async setMUIAutocompleteValue(locator: Locator, value: string, maxRetries = 3) {
        await test.step(`Setting MUI Autocomplete value to: ${value}`, async () => {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    console.log(`Attempt ${attempt} to set value "${value}"`);

                    // Click the input to focus it
                    await locator.click();

                    // Clear existing value
                    await this.clearMUIAutocompleteValue(locator);

                    // Type the new value
                    await locator.fill(value);
                    await this.page.waitForTimeout(500); // Wait for dropdown to update

                    // Wait for dropdown to appear
                    await this.page.waitForSelector('ul[role="listbox"]', { state: 'visible', timeout: 5000 });

                    // Log all available options
                    const options = this.page.locator('ul[role="listbox"] li');
                    const optionsCount = await options.count();
                    console.log(`Found ${optionsCount} options in the dropdown`);
                    for (let i = 0; i < optionsCount; i++) {
                        const optionText = await options.nth(i).textContent();
                        console.log(`Option ${i + 1}: ${optionText}`);
                    }

                    // Find and click the correct option
                    const optionToSelect = options.filter({ hasText: value }).first();
                    await optionToSelect.waitFor({ state: 'visible', timeout: 5000 });
                    await optionToSelect.click();

                    // Wait for the dropdown to close
                    await this.page.waitForSelector('ul[role="listbox"]', { state: 'hidden', timeout: 5000 });

                    // Verify the value is set correctly
                    await this.page.waitForTimeout(1000); // Wait for value to settle
                    const inputValue = await locator.inputValue();
                    console.log(`Current input value: "${inputValue}"`);

                    if (inputValue.includes(value)) {
                        console.log(`Successfully set value to "${inputValue}"`);
                        return; // Success, exit the method
                    }

                    // If we're here, the value wasn't set correctly
                    console.log(`Value not set correctly. Retrying...`);

                    // If this is the last attempt, throw an error
                    if (attempt === maxRetries) {
                        throw new Error(`Failed to set value "${value}" in MUI Autocomplete. Current value: "${inputValue}"`);
                    }

                    // Wait before the next attempt
                    await this.page.waitForTimeout(1000);
                } catch (error) {
                    console.error(`Error during attempt ${attempt}:`, error);
                    
                    // If this is the last attempt, rethrow the error
                    if (attempt === maxRetries) {
                        throw error;
                    }

                    // Wait before the next attempt
                    await this.page.waitForTimeout(1000);
                }
            }
        });
    }

    private async clearMUIAutocompleteValue(locator: Locator) {
        // Try clearing using the clear button
        const clearButton = locator.locator('button[title="Clear"]');
        if (await clearButton.isVisible()) {
            await clearButton.click();
            await this.page.waitForTimeout(500);
        }

        // If the clear button didn't work, try manual clearing
        const currentValue = await locator.inputValue();
        if (currentValue) {
            await locator.fill('');
            await locator.press('Backspace');
            await this.page.waitForTimeout(500);
        }

        // Verify the field is cleared
        const clearedValue = await locator.inputValue();
        if (clearedValue) {
            console.warn(`Failed to clear MUI Autocomplete value. Current value: "${clearedValue}"`);
        } else {
            console.log('Successfully cleared MUI Autocomplete value');
        }
    }


}
