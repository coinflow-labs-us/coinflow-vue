<script setup lang="ts">
import {ref} from 'vue';
import CoinflowCardFormV2 from '../components/card-form/CoinflowCardFormV2.vue';

// Bump the key to re-mount and replay the skeleton at the current width.
const reloadKey = ref(0);
function reload() {
  reloadKey.value++;
}
</script>

<template>
  <div :style="{margin: '40px auto', width: 'fit-content'}">
    <h3>CoinflowCardFormV2 — single</h3>
    <p :style="{fontSize: '12px', color: '#666', maxWidth: '440px'}">
      Drag the bottom-right corner to resize, then click <b>Reload</b> to replay
      the skeleton at the current width.
    </p>

    <button @click="reload" :style="{marginBottom: '12px'}">Reload</button>

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
        :key="reloadKey"
        :args="{merchantId: 'paysafe', env: 'staging', variant: 'card-form'}"
      />
    </div>
  </div>
</template>
