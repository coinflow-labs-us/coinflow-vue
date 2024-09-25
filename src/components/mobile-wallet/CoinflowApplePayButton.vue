<script setup lang="ts">
import {PropType} from 'vue';
import {CoinflowPurchaseProps} from '../../lib/common';
import MobileWalletButton from './MobileWalletButton.vue';
import ApplePayOverlay from './ApplePayOverlay.vue';

const {args} = defineProps({
  args: {
    type: Object as PropType<
      CoinflowPurchaseProps & {color: 'white' | 'black'}
    >,
    required: true,
  },
});
</script>

<template>
  <mobile-wallet-button route="apple-pay" :args="args">
    <apple-pay-overlay :color="args.color" />
  </mobile-wallet-button>
</template>
