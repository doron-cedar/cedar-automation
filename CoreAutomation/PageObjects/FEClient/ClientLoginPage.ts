import { Locator, Page, BrowserContext } from "@playwright/test";

export default class ClientLoginLocators {
    private page: Page;
    private context: BrowserContext;
    public signup: Locator;
    public googleLogin: Locator;
    public emailInput: Locator;
    public passwordInput: Locator;
    public emailOrPhone: Locator;
    public continueButton: Locator;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.signup = this.page.locator('a[data-localization-key="signIn.start.actionLink"]');
        this.googleLogin = this.page.locator('button.cl-socialButtonsBlockButton__google');
        this.emailInput = this.page.locator('input[id="identifier-field"]');
        this.emailOrPhone = this.page.locator('#identifierId');
        this.continueButton = this.page.locator('button[data-localization-key="formButtonPrimary"]');
        this.passwordInput = this.page.locator('input[id="password-field"]');
}
}