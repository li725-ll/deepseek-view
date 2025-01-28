const { ipcMain } = require("electron");

ipcMain.on("get-version", (event, arg) => {
    event.returnValue = "1.0.0";
});

ipcMain.on("get-platform", (event, arg) => {
    event.returnValue = process.platform;
});

ipcMain.on("get-arch", (event, arg) => {
    event.returnValue = process.arch;
});

ipcMain.on("get-node-version", (event, arg) => {
    event.returnValue = process.versions.node;
});

ipcMain.on("get-electron-version", (event, arg) => {
    event.returnValue = process.versions.electron;
});

ipcMain.on("get-chrome-version", (event, arg) => {
  event.returnValue = process.versions.chrome;
});

ipcMain.on("get-v8-version", (event, arg) => {
  event.returnValue = process.versions.v8;
});

ipcMain.on("get-os-version", (event, arg) => {
  event.returnValue = process.platform === "win32" ? process.getSystemVersion() : process.release.name;
});
