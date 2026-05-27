<script setup lang="ts">
import {ref} from 'vue';
import CoinflowCardFormV2 from '../components/card-form/CoinflowCardFormV2.vue';

const cardForm = ref<{tokenize: () => Promise<unknown>} | null>(null);
const token = ref<string | null>(null);
const error = ref<string | null>(null);

async function getToken() {
  error.value = null;
  try {
    const res = await cardForm.value?.tokenize();
    token.value = JSON.stringify(res);
  } catch (e) {
    error.value = (e as Error).message;
  }
}
</script>

<template>
  <div :style="{margin: '40px auto', width: 'fit-content'}">
    <h3>CoinflowCardFormV2 (card-form)</h3>
    <p :style="{fontSize: '12px', color: '#666'}">
      Drag the bottom-right corner to resize. Below ~372px it should collapse to
      two rows.
    </p>
    <div
      :style="{
        width: '420px',
        minWidth: '240px',
        maxWidth: '600px',
        resize: 'horizontal',
        overflow: 'auto',
        padding: '8px',
        border: '1px dashed #ccc',
      }"
    >
      <CoinflowCardFormV2
        ref="cardForm"
        :args="{merchantId: 'paysafe', env: 'staging', variant: 'card-form'}"
      />
    </div>
    <button @click="getToken">Tokenize</button>
    <p v-if="token">Token: {{ token }}</p>
    <p v-if="error" :style="{color: 'red'}">Error: {{ error }}</p>
  </div>
</template>
