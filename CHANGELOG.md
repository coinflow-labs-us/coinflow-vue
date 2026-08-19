# Changelog

## 1.19.0

- `CoinflowApplePayButton` and `CoinflowGooglePayButton` no longer reload the iframe when `args.subtotal` changes. The amount is now sent to the running iframe via `postMessage`, so the button stays mounted and updates instantly.
- Add an optional `useNativeSubtotal` arg to `CoinflowApplePayButton`. When true, the Apple Pay button skips the totals (fee quote) fetch and charges exactly the `subtotal` passed to the component.

## 1.18.1

- Fix an unhandled `TypeError: n.startsWith is not a function` on Chrome Mobile iOS in the iframe-based components (e.g. `CoinflowGooglePayButton`). `message` event handlers now ignore non-string `postMessage` payloads instead of crashing.

## 1.16.0

- Add a skeleton loader to the V2 card form (`CoinflowCardFormV2`). The skeleton occupies the same space as the rendered form to prevent layout shift and disappears once the form is ready for input, removing the blank state during load.
