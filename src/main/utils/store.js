const fsExtra = require("fs-extra");
const path = require("path");
const { app } = require("electron");

const storePath = app.isPackaged ?
  path.resolve(app.getPath("userData"), "store") : 
  path.resolve(__dirname, "../../store")

function setSettings(key, value) {
  const settings = {
    key: ""
  };

  if (!Object.keys(settings).includes(key)) {
    throw new Error(`Invalid key: ${key}`);
  } else {
    settings[key] = value;
  }
  fsExtra.ensureDirSync(storePath);
  fsExtra.writeJSONSync(path.resolve(storePath, "settings.json"), settings);
}

function getSettings(key) {
  fsExtra.ensureDirSync(storePath);
  const settings = fsExtra.readJSONSync(path.resolve(storePath, "settings.json"));
  return settings[key];
}

module.exports = {
  setSettings,
  getSettings
};