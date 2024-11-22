import { isSettingsOpen, setIsSettingsOpen } from '../../store/settingsStore'
import { setSelectedModelWithSave } from '../../store/modelStore'
import { useStore } from '../../store/chatStore'

export default function Settings() {
  const { clearChats } = useStore()

  const clearAllSettings = () => {
    // Очищаем все данные из localStorage
    localStorage.clear()
    
    // Сбрасываем модель на значение по умолчанию
    setSelectedModelWithSave('gemini')
    
    // Очищаем историю чатов
    clearChats()
    
    // Закрываем окно настроек
    setIsSettingsOpen(false)
  }

  return (
    <div class={`settings-panel ${isSettingsOpen() ? 'open' : ''}`}>
      <div class="settings-header">
        <h2>Settings</h2>
        <button class="close-button" onClick={() => setIsSettingsOpen(false)}>
          <i class="ri-close-line"></i>
        </button>
      </div>
      
      <div class="settings-content">
        <div class="settings-section">
          <h3>Reset Application</h3>
          <p>Clear all settings and chat history. This action cannot be undone.</p>
          <button 
            class="danger-button" 
            onClick={() => {
              if (confirm('Are you sure you want to clear all settings and chat history? This action cannot be undone.')) {
                clearAllSettings()
              }
            }}
          >
            Clear All Settings
          </button>
        </div>
      </div>
    </div>
  )
}
