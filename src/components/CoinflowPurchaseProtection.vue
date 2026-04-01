<script setup lang="ts">
import {onMounted, PropType} from 'vue';
import {CoinflowEnvs} from '../lib/common';
import {initCoinflowProtection} from '../lib/common/CoinflowProtectionInit';

const {args} = defineProps({
  args: {
    type: Object as PropType<{
      env: CoinflowEnvs;
      merchantId: string;
    }>,
    required: true,
  },
});

onMounted(() => {
  initCoinflowProtection({coinflowEnv: args.env, merchantId: args.merchantId});
});
</script>

<template></template>
