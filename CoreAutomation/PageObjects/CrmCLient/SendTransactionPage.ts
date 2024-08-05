import { Locator, Page, BrowserContext } from "@playwright/test";

export default class SendTransactionLocators {
    private page: Page;
    private context: BrowserContext;
    public sendTransaction: Locator;
    public workflow: Locator;
    
    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.sendTransaction = this.page.locator('[data-cy="OnRampOffRampRequestNav"]');
        this.workflow = this.page.locator('button:has(svg[data-testid="SchemaTwoToneIcon"])'); 
    }
}