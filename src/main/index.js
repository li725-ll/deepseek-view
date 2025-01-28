const { app } = require("electron");
const windows = require("./windows");
require("./handler");

process.on("uncaughtException", (err) => {
  console.log(err);
});

app.whenReady().then(() => {
  windows.mainWindow.createWindow();
});
