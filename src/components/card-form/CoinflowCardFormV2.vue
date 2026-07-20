<script setup lang="ts">
import {ref, onMounted, onUnmounted, computed, watch, PropType} from 'vue';
import LZString from 'lz-string';
import {
  CardFormVariant,
  CoinflowEnvs,
  CoinflowUtils,
  guessSkeletonHeightPx,
  getSkeletonColors,
  getSkeletonGridTemplate,
  IFrameMessageMethods,
  INLINE_SKELETON_HEIGHT_PX,
  MerchantTheme,
  SKELETON_BOX_STYLE,
  SKELETON_FADE_MS,
  SKELETON_LAYOUTS,
  SKELETON_ROOT_PADDING_PX,
} from '../../lib/common';

export interface CardFormV2TokenResponse {
  token: string;
  expMonth?: string;
  expYear?: string;
  /** Forter device token captured in the card-form iframe; forward it as the `x-forter-token` header on your charge request so Forter can score the transaction. Absent if the Forter SDK has not loaded. */
  forterToken?: string;
}

const {args} = defineProps({
  args: {
    type: Object as PropType<{
      merchantId: string;
      env?: CoinflowEnvs;
      theme?: MerchantTheme;
      variant: CardFormVariant;
      token?: string;
      onLoad?: () => void;
    }>,
    required: true,
  },
});

const iframeRef = ref<HTMLIFrameElement | null>(null);
const wrapperRef = ref<HTMLElement | null>(null);
const loaded = ref(false);
const iframeHeight = ref<number | null>(null);

const layout = SKELETON_LAYOUTS[args.variant];
const areas = layout.areas;

// Guess the skeleton height/layout from the iframe's width until it reports its
// real height: the two-row (compact) layout is taller than the inline one.
const guessHeight = ref(INLINE_SKELETON_HEIGHT_PX);
const gridTemplate = ref(layout.inline);

// Keep the skeleton mounted while it fades out so the opacity transition can
// play, then unmount on transition end. Remount instantly when shown again.
const rendered = ref(true);

const height = computed(() =>
  loaded.value && iframeHeight.value
    ? `${iframeHeight.value}px`
    : `${guessHeight.value}px`
);

// Best-effort skeleton tint from the merchant theme's background (neutral when
// absent), so the loader reads on light and dark forms alike.
const colors = computed(() => getSkeletonColors(args.theme));

function boxStyle(area: string) {
  return {...SKELETON_BOX_STYLE, background: colors.value.box, gridArea: area};
}

const url = computed(() => {
  const baseUrl = CoinflowUtils.getCoinflowBaseUrl(args.env);
  const iframeUrl = new URL(`/form/v2/${args.variant}`, baseUrl);
  iframeUrl.searchParams.append('merchantId', args.merchantId);
  iframeUrl.searchParams.append('useHeightChange', 'true');
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

function handleMessage(event: MessageEvent) {
  const {data, origin, source} = event;
  // Only honor messages from THIS instance's iframe. Multiple card forms on one
  // page each listen on `window`, so without this every instance would apply
  // every other iframe's height/loaded events to itself.
  if (source !== iframeRef.value?.contentWindow) return;
  const expectedOrigin = new URL(CoinflowUtils.getCoinflowBaseUrl(args.env))
    .origin;
  if (origin !== expectedOrigin) return;
  try {
    const parsed = JSON.parse(data);
    if (parsed.method === IFrameMessageMethods.Loaded) {
      loaded.value = true;
      args.onLoad?.();
    } else if (parsed.method === IFrameMessageMethods.HeightChange) {
      const parsedHeight = Number(parsed.data);
      if (Number.isFinite(parsedHeight) && parsedHeight > 0) {
        iframeHeight.value = parsedHeight;
      }
    }
  } catch {
    // not JSON
  }
}

function onSkeletonTransitionEnd(e: TransitionEvent) {
  if (e.propertyName === 'opacity' && loaded.value) rendered.value = false;
}

// Fallback unmount: `transitionend` may never fire (reduced-motion, an ancestor
// display:none, or opacity already 0), so force cleanup after the fade window.
watch(loaded, (isLoaded, _prev, onCleanup) => {
  if (!isLoaded) return;
  const timer = setTimeout(() => (rendered.value = false), SKELETON_FADE_MS);
  onCleanup(() => clearTimeout(timer));
});

let observer: ResizeObserver | null = null;

onMounted(() => {
  window.addEventListener('message', handleMessage);

  // Measure the wrapper div, not the iframe: a freshly-mounted <iframe> is a
  // replaced element with an intrinsic 300px default width before its
  // width:100% resolves, which would briefly (and wrongly) trip the compact
  // breakpoint. A block div reports the true container width immediately.
  const el = wrapperRef.value;
  if (!el || !layout.compact) return;

  const measure = () => {
    const width = el.clientWidth;
    guessHeight.value = guessSkeletonHeightPx({variant: args.variant, width});
    gridTemplate.value = getSkeletonGridTemplate({variant: args.variant, width});
  };
  measure();
  observer = new ResizeObserver(measure);
  observer.observe(el);
});

onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
  observer?.disconnect();
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
    const targetOrigin = new URL(CoinflowUtils.getCoinflowBaseUrl(args.env))
      .origin;
    iframeRef.value.contentWindow.postMessage('tokenize', targetOrigin);
  });
}

defineExpose({tokenize});
</script>

<template>
  <div ref="wrapperRef" :style="{position: 'relative', width: '100%', height}">
    <div
      v-if="rendered"
      role="status"
      aria-label="Loading card form"
      @transitionend="onSkeletonTransitionEnd"
      :style="{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        pointerEvents: 'none',
        flexDirection: 'column',
        gap: '8px',
        padding: `${SKELETON_ROOT_PADDING_PX}px`,
        boxSizing: 'border-box',
        borderRadius: '8px',
        background: colors.backdrop,
        opacity: loaded ? '0%' : '100%',
        transition: 'opacity 300ms linear, height 150ms ease-out',
      }"
    >
      <div
        :style="{
          display: 'grid',
          gap: 0,
          flex: 1,
          width: '100%',
          gridTemplate,
        }"
      >
        <div v-for="area in areas" :key="area" :style="boxStyle(area)" />
      </div>
    </div>
    <iframe
      ref="iframeRef"
      :src="url"
      title="Card Form"
      frameBorder="0"
      allow="payment"
      :style="{
        width: '100%',
        height,
        border: 'none',
        opacity: loaded ? 1 : 0,
        transition: 'opacity 300ms linear, height 150ms ease-out',
      }"
    />
  </div>
</template>

<!-- Unscoped so the keyframes keep their global name: the boxes reference this
     animation via an inline style (SKELETON_BOX_STYLE), which Vue does not
     rewrite the way it would a scoped @keyframes rule. -->
<style>
@keyframes coinflow-card-form-skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
</style>
