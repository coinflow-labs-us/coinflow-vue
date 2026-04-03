import CoinflowIframe from './components/CoinflowIframe.vue';
import CoinflowWithdraw from './components/CoinflowWithdraw.vue';
import CoinflowPurchase from './components/CoinflowPurchase.vue';
import CoinflowCardNumberInput from './components/card-form/CoinflowCardNumberInput.vue';
import CoinflowCvvInput from './components/card-form/CoinflowCvvInput.vue';
import CoinflowCvvOnlyInput from './components/card-form/CoinflowCvvOnlyInput.vue';
import CoinflowPurchaseProtection from './components/CoinflowPurchaseProtection.vue';
import CoinflowCardNumberOnlyInput from './components/card-form/CoinflowCardNumberOnlyInput.vue';
import CoinflowCardFormV2 from './components/card-form/CoinflowCardFormV2.vue';
import CoinflowApplePayButton from './components/mobile-wallet/CoinflowApplePayButton.vue';
import CoinflowGooglePayButton from './components/mobile-wallet/CoinflowGooglePayButton.vue';

export * from './lib/common';

const CoinflowCardForm = CoinflowCardFormV2;

/** @deprecated Use CoinflowCardForm instead */
const CoinflowLegacyCardNumberInput = CoinflowCardNumberInput;
/** @deprecated Use CoinflowCardForm instead */
const CoinflowLegacyCvvInput = CoinflowCvvInput;
/** @deprecated Use CoinflowCardForm instead */
const CoinflowLegacyCvvOnlyInput = CoinflowCvvOnlyInput;
/** @deprecated Use CoinflowCardForm instead */
const CoinflowLegacyCardNumberOnlyInput = CoinflowCardNumberOnlyInput;

export {
  CoinflowIframe,
  CoinflowWithdraw,
  CoinflowPurchase,
  CoinflowPurchaseProtection,
  CoinflowApplePayButton,
  CoinflowGooglePayButton,
  CoinflowCardForm,
  CoinflowCardFormV2,
  CoinflowLegacyCardNumberInput,
  CoinflowLegacyCvvInput,
  CoinflowLegacyCvvOnlyInput,
  CoinflowLegacyCardNumberOnlyInput,
  CoinflowCardNumberInput,
  CoinflowCvvInput,
  CoinflowCvvOnlyInput,
  CoinflowCardNumberOnlyInput,
};
