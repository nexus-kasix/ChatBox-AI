import { createSignal } from 'solid-js'

export const models = {
  'gemini': {
    name: 'Gemini exp 1121',
    icon: 'ri-google-fill',
    model: 'gemini-exp-1121'
  },
  'mistral-large': {
    name: 'Mistral Large',
    icon: 'ri-brain-fill',
    model: 'mistral-large-latest'
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
