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
  'mistral-large': {
    name: 'Mistral Large',
    icon: 'ri-brain-fill',
    model: 'mistral-large-latest',
    description: 'Fast and reliable. Good for general tasks.'
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
