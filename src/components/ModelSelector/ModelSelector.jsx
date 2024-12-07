import { createSignal } from 'solid-js'
import { models, selectedModel, setSelectedModelWithSave } from '../../store/modelStore'

export default function ModelSelector() {
  const [isModelMenuOpen, setIsModelMenuOpen] = createSignal(false)
  const [hoveredModel, setHoveredModel] = createSignal(null)

  const toggleModelMenu = () => {
    setIsModelMenuOpen(!isModelMenuOpen())
  }

  const selectModel = (model) => {
    setSelectedModelWithSave(model)
    setIsModelMenuOpen(false)
  }

  const getModelClasses = (modelKey) => {
    const isSelected = selectedModel() === modelKey
    return `model-option ${isSelected ? 'selected' : ''}`
  }

  return (
    <div class="model-selector">
      <button 
        type="button" 
        class="model-button" 
        onClick={toggleModelMenu}
        title="Select AI Model"
      >
        <i class={models[selectedModel()]?.icon || 'ri-robot-fill'}></i>
      </button>
      <div class={`model-menu ${isModelMenuOpen() ? 'open' : ''}`}>
        {Object.entries(models).map(([key, model]) => (
          <button 
            type="button"
            class={getModelClasses(key)}
            onClick={() => selectModel(key)}
            onMouseEnter={() => setHoveredModel(key)}
            onMouseLeave={() => setHoveredModel(null)}
          >
            <i class={model.icon}></i>
            <div class="model-name-wrapper">
              <div class="model-name">
                {model.name}
                {model.isNew && <span class="new-badge">NEW</span>}
              </div>
              {hoveredModel() === key && (
                <div class="model-description">{model.description}</div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
