<script setup lang="ts">
import {ref, VNodeRef} from 'vue';
import CoinflowCvvOnlyInput from '../components/card-form/CoinflowCvvOnlyInput.vue';
import {CardType} from '../lib/common';

const cvvOnlyInput = ref<VNodeRef | undefined>(undefined);
const token = ref<string | null>(null);
const origins = [window.location.origin];
</script>

<template>
  <div :style="{width: '100%', height: `100%`}">
    <button
      @click="
        async () => {
          token = await cvvOnlyInput.getToken();
        }
      "
    >
      Get Token
    </button>
    <CoinflowCvvOnlyInput
      ref="cvvOnlyInput"
      :args="{
        merchantId: 'paysafe',
        token: '4000057YPB4M5556',
        cardType: CardType.VISA,
        env: 'local',
        font: 'Calligraffitti',
        debug: true,
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
        origins,
      }"
    />
    <span>Token: {{ token }}</span>
  </div>
</template>
