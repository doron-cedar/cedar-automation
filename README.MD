# CedarAutomation

CedarAutomation is a Playwright-based test automation project for validating the functionality of the Cedar admin application, specifically focusing on the transactions page. The project includes tests for table data validation, navigation, and search field functionality.

## Project Structure
CedarAutomation
├── CoreAutomation
│ ├── Helpers
│ │ ├── DataGenerator.ts
│ │ ├── FileLogger.ts
│ └── Utilities
│ ├── CommonOperations.ts
│ ├── UiActions.ts
├── PageObjects
│ ├── LoginPage.ts
│ ├── NewTransactionPage.ts
│ ├── TransactionPage.ts
├── tests
│ ├── UITests/TransactionsPageTests
│ ├── TransactionsTableNavigation.spec.ts
│ ├── TransactionsTableDataValidation.spec.ts
│ ├── TransactionsTableTest.spec.ts
├── logs
│ ├── table_navigation_test.log
│ ├── table_tests.log
│ ├── table_data_validation.log
├── playwright.config.ts
├── package.json
└── README.md

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/CedarAutomation.git

cd CedarAutomation
npm install

Configuration
The configuration for the admin application URL and credentials is read from a configuration file. Ensure you have a configuration file with the necessary details.

Running Tests
To run the tests, use the following command:
npx playwright test

Test Descriptions
TransactionsTableNavigation.spec.ts
This test suite validates the navigation functionality of the transactions table. It includes tests for navigating through all pages using navigation buttons.

TransactionsTableDataValidation.spec.ts
This test suite validates the data types and formats of each column in the transactions table. It includes tests for verifying the ID column, creation time, merchant columns, receiver account, currency columns, and transaction status.

TransactionsTableTest.spec.ts
This test suite validates the search field functionality on the transactions page. It includes tests for verifying that each search field correctly filters the table data based on the specified search terms.

Logging
Logs for the tests are stored in the logs directory:

table_navigation_test.log
table_tests.log
table_data_validation.log
Utilities
UiActions.ts
This utility class provides common UI actions such as filling text, clicking elements, and waiting for page load.

CommonOperations.ts
This utility class provides common operations such as reading configuration.

FileLogger.ts
This helper class provides logging functionality.

Page Objects
LoginPage.ts
This page object represents the login page of the admin application.

NewTransactionPage.ts
This page object represents the new transaction page of the admin application.

TransactionPage.ts
This page object represents the transactions page of the admin application.