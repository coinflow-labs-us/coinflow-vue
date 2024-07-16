<script setup lang="ts">
import { onMounted, PropType, ref, watchEffect } from "vue";
import { CoinflowEnvs, CoinflowUtils } from "../lib/common";

const {args: {env, merchantId}} = defineProps({
  args: {
    type: Object as PropType<{
      env: CoinflowEnvs;
      merchantId: string;
    }>,
    required: true
  },
});

const partnerId = ref<string | undefined>(undefined);

onMounted(() => new CoinflowUtils(env)
  .getNSurePartnerId(merchantId)
  .then(pId => (partnerId.value = pId)));

function applicationId() {
  return env === 'prod' ? '9JBW2RHC7JNJN8ZQ' : 'SANDBOX_CTCE4XK53ZW0R7V1';
}

function sdkUrl() {
  return env === 'prod'
    ? 'https://sdk.nsureapi.com/sdk.js'
    : 'https://sdk.nsureapi.com/sdk-sandbox.js';
}

watchEffect((onCleanup) => {
  if (!partnerId.value) return;

  const sdkScriptTag = document.createElement('script');
  sdkScriptTag.src = sdkUrl();
  document.head.appendChild(sdkScriptTag);

  const initializeScript = `window.nSureAsyncInit = function(deviceId) {
              window.nSureSDK.init({
                appId: '${applicationId()}',
                partnerId: '${partnerId.value}',
              });
            };`;

  const initializeScriptTag = document.createElement('script');
  initializeScriptTag.innerHTML = initializeScript;
  document.head.appendChild(initializeScriptTag);

  onCleanup(() => {
    document.head.removeChild(sdkScriptTag);
    document.head.removeChild(initializeScriptTag);
  });
});

</script>

<template>
</template>
