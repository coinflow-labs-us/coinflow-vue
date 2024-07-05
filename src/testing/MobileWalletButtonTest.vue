<script setup lang="ts">
import CoinflowGooglePayButton from "../components/mobile-wallet/CoinflowGooglePayButton.vue";
import CoinflowApplePayButton from "../components/mobile-wallet/CoinflowApplePayButton.vue";
import { CoinflowPurchaseProps } from "../lib/common";
import { Connection, Keypair } from "@solana/web3.js";

const args: CoinflowPurchaseProps & {color: 'white' | 'black'} = {
  env: 'staging',
  merchantId: 'paysafe',
  amount: 1,
  onSuccess: (...args) => {
    console.log(...args);
  },
  wallet: {
    publicKey: Keypair.generate().publicKey,
    sendTransaction: () => {throw new Error('Not Implemented');},
    signMessage: () => {throw new Error('Not Implemented');},
  },
  connection: new Connection('https://api.devnet.solana.com'),
  blockchain: 'solana',
  color: 'black',
};
</script>

<template>
  <coinflow-google-pay-button :args="args"/>
  <coinflow-apple-pay-button :args="args"/>
</template>
