import { createSignal } from 'solid-js'
import { models, selectedModel, setSelectedModelWithSave } from '../../store/modelStore'

export default function ModelSelector() {
  const [isModelMenuOpen, setIsModelMenuOpen] = createSignal(false)

  const toggleModelMenu = () => {
    setIsModelMenuOpen(!isModelMenuOpen())
  }

  const selectModel = (model) => {
    setSelectedModelWithSave(model)
    setIsModelMenuOpen(false)
  }

  return (
    <div class="model-selector">
      <button 
        type="button" 
        class="model-button" 
        onClick={toggleModelMenu}
      >
        <i class={models[selectedModel()].icon}></i>
      </button>
      <div class={`model-menu ${isModelMenuOpen() ? 'open' : ''}`}>
        {/* Gemini */}
        <button 
          type="button"
          class={`model-option ${selectedModel() === 'gemini' ? 'active' : ''}`}
          onClick={() => selectModel('gemini')}
        >
          <i class={models['gemini'].icon}></i>
          <span>{models['gemini'].name}</span>
        </button>

        {/* Mistral */}
        <button 
          type="button"
          class={`model-option ${selectedModel() === 'mistral-large' ? 'active' : ''}`}
          onClick={() => selectModel('mistral-large')}
        >
          <i class={models['mistral-large'].icon}></i>
          <span>{models['mistral-large'].name}</span>
        </button>
      </div>
    </div>
  )
}
