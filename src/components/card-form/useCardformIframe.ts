import {ref, onMounted, watchEffect} from 'vue';
import {
  doInitializeCvvOnlyTokenExIframe,
  doInitializeTokenExCardOnlyIframe,
  doInitializeTokenExIframe,
  setTokenExScriptTag,
  TokenExIframe,
  CoinflowEnvs,
} from '../../lib/common';

const useCardFormIframe = (env: CoinflowEnvs) => {
  const loaded = ref(false);
  const tokenExScriptLoaded = ref(false);
  const tokenExIframe = ref<TokenExIframe | undefined>(undefined);
  const cachedToken = ref<string | undefined>(undefined);

  onMounted(() => {
    setTokenExScriptTag({
      env,
      setTokenExScriptLoaded: () => {
        console.log('tokenExScriptLoaded.value = true');
        tokenExScriptLoaded.value = true;
      },
    });
  });

  const setCachedToken = (newToken: string | undefined) =>
    (cachedToken.value = newToken);
  const setLoaded = () => (loaded.value = true);
  const setTokenExIframe = (iframe: TokenExIframe | undefined) =>
    (tokenExIframe.value = iframe);

  const initializeCvvOnlyTokenExIframe = async (
    args: Omit<
      Parameters<typeof doInitializeCvvOnlyTokenExIframe>[0],
      'env' | 'tokenExScriptLoaded' | 'setCachedToken' | 'setLoaded'
    >
  ) => {
    const iframe = await doInitializeCvvOnlyTokenExIframe({
      ...args,
      tokenExScriptLoaded: tokenExScriptLoaded.value,
      env,
      setCachedToken,
      setLoaded,
    });
    setTokenExIframe(iframe);
    return iframe;
  };

  const initializeTokenExIframe = async (
    args: Omit<
      Parameters<typeof doInitializeTokenExIframe>[0],
      'env' | 'tokenExScriptLoaded' | 'setCachedToken' | 'setLoaded'
    >
  ) => {
    const iframe = await doInitializeTokenExIframe({
      ...args,
      tokenExScriptLoaded: tokenExScriptLoaded.value,
      env,
      setCachedToken,
      setLoaded,
    });
    setTokenExIframe(iframe);
    return iframe;
  };

  const initializeTokenExCardOnlyIframe = async (
    args: Omit<
      Parameters<typeof doInitializeTokenExCardOnlyIframe>[0],
      'env' | 'tokenExScriptLoaded' | 'setCachedToken' | 'setLoaded'
    >
  ) => {
    const iframe = await doInitializeTokenExCardOnlyIframe({
      ...args,
      tokenExScriptLoaded: tokenExScriptLoaded.value,
      env,
      setCachedToken,
      setLoaded,
    });
    setTokenExIframe(iframe);
    return iframe;
  };

  watchEffect(onCleanup => {
    if (!tokenExIframe.value) return;
    tokenExIframe.value.load();

    onCleanup(() => tokenExIframe.value?.remove());
  });

  return {
    tokenExIframe,
    initializeTokenExIframe,
    initializeCvvOnlyTokenExIframe,
    initializeTokenExCardOnlyIframe,
    loaded,
    cachedToken,
    setTokenExScriptTag,
    tokenExScriptLoaded,
  };
};

export default useCardFormIframe;
