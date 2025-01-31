<script setup lang="ts">
import {PropType, watchEffect} from 'vue';
import {
  CoinflowCardTokenResponse,
  CoinflowCvvOnlyInputProps,
  TokenExCvvContainerID,
  MerchantIdOrCheckoutJwt,
} from '../../lib/common';
import useCardformIframe from './useCardformIframe';

const {args} = defineProps({
  args: {
    type: Object as PropType<
      CoinflowCvvOnlyInputProps & MerchantIdOrCheckoutJwt
    >,
    required: true,
  },
});

const {initializeCvvOnlyTokenExIframe, tokenExIframe} = useCardformIframe(args);

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
  initializeCvvOnlyTokenExIframe({
    ...args,
    origins: args.origins ?? [],
    css: css(),
    font: args.font,
  });
}, {});
</script>

<template>
  <div :id="TokenExCvvContainerID" />
</template>

<style scoped></style>
