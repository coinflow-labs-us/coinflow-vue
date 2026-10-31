import CoinflowIframe from './components/CoinflowIframe.vue';
import CoinflowWithdraw from './components/CoinflowWithdraw.vue';
import CoinflowPurchase from './components/CoinflowPurchase.vue';
import CoinflowPurchaseProtection from './components/CoinflowPurchaseProtection.vue';
import CoinflowCardFormV2 from './components/card-form/CoinflowCardFormV2.vue';
import CoinflowApplePayButton from './components/mobile-wallet/CoinflowApplePayButton.vue';
import CoinflowGooglePayButton from './components/mobile-wallet/CoinflowGooglePayButton.vue';

export * from './lib/common';

const CoinflowCardForm = CoinflowCardFormV2;

export {
  CoinflowIframe,
  CoinflowWithdraw,
  CoinflowPurchase,
  CoinflowPurchaseProtection,
  CoinflowApplePayButton,
  CoinflowGooglePayButton,
  CoinflowCardForm,
  CoinflowCardFormV2,
};
