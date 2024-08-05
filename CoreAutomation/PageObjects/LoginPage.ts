import { Locator, Page, BrowserContext } from "@playwright/test";
import { CommonOperations } from "../Utilities/CommonOperations";


export default class LoginPageLocators {
    private page: Page;
    private context: BrowserContext;
    public emailInput: Locator;
    public passwordInput: Locator;
    public loginButton: Locator;
    public transactionPage: Locator;
    public sendTransactionPage: Locator;


constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.emailInput = this.page.locator('input[name="email"][type="email"]');
        this.passwordInput = this.page.locator('input[name="password"][type="password"]');
        this.loginButton = this.page.locator('[data-cy="loginButton"]');
        this.transactionPage = this.page.locator('a[href="/app/crud/OnRampOffRampRequest/table"]');
        this.sendTransactionPage = this.page.locator('a[data-cy="OnRampOffRampRequestNav"]');
}

}
