// Chat Widget - Online Support 24/7
// Webhook endpoint - change this constant to update the webhook URL
const CHAT_WEBHOOK_URL = "https://n8n.aishakemiksiz.com/webhook/azuretower";

document.addEventListener('DOMContentLoaded', function () {
  const openChatBtn = document.getElementById('openChatBtn');
  const openChatBtnMobile = document.getElementById('openChatBtnMobile');
  const chatOverlay = document.getElementById('chatOverlay');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatBody = document.getElementById('chatBody');

  // Буфер для объединения сообщений
  let pendingText = '';
  let pendingTimer = null;

  // Функция отправки на webhook
  async function sendBufferedToWebhook(text) {
    if (!text.trim()) return;

    // показать индикатор "assistant is typing"
    const typingEl = showTypingIndicator();

    try {
      const response = await fetch(CHAT_WEBHOOK_URL, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          timestamp: new Date().toISOString(),
          page: window.location.href,
          source: "Website Online Help"
        })
      });

      // если сервер вернул не 2xx — считаем это ошибкой
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }

      const data = await response.json();

      // убрать индикатор набора
      removeTypingIndicator(typingEl);

      // добавить ответ ассистента в чат, если поле reply есть и не пустое
      if (data && typeof data.reply === 'string' && data.reply.trim() !== '') {
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-message system';
        botMsg.innerHTML = '<span>' + data.reply.replace(/</g, '&lt;') + '</span>';
        chatBody.appendChild(botMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
      } else {
        // fallback, если формат ответа неожиданно другой
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-message system';
        botMsg.innerHTML = '<span>We received a response, but it has an unexpected format.</span>';
        chatBody.appendChild(botMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
      }

    } catch (err) {
      console.error('Webhook error:', err);
      console.error('Webhook URL:', CHAT_WEBHOOK_URL);
      console.error('Error details:', err.message, err.stack);
      removeTypingIndicator(typingEl);

      const errMsg = document.createElement('div');
      errMsg.className = 'chat-message system';
      errMsg.innerHTML = '<span>Connection error. Please try again a bit later.</span>';
      chatBody.appendChild(errMsg);
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }

  // Добавляем приветственное сообщение
  function addWelcomeMessage() {
    const welcome = document.createElement('div');
    welcome.className = 'chat-message system';
    welcome.innerHTML =
      '<span>Hello. This is the Azure Tower online support team.<br>' +
      'Please write your question — we will reply as quickly as possible.</span>';
    chatBody.appendChild(welcome);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // Индикатор "кто-то печатает"
  function showTypingIndicator() {
    const typing = document.createElement('div');
    typing.className = 'chat-message system chat-typing-wrapper';
    typing.innerHTML =
      '<div class="chat-typing">' +
        '<span>Online assistant is typing</span>' +
        '<div class="chat-typing-dots">' +
          '<span></span><span></span><span></span>' +
        '</div>' +
      '</div>';
    chatBody.appendChild(typing);
    chatBody.scrollTop = chatBody.scrollHeight;
    return typing;
  }

  function removeTypingIndicator(el) {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }

  function openChat() {
    if (!chatOverlay) return;
    chatOverlay.classList.remove('hidden');
    if (chatInput) {
      chatInput.focus();
    }
    if (openChatBtn) {
      openChatBtn.setAttribute('aria-expanded', 'true');
    }

    // Приветствие показываем только один раз за сессию (до перезагрузки страницы)
    if (chatBody && !chatBody.dataset.welcomeShown) {
      addWelcomeMessage();
      chatBody.dataset.welcomeShown = "1";
    }
  }

  function closeChat() {
    if (!chatOverlay) return;
    chatOverlay.classList.add('hidden');
    if (openChatBtn) {
      openChatBtn.setAttribute('aria-expanded', 'false');
    }
  }

  // Обработчик кнопки открытия чата
  function openChatHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    openChat();
  }

  if (openChatBtn) {
    openChatBtn.addEventListener('click', openChatHandler);
  }

  if (openChatBtnMobile) {
    openChatBtnMobile.addEventListener('click', openChatHandler);
  }

  // Обработчик кнопки закрытия
  if (chatCloseBtn) {
    chatCloseBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      closeChat();
    });
  }

  // Закрытие по клику на overlay
  if (chatOverlay) {
    chatOverlay.addEventListener('click', function (e) {
      if (e.target === chatOverlay) {
        closeChat();
      }
    });
  }

  // Закрытие по клавише Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && chatOverlay && !chatOverlay.classList.contains('hidden')) {
      closeChat();
    }
  });

  // Обработчик отправки формы
  if (chatForm) {
    chatForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const text = chatInput ? chatInput.value.trim() : '';
      if (!text) return;

      // Сообщение в чат — добавляем сразу:
      const msgEl = document.createElement('div');
      msgEl.className = 'chat-message user';
      msgEl.innerHTML = '<span>' + text.replace(/</g, '&lt;') + '</span>';
      if (chatBody) {
        chatBody.appendChild(msgEl);
      }
      if (chatInput) {
        chatInput.value = '';
      }
      if (chatBody) {
        chatBody.scrollTop = chatBody.scrollHeight;
      }

      // Добавляем в буфер:
      if (!pendingText) {
        pendingText = text;
      } else {
        pendingText += ' ' + text;
      }

      // Сбрасываем старый таймер, если был:
      if (pendingTimer) {
        clearTimeout(pendingTimer);
      }

      // Ставим новый таймер на 3 секунды
      pendingTimer = setTimeout(async function () {
        const toSend = pendingText;
        pendingText = '';
        pendingTimer = null;
        await sendBufferedToWebhook(toSend);
      }, 3000); // 3 секунды
    });
  }

  // Enter для отправки (Shift+Enter для новой строки)
  if (chatInput) {
    chatInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (chatForm) {
          chatForm.dispatchEvent(new Event('submit'));
        }
      }
    });
  }
});
