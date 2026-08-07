# Changelog

## 1.18.1

- Fix an unhandled `TypeError: n.startsWith is not a function` on Chrome Mobile iOS in the iframe-based components (e.g. `CoinflowGooglePayButton`). `message` event handlers now ignore non-string `postMessage` payloads instead of crashing.

## 1.16.0

- Add a skeleton loader to the V2 card form (`CoinflowCardFormV2`). The skeleton occupies the same space as the rendered form to prevent layout shift and disappears once the form is ready for input, removing the blank state during load.
