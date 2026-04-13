<script setup lang="ts">
import {ref, onMounted, onUnmounted, computed, PropType} from 'vue';
import LZString from 'lz-string';
import {
  CoinflowEnvs,
  CoinflowUtils,
  IFrameMessageMethods,
  MerchantTheme,
} from '../../lib/common';

interface CardFormV2TokenResponse {
  token: string;
  expMonth?: string;
  expYear?: string;
}

const {args} = defineProps({
  args: {
    type: Object as PropType<{
      merchantId: string;
      env?: CoinflowEnvs;
      theme?: MerchantTheme;
      variant: 'card-form' | 'card-number-form' | 'cvv-form';
      token?: string;
      onLoad?: () => void;
    }>,
    required: true,
  },
});

const iframeRef = ref<HTMLIFrameElement | null>(null);
const loaded = ref(false);

const url = computed(() => {
  const baseUrl = CoinflowUtils.getCoinflowBaseUrl(args.env);
  const iframeUrl = new URL(
    `/form/v2/${args.variant}`,
    baseUrl
  );
  iframeUrl.searchParams.append('merchantId', args.merchantId);
  if (args.theme) {
    iframeUrl.searchParams.append(
      'theme',
      LZString.compressToEncodedURIComponent(JSON.stringify(args.theme))
    );
  }
  if (args.token) {
    iframeUrl.searchParams.append('token', args.token);
  }
  return iframeUrl.toString();
});

function handleMessage({data, origin}: {data: string; origin: string}) {
  const expectedOrigin = new URL(CoinflowUtils.getCoinflowBaseUrl(args.env))
    .origin;
  if (origin !== expectedOrigin) return;
  try {
    const parsed = JSON.parse(data);
    if (parsed.method === IFrameMessageMethods.Loaded) {
      loaded.value = true;
      args.onLoad?.();
    }
  } catch {
    // not JSON
  }
}

onMounted(() => {
  window.addEventListener('message', handleMessage);
});

onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
});

async function tokenize(): Promise<CardFormV2TokenResponse> {
  return new Promise((resolve, reject) => {
    if (!iframeRef.value?.contentWindow) {
      reject(new Error('Card form iframe not loaded'));
      return;
    }

    const handler = ({data, origin}: {data: string; origin: string}) => {
      const expectedOrigin = new URL(CoinflowUtils.getCoinflowBaseUrl(args.env))
    .origin;
  if (origin !== expectedOrigin) return;
      try {
        const parsed = JSON.parse(data);
        if (parsed.method !== 'tokenize') return;

        window.removeEventListener('message', handler);

        if (
          typeof parsed.data === 'string' &&
          parsed.data.startsWith('ERROR')
        ) {
          reject(new Error(parsed.data.replace('ERROR ', '')));
          return;
        }

        const responseData =
          typeof parsed.data === 'string'
            ? JSON.parse(parsed.data)
            : parsed.data;
        resolve(responseData);
      } catch {
        // not relevant
      }
    };

    window.addEventListener('message', handler);
    const targetOrigin = new URL(CoinflowUtils.getCoinflowBaseUrl(args.env)).origin;
    iframeRef.value.contentWindow.postMessage('tokenize', targetOrigin);
  });
}

defineExpose({tokenize});
</script>

<template>
  <iframe
    ref="iframeRef"
    :src="url"
    title="Card Form"
    frameBorder="0"
    allow="payment"
    :style="{
      width: '100%',
      height: '60px',
      border: 'none',
      opacity: loaded ? 1 : 0,
      transition: 'opacity 300ms linear',
    }"
  />
</template>
