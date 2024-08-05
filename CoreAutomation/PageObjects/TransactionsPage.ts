import { Locator, Page, BrowserContext } from "@playwright/test";
import { CommonOperations } from "../Utilities/CommonOperations";


export default class TransactionsPageLocators {
    private page: Page;
    private context: BrowserContext;
    public addNewButton: Locator;
    public tableHeader: Locator;
    public cedarID: Locator;
    public cedarIDSearchInput: Locator;
    public creationTime: Locator;
    public creationTimeSearchInput: Locator;
    public fromMerchant: Locator;
    public fromMerchantSearchInput: Locator;
    public toMerchant: Locator;
    public toMerchantSearchInput: Locator;
    public toReceiverAccount: Locator;
    public toReceiverAccountSearchInput: Locator;
    public fromCurrency: Locator;
    public fromCurrencySearchInput: Locator;
    public toCurrency: Locator;
    public toCurrencySearchInput: Locator;
    public fromAmount: Locator;
    public fromAmountSearchInput: Locator;
    public toAmount: Locator;
    public toAmountSearchInput: Locator;
    public clientTransactionStatus: Locator;
    public clientTransactionSearchStatus: Locator;
    public putposeInput: Locator;
    public invoiceInput: Locator;
    public submitButton: Locator;
    public cancelButton: Locator;
    public inProgressTab: Locator;
    public inProgressDepositConfirmedTab: Locator;
    public completedTelexRequestedTab: Locator;
    public completedTab: Locator;
    public cancelledTab: Locator;
    public allTab: Locator;
    public navigateToPage2: Locator;
    public navigateToPage3: Locator;
    public navigateToNextPage: Locator;
    public navigateToPreviousPage: Locator;
    public navigateToFirstPage: Locator;
    public navigateToLastPage: Locator;
    public page2Button: Locator;
    public page3Button: Locator;
    public clearFilterButton: Locator;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.tableHeader = this.page.locator('thead.MuiTableHead-root.css-1wbz3t9');
        this.inProgressTab = this.page.locator('//button[@role="tab" and @aria-selected="false" and .//span[contains(@class, "MuiBadge-root") and text()="In Progress"]]');
        this.inProgressDepositConfirmedTab = this.page.locator('//button[@role="tab" and @aria-selected="false" and .//span[contains(@class, "MuiBadge-root") and text()="In Progress - Deposit Confirmed"]]');
        this.completedTelexRequestedTab = this.page.locator('//button[@role="tab" and @aria-selected="false" and .//span[contains(@class, "MuiBadge-root") and text()="Completed - Telex Requested"]]');
        this.completedTab = this.page.locator('//button[@role="tab" and @aria-selected="false" and .//span[contains(@class, "MuiBadge-root") and text()="Completed"]]');
        this.cancelledTab = this.page.locator('//button[@role="tab" and .//span[contains(@class, "MuiBadge-root") and text()="Cancelled"]]');
        this.allTab = this.page.locator('//button[@role="tab" and .//span[text()="All"]]');
        this.cedarID = this.page.locator('tr.MuiTableRow-root > td:nth-child(2) .MuiTypography-root');
        this.cedarIDSearchInput = this.page.locator('[id="\\:r1r\\:"]')
        this.creationTime = this.page.locator('tr.MuiTableRow-root > td:nth-child(3) .MuiTypography-root');
        this.creationTimeSearchInput = this.page.locator('[id="\\:r1s\\:"]')
        this.fromMerchant = this.page.locator('tr.MuiTableRow-root > td:nth-child(4) .MuiTypography-root')
        this.fromMerchantSearchInput = this.page.locator('[id="\\:r1t\\:"]')
        this.toMerchant = this.page.locator('tr.MuiTableRow-root > td:nth-child(5) .MuiTypography-root')
        this.toMerchantSearchInput = this.page.locator('[id="\\:r1v\\:"]')
        this.toReceiverAccount = this.page.locator('tr.MuiTableRow-root > td:nth-child(6) .MuiTypography-root')
        this.toReceiverAccountSearchInput = this.page.locator('[id="\\:r21\\:"]')
        this.fromCurrency = this.page.locator('tr.MuiTableRow-root > td:nth-child(7) .MuiTypography-root')
        this.fromCurrencySearchInput = this.page.locator('[id="\\:r23\\:"]')
        this.fromAmount = this.page.locator('tr.MuiTableRow-root > td:nth-child(8) .MuiTypography-root')
        this.fromAmountSearchInput = this.page.locator('[id="\\:r25\\:"]')
        this.toCurrency = this.page.locator('tr.MuiTableRow-root > td:nth-child(9) .MuiTypography-root')
        this.toCurrencySearchInput = this.page.locator('[id="\\:r26\\:"]')
        this.toAmount = this.page.locator('tr.MuiTableRow-root > td:nth-child(4) .MuiTypography-root')
        this.toAmountSearchInput = this.page.locator('[id="\\:r28\\:"]')
        this.clientTransactionStatus = this.page.locator('tr.MuiTableRow-root > td:nth-child(11) .MuiTypography-root')
        this.clientTransactionSearchStatus = this.page.locator('[id="\\:r29\\:"]')
        this.navigateToPage2 = this.page.locator('button[aria-label="Go to page 2"]');
        this.navigateToPage3 = this.page.locator('button[aria-label="Go to page 3"]');
        this.navigateToFirstPage = this.page.locator('button[aria-label="Go to first page"]');
        this.navigateToNextPage = this.page.locator('svg[data-testid="NavigateNextIcon"]');
        this.navigateToPreviousPage = this.page.locator('button[aria-label="Go to previous page"]');
        this.navigateToLastPage = this.page.locator('svg[data-testid="LastPageIcon"]');
        this.page2Button = this.page.locator('button[aria-label="page 2"][aria-current="true"]');
        this.page3Button = this.page.locator('button[aria-label="page 3"][aria-current="true"]');
        this.clearFilterButton = this.page.locator('svg[data-testid="CloseOutlinedIcon"]');
    }

}
