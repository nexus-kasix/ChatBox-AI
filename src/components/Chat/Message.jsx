import { createSignal, onMount, createEffect } from 'solid-js'
import { MessageType } from "../../store/chatStore"
import { models } from "../../store/modelStore"
import { marked } from "marked"
import DOMPurify from 'dompurify'

// Настраиваем marked для работы с highlight.js
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && window.hljs) {
      try {
        return window.hljs.highlight(code, { language: lang }).value;
      } catch (err) {
        console.error('Error highlighting code:', err);
        return code;
      }
    }
    return code;
  }
});

export default function Message({ message }) {
  const [isCopied, setIsCopied] = createSignal(false)
  const [isHovered, setIsHovered] = createSignal(false)

  const getModelIcon = () => {
    if (!message.model) return ""
    return models[message.model]?.icon || ""
  }

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  // Безопасное преобразование markdown в HTML
  const getFormattedContent = () => {
    const rawHtml = marked(message.content);
    return DOMPurify.sanitize(rawHtml, {
      USE_PROFILES: { html: true },
      ADD_TAGS: ['code', 'pre'],
      ADD_ATTR: ['class', 'language']
    });
  }

  // Эффект для обновления подсветки синтаксиса
  createEffect(() => {
    if (message.content) {
      // Даем время для обновления DOM
      setTimeout(() => {
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach((block) => {
          // Определяем язык из класса
          const classes = block.className.split(' ');
          const langClass = classes.find(cl => cl.startsWith('language-'));
          const language = langClass ? langClass.replace('language-', '') : '';
          
          // Применяем подсветку с учетом языка
          if (language && window.hljs) {
            try {
              const result = window.hljs.highlight(block.textContent, { 
                language,
                ignoreIllegals: true 
              });
              block.innerHTML = result.value;
              block.className = `hljs language-${language}`;
            } catch (err) {
              console.error('Error highlighting code:', err);
            }
          }
        });
      }, 0);
    }
  });

  return (
    <div 
      class={`message ${message.type === MessageType.USER ? "user-message" : "ai-message"} ${
        message.type === MessageType.ERROR ? "error-message" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {message.type === MessageType.USER ? (
        <>
          <div class="message-content">{message.content}</div>
          <i class="ri-user-line message-icon"></i>
        </>
      ) : message.type === MessageType.ERROR ? (
        <div class="message-content">{message.content}</div>
      ) : (
        <div class="message-wrapper">
          <i class={`${getModelIcon()} message-icon`}></i>
          <div 
            class="message-content"
            innerHTML={getFormattedContent()}
          />
          <button 
            class={`copy-button ${isHovered() ? 'visible' : ''} ${isCopied() ? 'copied' : ''}`}
            onClick={copyText}
            title={isCopied() ? 'Copied!' : 'Copy to clipboard'}
          >
            <i class={`ri-${isCopied() ? 'check-line' : 'file-copy-line'}`}></i>
          </button>
        </div>
      )}
    </div>
  )
}
