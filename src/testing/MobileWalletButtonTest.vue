<script setup lang="ts">
import CoinflowGooglePayButton from '../components/mobile-wallet/CoinflowGooglePayButton.vue';
import CoinflowApplePayButton from '../components/mobile-wallet/CoinflowApplePayButton.vue';
import {
  CoinflowPurchaseProps,
  CoinflowSolanaPurchaseProps,
} from '../lib/common';
import {Connection, Keypair} from '@solana/web3.js';

const wallet: CoinflowSolanaPurchaseProps['wallet'] = {
  publicKey: Keypair.generate().publicKey,
  sendTransaction: () => {
    throw new Error('Not Implemented');
  },
  signMessage: () => {
    throw new Error('Not Implemented');
  },
} as CoinflowSolanaPurchaseProps['wallet'];

const args: CoinflowPurchaseProps & {color: 'white' | 'black'} = {
  env: 'local',
  merchantId: 'paysafe',
  amount: 1,
  onSuccess: (...args) => {
    console.log(...args);
  },
  wallet,
  connection: new Connection('https://api.devnet.solana.com'),
  blockchain: 'solana',
  color: 'white',
  theme: {
    background: '#00141D',
  },
};
</script>

<template>
  <div
    style="
      height: 100vh;
      width: 90vw;
      background-color: #00141d;
      padding-left: 40px;
      padding-right: 40px;
    "
  >
    <div style="height: 40px; padding-bottom: 40px; padding-top: 40px">
      <coinflow-google-pay-button v-if="args" :args="args" />
    </div>
    <div style="height: 40px">
      <coinflow-apple-pay-button v-if="args" :args="args" />
    </div>
  </div>
</template>
