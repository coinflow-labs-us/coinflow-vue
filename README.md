# Coinflow Vue

## Withdraw

Props:

- `wallet`: The Solana Wallet Adapter Wallet
- `merchantId`: Your Merchant ID (Contact Coinflow support for this)
- `connection`: Solana Connection
- `env` (optional): This defaults to `prod`
  - For testing set to `staging`
- `onSuccess` (optional): function to run when the withdrawal process is successful
- `lockAmount` (optional): Whether to let the user select the amount to withdraw or to disable the input
- `amount` (optional): The amount to withdraw - required if `lockAmount=true`
- `tokens` (optional): Define a list to filter the available tokens
- `lockDefaultToken` (optional): Only allow the default token to be used
- `email` (optional): Set the default email to be used in entry fields
- `bankAccountLinkRedirect` (optional): The URL to be used for bank account setup
- `additionalWallets` (optional): Define additional wallets to assign to the user
- `usePermit` (optional): Pass as false to disable permit message signing for EVM and use approve transactions
- `transactionSigner` (optional): Public Key of the wallet which will actually execute the withdrawal transaction. Must be associated with the same withdrawer as the main wallet.

## Purchase

Props:

- `subtotal` (optional): Fix the amount of purchase

* `wallet`: The Solana Wallet Adapter Wallet
* `merchantId`: Your Merchant ID (Contact Coinflow support for this)
* `connection`: Solana Connection
* `env` (optional): This defaults to `prod`
  - For testing set to `staging`
* `onSuccess` (optional): function to run when the purchase process is successful
* `transaction` (optional): transaction for the user to run which redeems their credits with your smart contract. Create this transaction just like you would for a normal user who has USDC in their account.
* `debugTx` (optional): Setting this to `true` will sign the transaction with the wallet, and send the transaction with no preflight checks allowing for easier debug of any issues.
* `planCode` (optional): When a subscription is being purchased, the code of the subscription plan.
* `settlementType` (optional): The settlement method to use for the proceeds of a purchase. (Credits, USDC, or Bank)
* `webhookInfo` (optional): Product or transaction based information that you want transmitted when you receive webhooks regarding the purchase
* `email` (optional): Set the default email to use in email entry fields
* `chargebackProtectionData` (optional):
* `customerInfo` (optional): Additional information about the customer
* `allowedPaymentMethods` (optional): The payment methods displayed on the UI. If omitted, all available payment methods will be displayed.
* `rent` (optional, Solana only): Specify the blockchain rent amount to add to the total
* `nativeSolToConvert` (optional, Solana only): Specify the amount of native SOL to convert wSOL for the purchase
* `jwtToken` (optional): A JWT token which encodes verified checkout parameters to prevent spoofing of arguments.

# Changelog

## 1.0.2

- Added `allowedPaymentMethods` to `CoinflowPurchase`
- Options are:
  - 'card' = Credit and debit cards
  - 'ach' = ACH bank account transfers
  - 'fasterPayments' = UK Faster Payments (GBP Bank Transfers)
  - 'sepa' = SEPA bank account transfers (EUR Bank Transfers)
  - 'pix' = Pix bank account transfers (BRL Bank Transfers)
  - 'usdc' = USDC
  - 'googlePay' = Google Pay
  - 'applePay' = Apple Pay
  - 'credits' = Credits

## 1.0.1

- Allow copy to clipboard for Coinflow Iframe

## 1.0.0

- Deprecating `amount` and `token` in favor of subtotal which can be accessed via the following ways:
- Added multi-currency support for presentment
- SEPA and UK Faster Payments support

```js
{
  cents: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'BRL';
}
```

or

```js
{
  address: string;
  amount: number;
}
```

## 0.3.1

- Added sessionKey authentication mechanism to `CoinflowWithdraw`

## 0.3.1

- Allow higher versions of Vue as a peer dependency

## 0.3.0

- Added sessionKey authentication mechanism to `CoinflowPurchase`

## 0.2.8

- Added `onError` callback to Apple Pay and Google Pay buttons

## 0.2.7

- Added overlay to digital wallet buttons to make the loading time 0

## 0.2.6

- Fixed `CoinflowCvvOnlyInput` issues

## 0.2.5

- Added `getWalletFromEmail` function to `CoinflowUtils`

## 0.2.4

- Added placeholder CSS to card form elements

## 0.2.3

- Custom fonts for card elements

## 1.0.0

- Initial Version of the SDK
