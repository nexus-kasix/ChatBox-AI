import { createSignal, onMount, createEffect } from 'solid-js'
import { MessageType } from "../../store/chatStore"
import { models } from "../../store/modelStore"
import { marked } from "marked"
import DOMPurify from 'dompurify'

export default function Message({ message }) {
  const [isCopied, setIsCopied] = createSignal(false)
  let messageContentRef;

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

  const getFormattedContent = () => {
    marked.setOptions({
      highlight: function(code, lang) {
        if (lang && window.hljs) {
          try {
            return window.hljs.highlight(code, { 
              language: lang.toLowerCase(),
              ignoreIllegals: true 
            }).value;
          } catch (err) {
            return code;
          }
        }
        return code;
      },
      langPrefix: 'hljs language-'
    });
    
    const rawHtml = marked(message.content);
    return DOMPurify.sanitize(rawHtml, {
      USE_PROFILES: { html: true },
      ADD_TAGS: ['code', 'pre'],
      ADD_ATTR: ['class', 'language-*', 'hljs']
    });
  }

  const processCodeBlocks = () => {
    if (messageContentRef) {
      const codeBlocks = messageContentRef.querySelectorAll('pre');
      codeBlocks.forEach(pre => {
        pre.classList.add('code-block');
        
        const copyButton = document.createElement('button');
        copyButton.className = 'code-copy-button';
        copyButton.innerHTML = '<i class="ri-file-copy-line"></i>';
        
        copyButton.addEventListener('click', async () => {
          const code = pre.querySelector('code')?.textContent || '';
          try {
            await navigator.clipboard.writeText(code);
            copyButton.innerHTML = '<i class="ri-check-line"></i>';
            setTimeout(() => {
              copyButton.innerHTML = '<i class="ri-file-copy-line"></i>';
            }, 2000);
          } catch (err) {
            console.error('Failed to copy code:', err);
          }
        });
        
        pre.appendChild(copyButton);
      });
    }
  };

  createEffect(() => {
    message.content;
    setTimeout(() => {
      if (messageContentRef) {
        const codeBlocks = messageContentRef.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
          if (window.hljs) {
            window.hljs.highlightElement(block);
          }
        });
        processCodeBlocks();
      }
    }, 0);
  });

  return (
    <div class={`message ${message.type === MessageType.USER ? "user-message" : "ai-message"}`}>
      {message.type === MessageType.USER ? (
        <div class="message-bubble user">
          <div class="message-info">
            <span>You</span>
            <i class="ri-user-line"></i>
          </div>
          <div class="message-content">{message.content}</div>
        </div>
      ) : message.type === MessageType.THINKING ? (
        <div class="message-bubble ai">
          <div class="message-model-info">
            <i class={getModelIcon()}></i>
            <span>{message.model}</span>
          </div>
          <div class="message-content typing">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      ) : (
        <div class="message-bubble ai">
          <div class="message-model-info">
            <i class={getModelIcon()}></i>
            <span>{message.model}</span>
            <i 
              class={`copy-icon ri-${isCopied() ? 'check-line' : 'file-copy-line'}`}
              onClick={copyText}
            />
          </div>
          <div 
            ref={messageContentRef}
            class="message-content"
            innerHTML={getFormattedContent()}
          />
        </div>
      )}
    </div>
  )
}
