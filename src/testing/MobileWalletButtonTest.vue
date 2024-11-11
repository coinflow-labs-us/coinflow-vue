<script setup lang="ts">
import CoinflowGooglePayButton from '../components/mobile-wallet/CoinflowGooglePayButton.vue';
import CoinflowApplePayButton from '../components/mobile-wallet/CoinflowApplePayButton.vue';
import {
  CoinflowPurchaseProps,
  CoinflowSolanaPurchaseProps,
} from '../lib/common';
import {Connection, Keypair} from '@solana/web3.js';
import {ref} from 'vue';

const wallet: CoinflowSolanaPurchaseProps['wallet'] = {
  publicKey: Keypair.generate().publicKey,
  sendTransaction: () => {
    throw new Error('Not Implemented');
  },
  signMessage: () => {
    throw new Error('Not Implemented');
  },
} as CoinflowSolanaPurchaseProps['wallet'];

const height = ref(40);
const handleHeightChange = (newHeight: string) => {
  height.value = Number(newHeight);
};

const args: CoinflowPurchaseProps & {color: 'white' | 'black'; onError?: (message: string) => void;} = {
  env: 'local',
  merchantId: 'paysafe',
  amount: 1,
  onSuccess: (...args) => {
    console.log(...args);
  },
  wallet,
  connection: new Connection('https://api.devnet.solana.com'),
  blockchain: 'solana',
  color: 'black',
  theme: {
    background: '#c9d1d3',
  },
  handleHeightChange,
  onError: (error: string) => {
    console.log('VUE MobileWalletButton onError: ', error);
  },
};
</script>

<template>
  <div
    style="
      height: 100vh;
      width: 90vw;
      background-color: #c9d1d3;
      padding-left: 40px;
      padding-right: 40px;
    "
  >
    <div style="height: 40px"></div>
    <div
      :style="{
        height: '40px',
        borderRadius: '12px',
        overflow: 'hidden',
      }"
    >
      <coinflow-google-pay-button v-if="args" :args="args" />
    </div>
    <div style="height: 40px"></div>
    <div
      :style="{height: `${height}px`, borderRadius: '12px', overflow: 'hidden'}"
    >
      <coinflow-apple-pay-button v-if="args" :args="args" />
    </div>
  </div>
</template>
