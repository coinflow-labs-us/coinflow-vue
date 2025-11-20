<script setup lang="ts">
import { ref, VNodeRef } from 'vue';
import CoinflowCardNumberInput from '../components/card-form/CoinflowCardNumberInput.vue';
import CoinflowCvvInput from '../components/card-form/CoinflowCvvInput.vue';
import nsureSDK from '@nsure-ai/web-client-sdk';
import CoinflowPurchaseProtection from '../components/CoinflowPurchaseProtection.vue';

declare const window: any;

const cardNumberInput = ref<VNodeRef | undefined>(undefined);
const token = ref<string | null>(null);
const deviceId = ref<string | null>(null);
</script>

<template>
  <div :style="{width: '100%', height: `100%`}">
    <CoinflowPurchaseProtection :args="{env: 'local', merchantId: 'paysafe'}"/>
    <button
      @click="
        async () => {
          token = await cardNumberInput.getToken();
        }
      "
    >
      Get Token
    </button>
    <CoinflowCardNumberInput
      ref="cardNumberInput"
      :args="{
        merchantId: 'paysafe',
        env: 'local',
        debug: true,
        font: 'Calligraffitti',
        css: {
          base: 'font-family: Montserrat, sans-serif;padding: 0 8px;border: 0px;margin: 0;width: 100%;font-size: 13px;line-height: 48px;height: 48px;box-sizing: border-box;-moz-box-sizing: border-box;',
          focus: 'outline: 0;',
          error:
            'box-shadow: 0 0 6px 0 rgba(224, 57, 57, 0.5);border: 1px solid rgba(224, 57, 57, 0.5);',
          cvv: {
            base: 'font-family: Montserrat, sans-serif;padding: 0 8px;border: 0px;margin: 0;width: 100%;font-size: 13px;line-height: 48px;height: 48px;box-sizing: border-box;-moz-box-sizing: border-box;',
            focus: 'outline: 0;',
            error:
              'box-shadow: 0 0 6px 0 rgba(224, 57, 57, 0.5);border: 1px solid rgba(224, 57, 57, 0.5);',
          },
        },
        origins: [window.location.origin],
      }"
    />
    <CoinflowCvvInput />
    <span>Token: {{ token }}</span>
    <button
      @click="
        async () => {
          deviceId = nsureSDK.getDeviceId();
        }
      "
    >
      Get Device ID
    </button>
    <span>Device ID: {{ deviceId }}</span>
  </div>
</template>

<style scoped>
div {
  width: 100%;
}
</style>
