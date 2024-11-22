import { createSignal } from 'solid-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Mistral } from '@mistralai/mistralai';

// Debug: Let's see what MistralClient exports
console.log('MistralClient exports:', { Mistral });

export const providers = {
  google: {
    name: 'Google AI',
    icon: 'ri-google-fill'
  },
  mistral: {
    name: 'Mistral AI',
    icon: 'ri-brain-fill'
  }
};

export const [isSettingsOpen, setIsSettingsOpen] = createSignal(false);
export const [apiKeys, setApiKeys] = createSignal({
  google: localStorage.getItem('google_api_key') || '',
  mistral: localStorage.getItem('mistral_api_key') || ''
});

export const saveApiKey = (provider, key) => {
  const newApiKeys = { ...apiKeys() };
  newApiKeys[provider] = key;
  setApiKeys(newApiKeys);
  localStorage.setItem(`${provider}_api_key`, key);
};

export const getAIClient = (provider) => {
  const keys = apiKeys();
  if (provider === 'google' && keys.google) {
    return new GoogleGenerativeAI(keys.google);
  } else if (provider === 'mistral' && keys.mistral) {
    return new Mistral({ apiKey: keys.mistral });
  }
  return null;
};
