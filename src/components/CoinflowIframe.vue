<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {
  CoinflowIFrameProps,
  CoinflowUtils,
  handleIFrameMessage,
  IFrameMessageHandlers,
} from '../lib/common';

export default defineComponent({
  name: 'CoinflowIFrame',
  props: {
    args: {
      type: Object as PropType<CoinflowIFrameProps & IFrameMessageHandlers>,
      required: true,
    },
  },
  computed: {
    url() {
      return CoinflowUtils.getCoinflowUrl(this.args);
    },
  },
  emits: {
    onMessage(_data: {data: string; origin: string}) {
      return true;
    },
  },
  methods: {
    sendMessage(message: string) {
      const ref: HTMLIFrameElement | null = this.$refs
        .iframeRef as HTMLIFrameElement | null;
      if (!ref?.contentWindow) throw new Error('Iframe not defined');
      ref.contentWindow.postMessage(message, '*');
    },
    handleIframeMessages({data, origin}: {data: string; origin: string}) {
      if (!origin.includes(CoinflowUtils.getCoinflowBaseUrl(this.args.env)))
        return;

      this.$emit('onMessage', {data, origin});

      const promise = handleIFrameMessage(
        data,
        this.args,
        this.args.handleHeightChangeId
      );
      if (!promise) return;
      promise.then(this.sendMessage).catch(e => {
        console.error(e);
        this.sendMessage('ERROR ' + e.message);
      });
    },
    async listenForMessage(
      isResponseValid: (response: string) => boolean
    ): Promise<string> {
      let handler: ({data, origin}: {data: string; origin: string}) => void;
      return new Promise<string>((resolve, reject) => {
        handler = ({data, origin}: {data: string; origin: string}) => {
          if (!origin.includes(CoinflowUtils.getCoinflowBaseUrl(this.args.env)))
            return;

          if (data.startsWith('ERROR')) {
            reject(new Error(data.replace('ERROR', '')));
            return;
          }

          if (!isResponseValid(data)) return;
          resolve(data);
        };

        if (!window) throw new Error('Window not defined');
        window.addEventListener('message', handler);
      }).finally(() => {
        window.removeEventListener('message', handler);
      });
    },
    async sendAndReceiveMessage(
      message: string,
      isResponseValid: (response: string) => boolean
    ): Promise<string> {
      this.sendMessage(message);
      return this.listenForMessage(isResponseValid);
    },
  },
  mounted() {
    if (!window) throw new Error('Window not defined');
    window.addEventListener('message', this.handleIframeMessages);
    return () => {
      window.removeEventListener('message', this.handleIframeMessages);
    };
  },
});
</script>

<template>
  <iframe
    credentialless
    style="height: 100%; width: 100%"
    ref="iframeRef"
    allow="payment;camera;clipboard-write"
    title="withdraw"
    frameBorder="0"
    :src="url"
    :scrolling="args.handleHeightChange ? 'no' : 'yes'"
    @load="
      () => {
        const ref: HTMLIFrameElement | null =
          $refs.iframeRef as HTMLIFrameElement | null;
        if (ref) ref.style.opacity = '1';
      }
    "
  />
</template>

<style scoped></style>
