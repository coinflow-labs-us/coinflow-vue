<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref} from 'vue';
import {CardFormVariant, MerchantTheme} from '../lib/common';
import CoinflowCardFormV2 from '../components/card-form/CoinflowCardFormV2.vue';

// Theme presets to test the skeleton's best-effort light/dark tinting. The theme
// is passed to both the skeleton (drives its colors) and the iframe (the form).
const themes: {key: string; label: string; theme: MerchantTheme}[] = [
  {
    key: 'light',
    label: 'Light',
    theme: {
      background: '#ffffff',
      cardBackground: '#ffffff',
      backgroundAccent: '#e5e7eb',
      textColor: '#111827',
      primary: '#3b82f6',
      placeholderColor: '#8b8c8f',
    },
  },
  {
    key: 'dark',
    label: 'Dark',
    theme: {
      background: '#090a0c',
      cardBackground: '#111316',
      backgroundAccent: '#18191d',
      textColor: '#ffffff',
      primary: '#818cf8',
      placeholderColor: '#8b8c8f',
    },
  },
];
const selectedThemeKey = ref('light');
const activeTheme = computed(
  () => themes.find(t => t.key === selectedThemeKey.value)?.theme
);
// Cell backdrop so the skeleton renders on the surface the form will have.
const cellBackground = computed(() => activeTheme.value?.background ?? '#ffffff');

// Fixed widths, 250 → 400 in 50px increments.
const widths = Array.from({length: 4}, (_, i) => 250 + i * 50);

// One column per variant, shown side by side at each width.
const variants: {key: CardFormVariant; label: string}[] = [
  {key: 'card-form', label: 'Card form'},
  {key: 'card-number-form', label: 'Card only'},
  {key: 'cvv-form', label: 'CVV only'},
];

// Bumping the key re-mounts every component, resetting its internal `loaded`
// state so the real skeleton replays at each fixed width.
const reloadKey = ref(0);

// Tokenize a card to feed the CVV form (cvv-form needs a card token). Enter a
// card in the tokenizer below, click Tokenize, and the token flows to the CVV
// column.
const tokenizer = ref<{
  tokenize: () => Promise<{token: string}>;
} | null>(null);
const cvvToken = ref<string | null>(null);
const tokenizeError = ref<string | null>(null);

async function tokenizeCard() {
  tokenizeError.value = null;
  try {
    const res = await tokenizer.value?.tokenize();
    cvvToken.value = res?.token ?? null;
  } catch (e) {
    cvvToken.value = null;
    tokenizeError.value = (e as Error).message;
  }
}

// Seconds between auto-replays, editable from the UI and counted down by the
// ring below.
const intervalSeconds = ref(30);
const secondsLeft = ref(intervalSeconds.value);

// Circular countdown geometry. The progress arc depletes as time runs out.
const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const dashOffset = computed(
  () => CIRCUMFERENCE * (1 - secondsLeft.value / intervalSeconds.value)
);
// Disable the arc transition for the single frame where we snap back to full,
// so the ring doesn't sweep backwards on reset.
const animateRing = ref(true);

function reload() {
  reloadKey.value++;
  secondsLeft.value = intervalSeconds.value;
}

// Restart the countdown whenever the interval is edited, clamping to a sane min.
function onIntervalChange() {
  intervalSeconds.value = Math.max(1, Math.round(intervalSeconds.value) || 1);
  secondsLeft.value = intervalSeconds.value;
}

// Auto-replay on an interval so the skeletons can be observed hands-free.
let countdownTimer: ReturnType<typeof setInterval> | null = null;
onMounted(() => {
  countdownTimer = setInterval(() => {
    if (secondsLeft.value <= 1) {
      animateRing.value = false;
      reload();
      setTimeout(() => (animateRing.value = true), 50);
      return;
    }
    secondsLeft.value -= 1;
  }, 1000);
});
onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer);
});
</script>

<template>
  <div :style="{margin: '40px auto', width: 'fit-content'}">
    <h3>CoinflowCardFormV2</h3>
    <p :style="{fontSize: '12px', color: '#666', maxWidth: '440px'}">
      Every variant × width in one grid (fixed widths 250px to 400px). Click
      <b>Reload now</b> to replay the skeleton at every width.
    </p>

    <div
      :style="{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '16px',
      }"
    >
      <!-- Circular countdown to the next auto-replay -->
      <div :style="{position: 'relative', width: '48px', height: '48px'}">
        <svg width="48" height="48" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            :r="RADIUS"
            fill="none"
            stroke="#eee"
            stroke-width="4"
          />
          <circle
            cx="24"
            cy="24"
            :r="RADIUS"
            fill="none"
            stroke="#3b82f6"
            stroke-width="4"
            stroke-linecap="round"
            :stroke-dasharray="CIRCUMFERENCE"
            :stroke-dashoffset="dashOffset"
            transform="rotate(-90 24 24)"
            :style="{
              transition: animateRing ? 'stroke-dashoffset 1s linear' : 'none',
            }"
          />
        </svg>
        <span
          :style="{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontVariantNumeric: 'tabular-nums',
            color: '#333',
          }"
          >{{ secondsLeft }}</span
        >
      </div>

      <label :style="{fontSize: '12px', color: '#666'}">
        Interval (s):
        <input
          type="number"
          min="1"
          v-model.number="intervalSeconds"
          @change="onIntervalChange"
          :style="{width: '56px', marginLeft: '4px'}"
        />
      </label>

      <label :style="{fontSize: '12px', color: '#666'}">
        Theme:
        <select
          v-model="selectedThemeKey"
          @change="reload"
          :style="{marginLeft: '4px'}"
        >
          <option v-for="t in themes" :key="t.key" :value="t.key">
            {{ t.label }}
          </option>
        </select>
      </label>

      <button @click="reload">Reload now</button>
    </div>

    <!-- Tokenize a card so the CVV form has a token to attach to. -->
    <div :style="{marginBottom: '32px'}">
      <h4 :style="{margin: '0 0 8px'}">Tokenize a card (feeds the CVV form)</h4>
      <div
        :style="{
          width: '420px',
          padding: '8px',
          border: '1px dashed #ccc',
          background: cellBackground,
        }"
      >
        <CoinflowCardFormV2
          ref="tokenizer"
          :key="`tokenizer-${reloadKey}`"
          :args="{
            merchantId: 'paysafe',
            env: 'local',
            variant: 'card-form',
            theme: activeTheme,
          }"
        />
      </div>
      <div :style="{display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px'}">
        <button @click="tokenizeCard">Tokenize card</button>
        <span v-if="cvvToken" :style="{fontSize: '12px', color: '#0a0'}">
          Token: {{ cvvToken.slice(0, 14) }}… → passed to CVV form
        </span>
        <span v-if="tokenizeError" :style="{fontSize: '12px', color: 'red'}">
          {{ tokenizeError }}
        </span>
      </div>
    </div>

    <div
      :style="{
        display: 'grid',
        gridTemplateColumns: `repeat(${variants.length}, max-content)`,
        gap: '24px 32px',
        alignItems: 'start',
      }"
    >
      <!-- Column headers: one variant per column (consistent going down). -->
      <h4
        v-for="variant in variants"
        :key="`head-${variant.key}`"
        :style="{margin: 0}"
      >
        {{ variant.label }}
      </h4>
      <!-- One row per width, each variant in its own column. -->
      <template v-for="width in widths" :key="width">
        <div v-for="variant in variants" :key="`${variant.key}-${width}`">
          <div :style="{fontSize: '12px', color: '#666', marginBottom: '4px'}">
            {{ width }}px
          </div>
          <div
            :style="{
              width: `${width}px`,
              padding: '8px',
              border: '1px dashed #ccc',
              background: cellBackground,
            }"
          >
            <CoinflowCardFormV2
              :key="`${variant.key}-${width}-${reloadKey}`"
              :args="{
                merchantId: 'paysafe',
                env: 'local',
                variant: variant.key,
                theme: activeTheme,
                token: variant.key === 'cvv-form' ? cvvToken ?? undefined : undefined,
              }"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
