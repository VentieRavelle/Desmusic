const { contextBridge, ipcRenderer } = require('electron');

// Безопасно передаём API в окно (window.api)
contextBridge.exposeInMainWorld('api', {
  // Пример простой функции
  ping: () => 'pong',

  // Отправка сообщения в main
  send: (channel, data) => {
    const validChannels = ['play-track', 'pause-track'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },

  // Получение сообщений от main
  receive: (channel, callback) => {
    const validChannels = ['track-status', 'app-ready'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },

  // Одноразовое получение
  once: (channel, callback) => {
    ipcRenderer.once(channel, (event, ...args) => callback(...args));
  }
});