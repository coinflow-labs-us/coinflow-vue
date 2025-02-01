<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {
  CoinflowWithdrawProps,
  getWalletPubkey,
  getHandlers,
} from '../lib/common';
import CoinflowIFrame from './CoinflowIframe.vue';

export default defineComponent({
  name: 'CoinflowWithdraw',
  components: {CoinflowIFrame},
  props: {
    args: {
      type: Object as PropType<CoinflowWithdrawProps>,
      required: true,
    },
  },
  computed: {
    handleHeightChangeId() {
      return Math.random().toString(16).substring(2);
    },
    iframeProps() {
      const walletPubkey = getWalletPubkey(this.args);
      return {
        ...this.args,
        walletPubkey,
        route: `/withdraw/${this.args.merchantId}`,
        transaction: undefined,
      };
    },
    messageHandlers() {
      return {
        ...getHandlers(this.args),
        handleHeightChange: this.args.handleHeightChange,
      };
    },
  },
});
</script>

<template>
  <coinflow-i-frame
    :args="{...iframeProps, ...messageHandlers, handleHeightChangeId}"
  />
</template>
