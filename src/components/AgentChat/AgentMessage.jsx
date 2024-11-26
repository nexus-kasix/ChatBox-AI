import { createSignal, createEffect } from 'solid-js';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import styles from './AgentMessage.module.css';

export default function AgentMessage({ message }) {
  const [isCopied, setIsCopied] = createSignal(false);
  let messageContentRef;

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
  };

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
    <div class={`${styles.message} ${message.type === 'user' ? styles.user : styles.agent}`}>
      <div class={styles.content}>
        {message.type === 'user' ? (
          <>
            <div class={styles.userInfo}>
              <span>You</span>
              <i class="ri-user-line"></i>
            </div>
            <div class={styles.messageText}>{message.content}</div>
          </>
        ) : message.type === 'thinking' ? (
          <div class={styles.thinking}>
            <div class={styles.dot}></div>
            <div class={styles.dot}></div>
            <div class={styles.dot}></div>
          </div>
        ) : (
          <>
            <div class={styles.agentInfo}>
              <i class={message.agent?.icon || "ri-robot-line"}></i>
              <span>{message.agent?.name || "AI"}</span>
            </div>
            <div 
              class={styles.messageText}
              ref={messageContentRef}
              innerHTML={getFormattedContent()}
            />
          </>
        )}
      </div>
    </div>
  );
}
