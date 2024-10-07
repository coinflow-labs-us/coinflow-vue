<script lang="ts">
import { defineComponent, PropType } from "vue";
import {
  CoinflowPurchaseProps,
  getWalletPubkey,
  getHandlers,
  CoinflowUtils
} from "../lib/common";
import CoinflowIFrame from "./CoinflowIframe.vue";

export default defineComponent({
  name: "CoinflowPurchase",
  components: { CoinflowIFrame },
  props: {
    args: {
      type: Object as PropType<CoinflowPurchaseProps>,
      required: true
    }
  },
  computed: {
    iframeProps() {
      const walletPubkey = getWalletPubkey(this.args);
      return {
        ...this.args,
        walletPubkey,
        route: `/purchase-v2/${this.args.merchantId}`,
        transaction: CoinflowUtils.getTransaction(this.args),
      };
    },
    messageHandlers() {
      return {
        ...getHandlers(this.args),
        handleHeightChange: this.args.handleHeightChange
      };
    }
  },
});
</script>

<template>
  <coinflow-i-frame :args="{...iframeProps, ...messageHandlers}"/>
</template>

<style scoped>

</style>
