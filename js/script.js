const { contextBridge, ipcRenderer } = require('electron');
const PersianDate = require('@alireza-ab/persian-date');

contextBridge.exposeInMainWorld('electronAPI', {
    send: (channel, data) => {
        let validChannels = ['login-request'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        let validChannels = ['login-response'];
        if (validChannels.includes(channel)) {
            ipcRenderer.removeAllListeners(channel);
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },
   getPersianDate: () => {
        const persianDate = new PersianDate();
        return persianDate.toLocale('fa'); // برگرداندن تاریخ شمسی به صورت رشته فارسی
    }
});