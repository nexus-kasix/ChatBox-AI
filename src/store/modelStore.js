import { createSignal } from 'solid-js'

export const models = {
  'gemini': {
    name: 'Gemini exp 1206',
    icon: 'ri-google-fill',
    model: 'gemini-exp-1206',
    description: 'Best overall model. Superior performance in most tasks.',
    isNew: true,
    provider: 'google'
  },
  'llama-70b': {
    name: 'Llama 3.3 70B',
    icon: 'ri-code-box-fill',
    model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    description: 'Powerful large language model for diverse tasks.',
    isNew: true,
    provider: 'together'
  },
  'qwen-coder': {
    name: 'Qwen 2.5 Coder',
    icon: 'ri-code-box-fill',
    model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
    description: 'Specialized in code generation and technical tasks.',
    isNew: true,
    provider: 'together',
    stop: ["<|im_end|>"]
  },
  'gemini-1-5-pro': {
    name: 'Gemini 1.5 Pro',
    icon: 'ri-google-fill',
    model: 'gemini-1.5-pro-latest',
    description: 'Fast responses. Great for long conversations.',
    provider: 'google'
  },
  'gemini-1-5-flash': {
    name: 'Gemini 1.5 Flash',
    icon: 'ri-google-fill',
    model: 'gemini-1.5-flash-latest',
    description: 'Fastest model with great performance.',
    provider: 'google'
  },
  'learnlm-1-5-pro-exp': {
    name: 'LearnLM 1.5 Pro Exp',
    icon: 'ri-google-fill',
    model: 'learnlm-1.5-pro-experimental',
    description: 'Experimental model optimized for educational tasks.',
    provider: 'google'
  },
  'mistral-large': {
    name: 'Mistral Large',
    icon: 'ri-brain-fill',
    model: 'mistral-large-latest',
    description: 'Fast and reliable. Good for general tasks.',
    provider: 'huggingface'
  },
  'codestral': {
    name: 'Codestral',
    icon: 'ri-brain-fill',
    model: 'codestral-latest',
    description: 'Specialized in code generation and analysis.',
    provider: 'huggingface'
  }
}

// Загружаем сохраненную модель из localStorage или используем gemini по умолчанию
const savedModel = localStorage.getItem('selectedModel')
// Проверяем, существует ли сохраненная модель в списке моделей
const defaultModel = (savedModel && models[savedModel]) ? savedModel : 'gemini'
const [selectedModel, setSelectedModel] = createSignal(defaultModel)

// Обновленная функция установки модели, которая также сохраняет выбор в localStorage
export const setSelectedModelWithSave = (model) => {
  localStorage.setItem('selectedModel', model)
  setSelectedModel(model)
}

export { selectedModel }
