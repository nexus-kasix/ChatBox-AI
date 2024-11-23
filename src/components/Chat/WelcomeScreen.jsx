import { useSettings } from '../../store/settingsStore'
import logo from '../../assets/logo.svg'

export default function WelcomeScreen() {
  const { apiKeys } = useSettings();
  const hasApiKey = () => {
    const keys = apiKeys();
    return keys.google || keys.mistral;
  };

  return (
    <div class="welcome-screen">
      <img src={logo} alt="ChatBox AI Logo" class="welcome-logo" />
      <h1 class="welcome-title">ChatBox AI</h1>
      <p class="welcome-text">
        {hasApiKey() 
          ? "Welcome to ChatBox AI! You can start chatting now"
          : "Welcome to ChatBox AI! Insert your API key and start chatting"}
      </p>
    </div>
  )
}
