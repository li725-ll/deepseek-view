const { windows } = require("../utils");
const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.resolve(__dirname, "../../preload/index.js"),
    },
  });
  app.isPackaged && win.setMenu(null);
  windows.addWindow("main-window", win);
  app.isPackaged ?
    win.loadFile(path.resolve(__dirname, "../../renderer/dist/index.html")) : 
    win.loadURL("http://localhost:5173/");
}

module.exports = {
  createWindow,
};