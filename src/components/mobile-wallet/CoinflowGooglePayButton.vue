<script setup lang="ts">
import {PropType} from 'vue';
import {CoinflowPurchaseProps} from '../../lib/common';
import MobileWalletButton, { CoinflowMobileWalletProps } from "./MobileWalletButton.vue";
import GooglePayOverlay from './GooglePayOverlay.vue';

const {args} = defineProps({
  args: {
    type: Object as PropType<CoinflowMobileWalletProps>,
    required: true,
  },
});
</script>

<template>
  <mobile-wallet-button
    route="google-pay"
    :args="args"
    overlayDisplayOverride="flex"
    alignItems="center"
  >
    <google-pay-overlay :color="args.color" />
  </mobile-wallet-button>
</template>
