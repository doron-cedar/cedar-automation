import { Locator, Page, BrowserContext } from "@playwright/test";
import { CommonOperations } from "../Utilities/CommonOperations";


export default class NewTransactionPageLocators {
    private page: Page;
    private context: BrowserContext;
    public fromMerchantInput: Locator;
    public toReceiverAccountInput: Locator;
    public fromCurrencyInput: Locator;
    public toCurrencyInput: Locator;
    public toAmountInput: Locator;
    public putposeInput: Locator;
    public invoiceInput: Locator;
    public submitButton: Locator;
    public cancelButton: Locator;

constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
}

}
