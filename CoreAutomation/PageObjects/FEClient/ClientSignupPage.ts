import { Locator, Page, BrowserContext } from "@playwright/test";

export default class ClientSignUpLocators {
    private page: Page;
    private context: BrowserContext;
    public email: Locator;
    public password: Locator;
    public continueButton: Locator;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.email = this.page.locator("//input[@id='emailAddress-field' and @type='email']");
        this.password = this.page.locator("//input[@id='password-field' and @type='password']");
        this.continueButton = this.page.locator('button.cl-formButtonPrimary[data-localization-key="formButtonPrimary"]');
    }
}