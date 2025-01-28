const { contextBridge, ipcRenderer } =  require("electron");

contextBridge.exposeInMainWorld("API", {
  setDeepseekKey: (key) => {
    return ipcRenderer.invoke("set-deepseek-key", key);
  },
  getDeepseekKey: () => {
    return ipcRenderer.invoke("get-deepseek-key");
  },
  sendChatMessage: (message) => {
    return ipcRenderer.invoke("send-chat-message", message);
  },
  getChatMessage: (callback) => {
    ipcRenderer.on("chat-message", callback);
  },
  selectModel: (model) => {
    return ipcRenderer.invoke("select-model", model);
  },
  getVersion: () => {
    return process.versions.electron;
  },
});
