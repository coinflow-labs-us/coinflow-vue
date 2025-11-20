<script setup lang="ts">
import { onMounted, PropType, ref, watchEffect } from "vue";
import { CoinflowEnvs, CoinflowUtils } from "../lib/common";
import nsureSDK from "@nsure-ai/web-client-sdk";

const {args} = defineProps({
  args: {
    type: Object as PropType<{
      env: CoinflowEnvs;
      merchantId: string;
    }>,
    required: true
  },
});

const partnerId = ref<string | undefined>(undefined);

onMounted(() => new CoinflowUtils(args.env)
  .getNSurePartnerId(args.merchantId)
  .then(pId => (partnerId.value = pId)));

function applicationId() {
  return args.env === 'prod' ? '9JBW2RHC7JNJN8ZQ' : 'SANDBOX_CTCE4XK53ZW0R7V1';
}


watchEffect((onCleanup) => {
  if (!partnerId.value) return;
  nsureSDK.init(applicationId(), partnerId.value)
});

</script>

<template>
</template>