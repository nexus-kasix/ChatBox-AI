import { Show } from 'solid-js';
import { isSettingsOpen, setIsSettingsOpen, apiKeys, saveApiKey, providers } from '../../store/settingsStore';
import { setSelectedModelWithSave } from '../../store/modelStore';
import { useStore } from '../../store/chatStore';
import './SettingsModal.css';

export default function SettingsModal() {
  const { clearChats } = useStore();

  const handleSave = (provider, e) => {
    saveApiKey(provider, e.target.value);
  };

  const clearAllSettings = () => {
    // Очищаем все данные из localStorage
    localStorage.clear();
    
    // Сбрасываем модель на значение по умолчанию
    setSelectedModelWithSave('gemini');
    
    // Очищаем историю чатов
    clearChats();
    
    // Закрываем окно настроек
    setIsSettingsOpen(false);
  };

  return (
    <Show when={isSettingsOpen()}>
      <div class="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
        <div class="modal-content" onClick={(e) => e.stopPropagation()}>
          <div class="modal-header">
            <h2>Settings</h2>
            <button class="close-button" onClick={() => setIsSettingsOpen(false)}>
              <i class="ri-close-line"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="settings-section">
              <h3>API Keys</h3>
              {Object.entries(providers).map(([key, provider]) => (
                <div class="api-key-input">
                  <label>
                    <i class={provider.icon}></i>
                    {provider.name}
                  </label>
                  <input
                    type="password"
                    value={apiKeys()[key]}
                    onInput={(e) => handleSave(key, e)}
                    placeholder={`Enter ${provider.name} API Key`}
                  />
                </div>
              ))}
            </div>

            <div class="settings-section">
              <h3>Reset Application</h3>
              <p>Clear all settings and chat history. This action cannot be undone.</p>
              <button 
                class="danger-button" 
                onClick={() => {
                  if (confirm('Are you sure you want to clear all settings and chat history? This action cannot be undone.')) {
                    clearAllSettings();
                  }
                }}
              >
                Clear All Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
}
