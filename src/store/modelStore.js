import { createSignal } from 'solid-js'

export const models = {
  'gemini': {
    name: 'Gemini exp 1121',
    icon: 'ri-google-fill',
    model: 'gemini-exp-1121',
    description: 'Best overall model. Superior performance in most tasks.'
  },
  'gemini-exp-1114': {
    name: 'Gemini exp 1114',
    icon: 'ri-google-fill',
    model: 'gemini-exp-1114',
    description: 'Excels in coding tasks. Smaller context window.'
  },
  'gemini-1-5-pro': {
    name: 'Gemini 1.5 Pro',
    icon: 'ri-google-fill',
    model: 'gemini-1.5-pro-latest',
    description: 'Fast responses. Great for long conversations.'
  },
  'gemini-1-5-flash': {
    name: 'Gemini 1.5 Flash',
    icon: 'ri-google-fill',
    model: 'gemini-1.5-flash-latest',
    description: 'Fastest model with great performance.'
  },
  'learnlm-1-5-pro-exp': {
    name: 'LearnLM 1.5 Pro Exp',
    icon: 'ri-google-fill',
    model: 'learnlm-1.5-pro-experimental',
    description: 'Experimental model optimized for educational tasks.',
    isNew: true
  },
  'mistral-large': {
    name: 'Mistral Large',
    icon: 'ri-brain-fill',
    model: 'mistral-large-latest',
    description: 'Fast and reliable. Good for general tasks.'
  },
  'codestral': {
    name: 'Codestral',
    icon: 'ri-brain-fill',
    model: 'codestral-latest',
    description: 'Specialized in code generation and analysis.'
  }
}

// Загружаем сохраненную модель из localStorage или используем gemini по умолчанию
const savedModel = localStorage.getItem('selectedModel') || 'gemini'
const [selectedModel, setSelectedModel] = createSignal(savedModel)

// Обновленная функция установки модели, которая также сохраняет выбор в localStorage
export const setSelectedModelWithSave = (model) => {
  localStorage.setItem('selectedModel', model)
  setSelectedModel(model)
}

export { selectedModel }
