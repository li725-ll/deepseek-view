const { ipcMain } = require("electron") ;
const { initApi, chat } = require("../api");
const { log, store } = require("../utils");

ipcMain.handle("set-deepseek-key", (_, arg) => {
  initApi(arg);
  store.setSettings("key", arg);
  log.info("set deepseek key success.");
  return {status: true, message: "set deepseek key success.", info: null};
});

ipcMain.handle("get-deepseek-key", () => {
  const key = store.getSettings("key");
  initApi(key);
  log.info("get deepseek key success.");
  return {status: true, message: "set deepseek key success.", info: key};
});

ipcMain.handle("send-chat-message", async (_, arg) => {
  try {
    log.info("send chat message success.");
    return await chat(arg);
  } catch (error) {
    return {status: false, message: error.message, info: null};
  }
});
