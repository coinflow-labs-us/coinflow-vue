<script setup lang="ts">
import {PropType, ref} from 'vue';
import {
  CoinflowPurchaseProps,
  getHandlers,
  getWalletPubkey,
} from '../../lib/common';
import CoinflowIFrame from '../CoinflowIframe.vue';

export type CoinflowMobileWalletProps = CoinflowPurchaseProps & {
  color: 'white' | 'black';
  onError?: (error: string) => void;
};

const {args, route, overlayDisplayOverride} = defineProps({
  args: {
    type: Object as PropType<CoinflowMobileWalletProps>,
    required: true,
  },
  route: {
    type: String,
    required: true,
  },
  overlayDisplayOverride: {
    type: String,
    required: false,
  },
  alignItems: {
    type: String,
    required: false,
  },
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
    handleHeightChange: args.handleHeightChange,
  };
}

const opacity = ref(0.8);
const display = ref('flex');
const handleHeightChangeId = Math.random().toString(16).substring(2);

function handleMessage({data}: {data: string}) {
  try {
    const res = JSON.parse(data);

    if ('method' in res && res.method === 'loaded') {
      opacity.value = 1;
      display.value = 'none';
    }

    if ('method' in res && res.data.startsWith('ERROR')) {
      args?.onError?.(res.info);
      return false;
    }

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
  <div
    :style="{
      position: 'relative',
      height: '100%',
    }"
  >
    <div
      :style="{
        backgroundColor: args.color,
        display: overlayDisplayOverride ?? display,
        opacity,
        alignItems,
        width: '100%',
        height: '40px',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 20,
        justifyContent: 'center',
        pointerEvents: 'none',
      }"
    >
      <slot></slot>
    </div>
    <div
      :style="{
        position: 'relative',
        zIndex: 10,
        height: '100%',
      }"
    >
      <coinflow-i-frame
        @onMessage="handleMessage"
        :args="{...iframeProps(), ...messageHandlers(), handleHeightChangeId}"
      />
    </div>
  </div>
</template>
