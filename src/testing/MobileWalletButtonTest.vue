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

const googleHeight = ref(40);
const handleGoogleHeightChange = (newHeight: string) => {
  if (Number(newHeight) < 40) return;
  googleHeight.value = Number(newHeight);
};

const appleHeight = ref(40);
const handleAppleHeightChange = (newHeight: string) => {
  if (Number(newHeight) < 40) return;
  appleHeight.value = Number(newHeight);
};

const args: CoinflowPurchaseProps & {
  color: 'white' | 'black';
  onError?: (message: string) => void;
} = {
  env: 'local',
  merchantId: 'paysafe',
  subtotal: {cents: 198},
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
  onError: (error: string) => {
    console.log('VUE MobileWalletButton onError: ', error);
  },
};
</script>

<template>
  <div
    :style="{
      height: `${googleHeight}px`,
      borderRadius: '12px',
      overflow: 'hidden',
    }"
  >
    <coinflow-google-pay-button
      v-if="args"
      :args="{...args, handleHeightChange: handleGoogleHeightChange}"
    />
  </div>
  <div
    :style="{
      height: `${appleHeight}px`,
      borderRadius: '12px',
      overflow: 'hidden',
    }"
  >
    <coinflow-apple-pay-button
      v-if="args"
      :args="{
        ...args,
        handleHeightChange: handleAppleHeightChange,
      }"
    />
  </div>
</template>
