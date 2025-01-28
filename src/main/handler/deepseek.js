const { ipcMain } = require("electron") ;
const { initApi, chat, setModel } = require("../api");
const { log, store } = require("../utils");

ipcMain.handle("set-deepseek-key", (_, arg) => {
  initApi(arg);
  store.setSettings("key", arg);
  log.info("set deepseek key success.");
  return {status: true, message: "set deepseek key success.", info: null};
});

ipcMain.handle("get-deepseek-key", () => {
  const {key, model} = store.getSettings();
  initApi(key);
  setModel(model);
  log.info("get deepseek key success.");
  log.info("model:", model);
  return {status: true, message: "set deepseek key success.", info: {key, model}};
});

ipcMain.handle("select-model", (_, arg) => {
  setModel(arg);
  store.setSettings("model", arg);
  log.info(`change model: ${arg}`);
});

ipcMain.handle("send-chat-message", async (_, arg) => {
  try {
    log.info("send chat message success.");
    return await chat(arg);
  } catch (error) {
    return {status: false, message: error.message, info: null};
  }
});
