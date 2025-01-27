const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  app.isPackaged ?
    win.loadFile("dist/index.html") : 
    win.loadURL("http://localhost:5173/");
}


app.whenReady().then(() => {
  createWindow();
});
