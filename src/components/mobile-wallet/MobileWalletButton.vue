<script setup lang="ts">
import { PropType, ref } from "vue";
import { CoinflowPurchaseProps, getHandlers, getWalletPubkey } from "../../lib/common";
import CoinflowIFrame from "../CoinflowIframe.vue";

const {args, route} = defineProps({
  args: {
    type: Object as PropType<CoinflowPurchaseProps & {
      color: "white" | "black"
    }>,
    required: true
  },
  route: {
    type: String,
    required: true,
  }
});

const {onSuccess} = args;

function iframeProps() {
  const walletPubkey = getWalletPubkey(args);
  return {
    ...args,
    walletPubkey,
    transaction: undefined,
    routePrefix: 'form',
    route: `/${route}/${args.merchantId}`,
  };
}
function messageHandlers() {
  return {
    ...getHandlers(args),
    handleHeightChange: args.handleHeightChange
  };
}
function handleMessage({data}: {data: string}) {
  try {
    const res = JSON.parse(data);
    if (!('method' in res) || res.method !== 'getToken') {
      return;
    }
  } catch (e) {
    return;
  }

  onSuccess?.(data);
}
</script>

<template>
  <coinflow-i-frame @onMessage="handleMessage" :args="{...iframeProps(), ...messageHandlers()}"/>
</template>
