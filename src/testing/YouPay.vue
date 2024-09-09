<script setup lang="ts">
import CoinflowGooglePayButton from '../components/mobile-wallet/CoinflowGooglePayButton.vue';
import CoinflowApplePayButton from '../components/mobile-wallet/CoinflowApplePayButton.vue';
import {CoinflowPurchaseProps, CoinflowUtils} from '../lib/common';
import {computed, onMounted, ref} from 'vue';

type CoinflowProps = CoinflowPurchaseProps & {
  color: 'white' | 'black';
};

const sellerId = 'account_35771';
const subtotal = {cents: 100};
const amount = subtotal.cents / 100;
const customerId = '1234567890';
const env = 'sandbox';

// Arguments to pass into the coinflow components
const args = ref<CoinflowProps | null>(null);

// On mount create the "wallet"
onMounted(() => {
  /*
  USE ANY JS HTTP LIBRARY... THIS SHOULD CALL AN ENDPOINT ON YOUR BACKEND WHICH CALLS THE FOLLOWING COINFLOW API CALL,
  WHICH WILL RETURN THE RESPONSE TO THE FRONTEND.

  https://docs.coinflow.cash/reference/getpurchasetoken

  curl --request POST \
     --url https://api-sandbox.coinflow.cash/api/marketplace/token \
     --header 'Authorization: coinflow_sandbox_2475cfe909e54fd6a9fe789d3000c09d_17c3aa08f8a64e80a1c6e785aea4a15a' \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
  "subtotal": {
    "cents": 100
  },
  "sellerId": "account_35771",
  "chargebackProtectionData": [
    {
      "productType": "fundACause",
      "productName": "gift",
      "quantity": 1
    }
  ],
  "feePercentage": 10
}
'
   */

  // THIS IS THE RESPONSE YOU GET BACK FROM YOUR API CALL.
  const response = Promise.resolve({
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoi456C4oKW26LXguCrgOS4gOOAhOyDjMyw4Yy24LuA5o2c5YCR6ICOWe2fhOixkOKAtsKN742eXHVkYzA144SA4aiR8JOsgOKcgOm4gOGwgOuuseSAhOSAoeujmeOBg-KBiOyEguWLueGlo-ijidmc4aer6q6B6bK-5aWJ5KSi7LuN4qi076aI4p6u7YS-XHVkOWY15b6d4ruJ4bCk45Cs5omy5YiX5JmZ5Ji44rGc5LG24aKs5KiW54my5JiU4KmZ4LG24LGi56mi55GG5oic54m87Ji05om85Kqk54mD56ik5aSs5Jm24Lm75YiU5KKk5omt5Ji15J2y46Ct54is7oqU7rOm6bO_4YO65aSE57Cs4Zi7452S5Jmc5omc5YiG7Iq04Lei45GG5Zyk56ih75KA75Cj7LWt6LaE46CG66CT6Lu17J2l76iM5aS17oKS7rKX6ZCs5aWc5IO64Kye6JaB2p3usajkvJvthoHojYNcdWQ5M2PgobnoqIPgoYTqgqHsoq7jpobKj-SRsOaCmuupgOSajeC0kuKPoeWJtOKQoey4geCom-mnluOdouONn-K6jOKqkeGCuOWssOWinOShquqCiu-1nuezneisoeuigMK-5ICAIiwiaWF0IjoxNzI1ODg5NzYzLCJleHAiOjE3MjU5NzYxNjN9.-bpV24nXHwp13kdmF4qs1khbpHnFyR8BDBYmaUbSecc',
  });

  response
    .then(response => response.token)
    .then(async jwtToken => {
      // You can think of this as just the customer identifier.
      const wallet = await CoinflowUtils.getWalletFromUserId({
        userId: customerId,
        merchantId: sellerId,
        env,
      });

      args.value = {
        env,
        merchantId: sellerId,
        amount,
        onSuccess: (...args) => {
          console.log(...args);
        },
        wallet,
        connection: {} as any, // You can safely ts-ignore this as you are not using it.
        blockchain: 'solana', // Always use Solana here.
        color: 'white', // black or white
        jwtToken,
        theme: {
          background: '#052d3f',
        },
      };
    });
});

const typedArgs = computed(() => args.value as CoinflowProps | null);
</script>

<template>
  <div style="height: 40px">
    <coinflow-google-pay-button v-if="typedArgs" :args="typedArgs" />
  </div>
  <div style="height: 40px">
    <coinflow-apple-pay-button v-if="typedArgs" :args="typedArgs" />
  </div>
</template>
