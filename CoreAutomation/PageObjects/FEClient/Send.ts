import { Locator, Page, BrowserContext } from "@playwright/test";

export default class ClientSendPageLocators {
    private page: Page;
    private context: BrowserContext;
    public sendPageLink: Locator
    public amount: Locator;
    public currencyToSend: Locator;
    public youArePaying: Locator;
    public uploadInvoice: Locator;
    public sendTo: Locator;
    public clearCurrencyToSend: Locator;
    public clearCurrrencyYouPaid: Locator;
    public bankAccountDropdownButton: Locator;
    public bankAccountForPayout: Locator;
    public bankAccountDropdown: Locator;
    public bankAccountInput: Locator;
    public purpose: Locator;
    public confirmRequestButton: Locator;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.sendPageLink = this.page.locator('a[data-cy="sendNav"]');
        this.clearCurrencyToSend = this.page.locator("(//button[@aria-label='Clear' and @title='Clear'])[1]")
        this.clearCurrrencyYouPaid = this.page.locator("(//button[@aria-label='Clear' and @title='Clear'])[2]")
        this.amount = this.page.locator('input.MuiInputBase-input.MuiOutlinedInput-input.css-jq4gmj');
        this.currencyToSend = this.page.locator('div[data-cy="toCurrencyId"] input[type="text"]');
        this.youArePaying = this.page.locator('div[data-cy="fromCurrencyId"] input[type="text"]');
        this.uploadInvoice = this.page.locator('');
        this.sendTo = this.page.locator('div[data-cy="toBusinessContactId"] input[type="text"]');
        this.bankAccountDropdownButton = this.page.locator('div[data-cy="toBusinessExternalAccountId"] button[aria-label="Open"]');
        this.bankAccountForPayout = this.page.locator('text="Automation Test vendor / Hapoalim / 109678545 / Automation (USD)"');
        this.bankAccountDropdown = this.page.locator('[data-cy="toBusinessExternalAccountId"] .MuiAutocomplete-popupIndicator');
        this.bankAccountInput = this.page.locator('div[data-cy="toBusinessExternalAccountId"] input[type="text"]');
        this.purpose = this.page.locator('div[data-cy="purpose"] input[placeholder="Select"]');
        this.confirmRequestButton = this.page.locator('button[data-cy="confirmRequestButton"]');
    }
}