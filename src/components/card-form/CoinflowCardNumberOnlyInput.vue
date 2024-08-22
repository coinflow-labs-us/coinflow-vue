<script setup lang="ts">
import {
  CoinflowCardNumberInputProps,
  CoinflowCardTokenResponse,
  TokenExCardNumberIframeId,
} from '../../lib/common';
import useCardformIframe from './useCardformIframe';
import {PropType, watchEffect} from 'vue';

const {args} = defineProps({
  args: {
    type: Object as PropType<CoinflowCardNumberInputProps>,
    required: true,
  },
});

const {tokenExIframe, initializeTokenExCardOnlyIframe} = useCardformIframe(
  args.env
);

async function getToken(): Promise<CoinflowCardTokenResponse> {
  if (!tokenExIframe.value) throw new Error('Unable to get token');
  return tokenExIframe.value.tokenize();
}

defineExpose({
  getToken,
});

function css() {
  return JSON.stringify(args.css);
}

watchEffect(() => {
  initializeTokenExCardOnlyIframe({
    css: css(),
    debug: args.debug,
    origins: args.origins,
    font: args.font,
  });
}, {});
</script>

<template>
  <div :id="TokenExCardNumberIframeId" />
</template>
